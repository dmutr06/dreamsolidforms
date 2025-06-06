import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";
import { escapeHTML } from "../../utils/htmlUtils.js";
import { navigate } from "../../utils/navigate.js";

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default class PassFormPage extends Page {
  constructor(params) {
    super(params);

    this.formId = params.id;
    this.formData = null;
    this.answers = [];
    this.domElements = {};
  }

  async loadFormData() {
    try {
      this.showLoading();
      this.formData = await api.getForm(this.formId);
      console.log(this.formData);
      this.initializeAnswers();
      this.showForm();
    } catch (err) {
      console.error("Error loading form:", err);
      this.showError("Failed to load form. Please try again later.");
    }
  }

  initializeAnswers() {
    this.answers = this.formData.questions.map(question => {
      return {
        questionId: question.id,
        type: question.type,
        info: { value: null }
      };
    });
  }

  render() {
    // Single render with all possible states in the DOM
    return /*html*/ `
      <div class="pass-form-page">
        <!-- Loading state (visible by default) -->
        <div id="loading-container" class="state-container">
          <p>Loading form...</p>
        </div>

        <!-- Error state (hidden by default) -->
        <div id="error-container" class="state-container" style="display:none">
          <p id="error-message"></p>
          <button class="btn back-button" id="back-button">Go Back</button>
        </div>

        <!-- Form state (hidden by default) -->
        <div class="pass-form-container" style="display:none">
        <div class="pass-form-info">
          <h1 class="pass-form-title"></h1>
          <p class="pass-form-description"></p>
        </div>
          <div class="pass-form-questions"></div>
          <button type="button" class="btn pass-form-submit">
            Submit Form
          </button>
        </div>
      </div>
    `;
  }

  afterRender() {
    // Cache DOM elements
    this.domElements = {
      loadingContainer: document.getElementById("loading-container"),
      errorContainer: document.getElementById("error-container"),
      errorMessage: document.getElementById("error-message"),
      backButton: document.getElementById("back-button"),
      formContainer: document.querySelector(".pass-form-container"),
      formTitle: document.querySelector(".pass-form-title"),
      formDescription: document.querySelector(".pass-form-description"),
      questionsContainer: document.querySelector(".pass-form-questions"),
      submitBtn: document.querySelector(".pass-form-submit")
    };

    // Set up event listeners
    this.domElements.backButton.addEventListener("click", () => navigate("/"));
    this.domElements.submitBtn.addEventListener("click", () => this.submitForm());


    this.loadFormData();
  }

  showLoading() {
    this.domElements.loadingContainer.style.display = "block";
    this.domElements.errorContainer.style.display = "none";
    this.domElements.formContainer.style.display = "none";
  }

  showError(message) {
    this.domElements.loadingContainer.style.display = "none";
    this.domElements.errorContainer.style.display = "block";
    this.domElements.formContainer.style.display = "none";
    this.domElements.errorMessage.textContent = message;
  }

  showForm() {
    this.domElements.loadingContainer.style.display = "none";
    this.domElements.errorContainer.style.display = "none";
    this.domElements.formContainer.style.display = "block";

    // Populate form data
    this.domElements.formTitle.textContent = escapeHTML(this.formData.title);
    if (this.formData.description) {
      this.domElements.formDescription.textContent = escapeHTML(this.formData.description);
      this.domElements.formDescription.classList.remove("no-description");
    } else {
      this.domElements.formDescription.textContent = "No description provided.";
      this.domElements.formDescription.classList.add("no-description");
    }

    this.renderQuestions();
  }

  renderQuestions() {
    this.domElements.questionsContainer.innerHTML = "";

    this.formData.questions.forEach((question, index) => {
      const questionEl = document.createElement("div");
      questionEl.className = "pass-form-question";
      questionEl.dataset.questionId = question.id;

      const label = document.createElement("label");
      label.className = "question-label";
      label.textContent = `${index + 1}. ${escapeHTML(question.label)}`;
      if (question.required) {
        label.innerHTML += '<span class="pass-form-required"> *</span>';
      }
      questionEl.appendChild(label);

      const inputWrapper = document.createElement("div");

      switch (question.type.toLowerCase()) {
        case "text":
          this.renderTextQuestion(question, inputWrapper, index);
          break;
        case "number":
          this.renderNumberQuestion(question, inputWrapper, index);
          break;
        case "choice":
          this.renderChoiceQuestion(question, inputWrapper, index);
          break;
        default:
          inputWrapper.innerHTML = `<p>Unsupported question type: ${question.type}</p>`;
      }

      questionEl.appendChild(inputWrapper);
      this.domElements.questionsContainer.appendChild(questionEl);
    });
  }

  renderTextQuestion(question, container, index) {
    const input = document.createElement("textarea");
    input.className = "pass-input";
    input.placeholder = "Type your answer here...";
    input.required = question.required;
    input.dataset.questionIndex = index;

    input.addEventListener("input", (e) => {
      this.answers[index].info.value = e.target.value;
    });

    container.appendChild(input);
  }

  renderNumberQuestion(question, container, index) {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "pass-input";
    input.placeholder = "Enter a number";
    input.required = question.required;
    input.dataset.questionIndex = index;

    input.addEventListener("input", (e) => {
      this.answers[index].info.value = e.target.value ? Number(e.target.value) : null;
    });

    container.appendChild(input);
  }

  renderChoiceQuestion(question, container, index) {
    const select = document.createElement("select");
    select.className = "pass-input";
    select.required = question.required;
    select.dataset.questionIndex = index;

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "-- Select an option --";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    select.appendChild(emptyOption);

    const options = JSON.parse(question.choices);

    const opts = options.map((option, idx) => {
      const optionEl = document.createElement("option");
      optionEl.value = idx;
      optionEl.textContent = escapeHTML(option);
      return optionEl;
    });

    shuffle(opts);

    select.append(...opts);

    select.addEventListener("change", (e) => {
      this.answers[index].info.value = e.target.value ? Number(e.target.value) : null;
    });

    container.appendChild(select);
  }

  validateForm() {
    for (let i = 0; i < this.formData.questions.length; i++) {
      const question = this.formData.questions[i];
      const answer = this.answers[i];

      if (question.required && answer.info.value === null) {
        return {
          valid: false,
          message: `Question #${i + 1} is required. Please provide an answer.`
        };
      }
    }

    return { valid: true };
  }

  async submitForm() {
    const validation = this.validateForm();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const payload = {
      formId: this.formId,
      answers: this.answers.filter(a => a.info.value != null)
    };

    try {
      console.log(payload);
      await api.submitForm(payload);
      console.log("OK");
      alert("Form submitted successfully! You can check result in your profile");
      navigate("/");
    } catch (err) {
      alert(`Error submitting form:\n${err.message}`);
      console.error(err);
    }
  }
}
