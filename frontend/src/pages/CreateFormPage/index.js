import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";
import { escapeHTML } from "../../utils/htmlUtils.js";
import TextQuestion from "../../questions/CreateTextQuestion.js";
import NumberQuestion from "../../questions/CreateNumberQuestion.js";
import ChoiceQuestion from "../../questions/CreateChoiceQuestion.js";
import { navigate } from "../../utils/navigate.js";

export default class CreateFormPage extends Page {
  constructor(params) {
    super(params);

    this.titleMaxLength = 35;

    this.descriptionMaxLength = 150;

    this.title = "";
    this.description = "";
    this.questions = [new TextQuestion()];
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
            maxlength="${this.titleMaxLength}"
          />

          <label for="form-description">Description (optional):</label>
          <textarea
            id="form-description"
            class="textarea"
            placeholder="Short description"
            rows="3"
            maxlength="${this.descriptionMaxLength}"
          ></textarea>
        </div>

        <div class="form-block form-questions">
          <h2>Questions</h2>
          <ul id="questions-list" class="questions-list"></ul>
          <button
            type="button"
            id="add-question-btn"
            class="btn new-question-btn"
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
        class="btn submit-button"
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
    const newQuestion = new TextQuestion();
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
      this.questionSettingsEl.innerHTML = `<p>Select a question on the left to configure it</p>`;
      return;
    }

    this.questionSettingsEl.innerHTML = q.getSettingsUI();

    const index = this.selectedQuestionIndex;
    const typeSelect = this.questionSettingsEl.querySelector("#q-type");

    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        const newType = e.target.value;
        const old = this.questions[index];
        let newQ;
        if (newType === "text") {
          newQ = new TextQuestion(old.label, old.required, "");
        } else if (newType === "number") {
          newQ = new NumberQuestion(old.label, old.required, null, null, null);
        } else if (newType === "choice") {
          newQ = new ChoiceQuestion(old.label, old.required, [""], 0);
        } else {
          return;
        }
        this.questions[index] = newQ;
        this.renderQuestionsList();
        this.renderSettingsPanel();
      });
    }

    q.attachSettingsListeners(this.questionSettingsEl, () => {
      this.renderSettingsPanel();
    });
  }

  async saveForm() {
    const title = this.titleInput.value.trim();
    if (!title) { 
      alert("Please enter a form title."); 
      this.titleInput.focus(); 
      return; 
    }
    if (title.length > this.titleMaxLength) {
      alert(`Title must be at most ${this.titleMaxLength} characters.`);
      this.titleInput.focus();
      return;
    }

    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      const result = q.validate();
      if (!result.ok) {
        alert(`Question #${i + 1}: ${result.message}`);
        return;
      }
    }

    const description = this.descInput.value.trim();
    if (description.length > this.descriptionMaxLength) {
      alert(`Description must be at most ${this.descriptionMaxLength} characters.`);
      this.descInput.focus();
      return;
    }

    const payloadQuestions = this.questions.map((q) => q.toDTO());
    const payload = {
      title,
      description,
      questions: payloadQuestions,
    };

    try {
      await api.createForm(payload);
      alert("Form created successfully!");
      navigate("/");
    } catch (err) {
      alert(`Error creating form:\n${err.message}`);
      console.error(err);
    }
  }
}
