import CreateQuestion from "./CreateQuestion.js";
import { escapeHTML } from "../utils/htmlUtils.js";

export default class CreateTextQuestion extends CreateQuestion {
  constructor(label = "", required = false, answer = "") {
    super(label, required);
    this.type = "text";
    this.info = { answer };
  }

  getSpecificSettingsUI() {
    return `
      <div class="setting-row">
        <label for="q-text-answer">Correct Answer:</label>
        <input
          type="text"
          id="q-text-answer"
          class="input"
          placeholder="Enter answer"
          value="${escapeHTML(this.info.answer)}"
        />
      </div>
    `;
  }

  attachSpecificListeners(container, onSettingsChanged) {
    const ansInput = container.querySelector("#q-text-answer");
    if (ansInput) {
      ansInput.addEventListener("input", (e) => {
        this.info.answer = e.target.value;
      });
    }
  }

  validate() {
    if (!this.label.trim()) {
      return { ok: false, message: "Question text cannot be empty." };
    }
    if (!this.info.answer.trim()) {
      return { ok: false, message: "Correct answer cannot be empty." };
    }
    return { ok: true };
  }

  toDTO() {
    const dto = {
      label: this.label,
      type: this.type,
      info: { answer: this.info.answer },
    };
    if (this.required) {
      dto.required = true;
    }
    return dto;
  }
}
