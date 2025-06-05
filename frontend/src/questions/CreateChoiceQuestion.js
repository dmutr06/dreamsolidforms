import CreateQuestion from "./CreateQuestion.js";
import { escapeHTML } from "../utils/htmlUtils.js";

export default class CreateChoiceQuestion extends CreateQuestion {
  constructor(label = "", required = false, options = [""], answerIndex = 0) {
    super(label, required);
    this.type = "choice";
    this.info = { options: options.slice(), answer: answerIndex };
  }

  getSpecificSettingsUI() {
    const opts = Array.isArray(this.info.options) ? this.info.options : [];
    const correctText =
      opts[this.info.answer] !== undefined ? opts[this.info.answer] : "";
    let html = `
      <div class="setting-row">
        <label for="q-correct-answer">Correct Answer:</label>
        <input
          type="text"
          id="q-correct-answer"
          class="input"
          placeholder="Enter correct answer"
          value="${escapeHTML(correctText)}"
        />
      </div>
      <div id="incorrect-options" class="incorrect-options-container">
        <h4>Incorrect Answers:</h4>
    `;
    opts.forEach((optText, i) => {
      if (i === this.info.answer) return;
      const wrongIdx = i < this.info.answer ? i : i - 1;
      html += `
        <div class="wrong-option-block">
          <input
            type="text"
            class="input q-wrong-answer"
            data-index="${wrongIdx}"
            placeholder="Incorrect answer"
            value="${escapeHTML(optText)}"
          />
          <button
            type="button"
            class="btn delete-wrong-option"
            data-index="${wrongIdx}"
            title="Delete this answer"
          >
            ×
          </button>
        </div>
      `;
    });
    html += `</div>`;
    if (opts.length < 10) {
      html += `
        <button
          type="button"
          id="add-wrong-option-btn"
          class="btn"
          title="Add another incorrect answer"
        >
          +
        </button>
      `;
    }
    return html;
  }

  attachSpecificListeners(container, onSettingsChanged) {
    const correctInput = container.querySelector("#q-correct-answer");
    if (correctInput) {
      correctInput.addEventListener("input", (e) => {
        if (!Array.isArray(this.info.options)) {
          this.info.options = [];
          this.info.answer = 0;
        }
        this.info.options[this.info.answer] = e.target.value;
      });
    }

    const wrongInputs = container.querySelectorAll(".q-wrong-answer");
    wrongInputs.forEach((inputEl) => {
      inputEl.addEventListener("input", (e) => {
        const wrongIdx = parseInt(e.target.dataset.index, 10);
        if (isNaN(wrongIdx)) return;
        this.info.options[wrongIdx + 1] = e.target.value;
      });
    });

    const deleteBtns = container.querySelectorAll(".delete-wrong-option");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const wrongIdx = parseInt(e.target.dataset.index, 10);
        if (isNaN(wrongIdx)) return;
        this.info.options.splice(wrongIdx + 1, 1);
        onSettingsChanged();
      });
    });

    const addWrongBtn = container.querySelector("#add-wrong-option-btn");
    if (addWrongBtn) {
      addWrongBtn.addEventListener("click", () => {
        if (!Array.isArray(this.info.options)) {
          this.info.options = [];
          this.info.answer = 0;
        }
        if (this.info.options.length < 10) {
          this.info.options.push("");
          onSettingsChanged();
        }
      });
    }
  }

  validate() {
    if (!this.label.trim()) {
      return { ok: false, message: "Question text cannot be empty." };
    }
    const opts = Array.isArray(this.info.options) ? this.info.options : [];
    if (opts.length < 2) {
      return {
        ok: false,
        message:
          "Multiple choice requires at least 2 options (1 correct and 1 incorrect).",
      };
    }
    for (let j = 0; j < opts.length; j++) {
      if (!opts[j] || opts[j].trim() === "") {
        return { ok: false, message: `Option #${j + 1} cannot be empty.` };
      }
    }
    return { ok: true };
  }

  toDTO() {
    const dto = {
      label: this.label,
      type: this.type,
      info: {
        options: this.info.options.slice(),
        answer: this.info.answer,
      },
    };
    if (this.required) {
      dto.required = true;
    }
    return dto;
  }
}
