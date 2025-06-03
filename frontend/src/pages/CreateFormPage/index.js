import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";

function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default class CreateFormPage extends Page {
  constructor(params) {
    super(params);
    this.title = "";
    this.description = "";
    this.questions = [
      {
        label: "",
        type: "text",
        required: false,
        info: {
          answer: ""
        }
      }
    ];
    this.selectedQuestionIndex = 0;
    this.titleInput = null;
    this.descInput = null;
    this.questionsListEl = null;
    this.addQuestionBtn = null;
    this.questionSettingsEl = null;
    this.saveFormBtn = null;
  }

  render() {
    return /*html*/ `
      <h1>Create New Form</h1>

      <div class="create-form-container">
        <div class="form-block form-basic-info">
          <label for="form-title">Form Title:</label>
          <input
            type="text"
            id="form-title"
            class="input"
            placeholder="Enter title"
            required
          />

          <label for="form-description">Description (optional):</label>
          <textarea
            id="form-description"
            class="textarea"
            placeholder="Short description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-block form-questions">
          <h2>Questions</h2>
          <ul id="questions-list" class="questions-list"></ul>
          <button
            type="button"
            id="add-question-btn"
            class="button"
            title="Add new question"
          >
            +
          </button>
        </div>

        <div class="form-block form-settings">
          <h2>Question Settings</h2>
          <div id="question-settings" class="question-settings">
            <p>Select a question on the left to configure it</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        id="save-form-btn"
        class="button submit-button"
      >
        Create Form
      </button>
    `;
  }

  afterRender() {
    this.titleInput = document.getElementById("form-title");
    this.descInput = document.getElementById("form-description");
    this.questionsListEl = document.getElementById("questions-list");
    this.addQuestionBtn = document.getElementById("add-question-btn");
    this.questionSettingsEl = document.getElementById("question-settings");
    this.saveFormBtn = document.getElementById("save-form-btn");

    this.titleInput.value = this.title;
    this.descInput.value = this.description;

    this.renderQuestionsList();
    this.renderSettingsPanel();

    this.addQuestionBtn.addEventListener("click", () => this.addQuestion());

    this.titleInput.addEventListener("input", (e) => {
      this.title = e.target.value;
    });
    this.descInput.addEventListener("input", (e) => {
      this.description = e.target.value;
    });

    this.saveFormBtn.addEventListener("click", () => this.saveForm());
  }

  addQuestion() {
    const newQuestion = {
      label: "",
      type: "text",
      required: false,
      info: {
        answer: ""
      }
    };
    this.questions.push(newQuestion);
    this.selectedQuestionIndex = this.questions.length - 1;
    this.renderQuestionsList();
    this.renderSettingsPanel();
  }

  removeQuestion(index) {
    index = parseInt(index, 10);
    if (isNaN(index) || index < 0 || index >= this.questions.length) return;

    this.questions.splice(index, 1);

    if (this.questions.length === 0) {
      this.selectedQuestionIndex = 0;
    } else if (this.selectedQuestionIndex === index) {
      this.selectedQuestionIndex = Math.min(index, this.questions.length - 1);
    } else if (this.selectedQuestionIndex > index) {
      this.selectedQuestionIndex--;
    }

    this.renderQuestionsList();
    this.renderSettingsPanel();
  }

  moveQuestion(fromIndex, toIndex) {
    fromIndex = parseInt(fromIndex, 10);
    toIndex = parseInt(toIndex, 10);
    if (
      isNaN(fromIndex) ||
      isNaN(toIndex) ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.questions.length ||
      toIndex >= this.questions.length
    ) {
      return;
    }

    const [moved] = this.questions.splice(fromIndex, 1);
    this.questions.splice(toIndex, 0, moved);

    if (this.selectedQuestionIndex === fromIndex) {
      this.selectedQuestionIndex = toIndex;
    } else if (
      this.selectedQuestionIndex > fromIndex &&
      this.selectedQuestionIndex <= toIndex
    ) {
      this.selectedQuestionIndex--;
    } else if (
      this.selectedQuestionIndex < fromIndex &&
      this.selectedQuestionIndex >= toIndex
    ) {
      this.selectedQuestionIndex++;
    }

    this.renderQuestionsList();
    this.renderSettingsPanel();
  }

  renderQuestionsList() {
    this.questionsListEl.innerHTML = "";

    this.questions.forEach((q, idx) => {
      const li = document.createElement("li");
      li.classList.add("question-item");
      li.dataset.index = idx;
      li.draggable = true;

      const label =
        q.label.trim() !== "" ? escapeHTML(q.label) : "New question";

      li.innerHTML = `
        <span class="question-index">${idx + 1}.</span>
        <span class="question-label">${label}</span>
        <button
          type="button"
          class="delete-question"
          data-index="${idx}"
          title="Delete question"
        >×</button>
      `;

      if (idx === this.selectedQuestionIndex) {
        li.classList.add("selected");
      }

      li.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete-question")) {
          this.selectedQuestionIndex = idx;
          this.renderQuestionsList();
          this.renderSettingsPanel();
        }
      });

      const deleteBtn = li.querySelector(".delete-question");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeQuestion(idx);
      });

      li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", idx);
        e.dataTransfer.effectAllowed = "move";
      });
      li.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      li.addEventListener("drop", (e) => {
        e.preventDefault();
        const fromIndex = e.dataTransfer.getData("text/plain");
        const toIndex = idx;
        this.moveQuestion(fromIndex, toIndex);
      });

      this.questionsListEl.appendChild(li);
    });
  }

  renderSettingsPanel() {
    this.questionSettingsEl.innerHTML = "";

    const q = this.questions[this.selectedQuestionIndex];
    if (!q) {
      this.questionSettingsEl.innerHTML = `<p>Add a question to start configuring</p>`;
      return;
    }

    let html = "";

    html += /*html*/ `
      <div class="setting-row">
        <label for="q-label">Text:</label>
        <input
          type="text"
          id="q-label"
          class="input"
          placeholder="Enter question text"
          value="${escapeHTML(q.label)}"
        />
      </div>
    `;

    html += /*html*/ `
      <div class="setting-row">
        <label for="q-type">Type:</label>
        <select id="q-type" class="select">
          <option value="text" ${q.type === "text" ? "selected" : ""}>
            Text
          </option>
          <option value="choice" ${q.type === "choice" ? "selected" : ""}>
            Multiple Choice
          </option>
          <option value="number" ${q.type === "number" ? "selected" : ""}>
            Number
          </option>
        </select>
      </div>
    `;

    html += /*html*/ `
      <div class="setting-row">
        <label>
          <input
            type="checkbox"
            id="q-required"
            ${q.required ? "checked" : ""}
          />
          Required
        </label>
      </div>
    `;

    if (q.type === "text") {
      html += /*html*/ `
        <div class="setting-row">
          <label for="q-text-answer">Correct Answer:</label>
          <input
            type="text"
            id="q-text-answer"
            class="input"
            placeholder="Enter answer"
            value="${escapeHTML(q.info.answer)}"
          />
        </div>
      `;
    } else if (q.type === "number") {
      html += /*html*/ `
        <div class="setting-row">
          <label for="q-number-answer">Correct Answer (number):</label>
          <input
            type="number"
            id="q-number-answer"
            class="input"
            value="${
              q.info.answer !== null && q.info.answer !== undefined
                ? q.info.answer
                : ""
            }"
          />
        </div>
      `;
      html += /*html*/ `
        <div class="setting-row">
          <label for="q-min">Minimum (optional):</label>
          <input
            type="number"
            id="q-min"
            class="input"
            value="${
              q.info.min !== null && q.info.min !== undefined
                ? q.info.min
                : ""
            }"
          />
        </div>
      `;
      html += /*html*/ `
        <div class="setting-row">
          <label for="q-max">Maximum (optional):</label>
          <input
            type="number"
            id="q-max"
            class="input"
            value="${
              q.info.max !== null && q.info.max !== undefined
                ? q.info.max
                : ""
            }"
          />
        </div>
      `;
    } else if (q.type === "choice") {
      const opts = Array.isArray(q.info.options) ? q.info.options : [];
      const correctText =
        opts[q.info.answer] !== undefined ? opts[q.info.answer] : "";

      html += /*html*/ `
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
        if (i === q.info.answer) return;
        let wrongIdx = i < q.info.answer ? i : i - 1;
        html += /*html*/ `
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
              class="button delete-wrong-option"
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
        html += /*html*/ `
          <button
            type="button"
            id="add-wrong-option-btn"
            class="button"
            title="Add another incorrect answer"
          >
            +
          </button>
        `;
      }
    }

    this.questionSettingsEl.innerHTML = html;

    this.attachSettingsListeners();
  }

  attachSettingsListeners() {
    const idx = this.selectedQuestionIndex;
    const q = this.questions[idx];
    if (!q) return;

    const labelInput = document.getElementById("q-label");
    if (labelInput) {
      labelInput.addEventListener("input", (e) => {
        q.label = e.target.value;
        this.renderQuestionsList();
      });
    }

    const typeSelect = document.getElementById("q-type");
    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        const newType = e.target.value;
        if (newType === q.type) return;

        q.type = newType;
        q.info = {};

        if (newType === "text") {
          q.info = { answer: "" };
        } else if (newType === "number") {
          q.info = {
            answer: null,
            min: null,
            max: null
          };
        } else if (newType === "choice") {
          q.info = {
            options: [""],
            answer: 0
          };
        }

        this.renderQuestionsList();
        this.renderSettingsPanel();
      });
    }

    const requiredCheckbox = document.getElementById("q-required");
    if (requiredCheckbox) {
      requiredCheckbox.addEventListener("change", (e) => {
        q.required = e.target.checked;
      });
    }

    if (q.type === "text") {
      const textAns = document.getElementById("q-text-answer");
      if (textAns) {
        textAns.addEventListener("input", (e) => {
          q.info.answer = e.target.value;
        });
      }
    } else if (q.type === "number") {
      const numAns = document.getElementById("q-number-answer");
      if (numAns) {
        numAns.addEventListener("input", (e) => {
          const v = parseFloat(e.target.value);
          q.info.answer = isNaN(v) ? null : v;
        });
      }
      const minInput = document.getElementById("q-min");
      if (minInput) {
        minInput.addEventListener("input", (e) => {
          const v = parseFloat(e.target.value);
          q.info.min = isNaN(v) ? null : v;
        });
      }
      const maxInput = document.getElementById("q-max");
      if (maxInput) {
        maxInput.addEventListener("input", (e) => {
          const v = parseFloat(e.target.value);
          q.info.max = isNaN(v) ? null : v;
        });
      }
    } else if (q.type === "choice") {
      const correctInput = document.getElementById("q-correct-answer");
      if (correctInput) {
        correctInput.addEventListener("input", (e) => {
          const text = e.target.value;
          if (!Array.isArray(q.info.options)) {
            q.info.options = [];
            q.info.answer = 0;
          }
          q.info.options[0] = text;
        });
      }

      const wrongInputs = this.questionSettingsEl.querySelectorAll(
        ".q-wrong-answer"
      );
      wrongInputs.forEach((inputEl) => {
        inputEl.addEventListener("input", (e) => {
          const wrongIdx = parseInt(e.target.dataset.index, 10);
          if (isNaN(wrongIdx)) return;
          q.info.options[wrongIdx + 1] = e.target.value;
        });
      });

      const deleteBtns =
        this.questionSettingsEl.querySelectorAll(".delete-wrong-option");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const wrongIdx = parseInt(e.target.dataset.index, 10);
          if (isNaN(wrongIdx)) return;
          q.info.options.splice(wrongIdx + 1, 1);
          this.renderSettingsPanel();
        });
      });

      const addWrongBtn = document.getElementById("add-wrong-option-btn");
      if (addWrongBtn) {
        addWrongBtn.addEventListener("click", () => {
          if (!Array.isArray(q.info.options)) {
            q.info.options = [];
            q.info.answer = 0;
          }
          if (q.info.options.length < 10) {
            q.info.options.push("");
            this.renderSettingsPanel();
          }
        });
      }
    }
  }

  async saveForm() {
    const title = this.titleInput.value.trim();
    if (!title) {
      alert("Please enter a form title.");
      this.titleInput.focus();
      return;
    }

    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (!q.label || q.label.trim() === "") {
        alert(`Question #${i + 1} text cannot be empty.`);
        return;
      }
      if (q.type === "text") {
        if (!q.info.answer || q.info.answer.trim() === "") {
          alert(`Question #${i + 1} requires a correct text answer.`);
          return;
        }
      }
      if (q.type === "number") {
        const ans = q.info.answer;
        if (ans === null || ans === undefined || isNaN(ans)) {
          alert(`Question #${i + 1} requires a numerical answer.`);
          return;
        }
        if (
          q.info.min !== null &&
          q.info.max !== null &&
          q.info.min > q.info.max
        ) {
          alert(
            `In question #${i + 1}, "minimum" cannot be greater than "maximum".`
          );
          return;
        }
      }
      if (q.type === "choice") {
        const opts = Array.isArray(q.info.options) ? q.info.options : [];
        if (opts.length < 2) {
          alert(
            `In question #${i + 1}, multiple choice requires at least 2 options (1 correct and 1 incorrect).`
          );
          return;
        }
        for (let j = 0; j < opts.length; j++) {
          if (!opts[j] || opts[j].trim() === "") {
            alert(
              `In question #${i + 1}, option #${j + 1} cannot be empty.`
            );
            return;
          }
        }
      }
    }

    const payloadQuestions = this.questions.map((q) => {
      const dto = {
        label: q.label,
        type: q.type
      };
      if (q.required) {
        dto.required = true;
      }

      if (q.type === "text") {
        dto.info = {
          answer: q.info.answer
        };
      } else if (q.type === "number") {
        dto.info = {
          answer: q.info.answer
        };
        if (q.info.min !== null && q.info.min !== undefined) {
          dto.info.min = q.info.min;
        }
        if (q.info.max !== null && q.info.max !== undefined) {
          dto.info.max = q.info.max;
        }
      } else if (q.type === "choice") {
        dto.info = {
          options: q.info.options,
          answer: q.info.answer
        };
      }

      return dto;
    });

    const payload = {
      title,
      description: this.descInput.value.trim(),
      questions: payloadQuestions
    };

    try {
      await api.createForm(payload);
      alert("Form created successfully!");
      history.pushState(null, "", "/");
      window.dispatchEvent(new Event("popstate"));
    } catch (err) {
      alert(`Error creating form:\n${err.message}`);
      console.error(err);
    }
  }
}
