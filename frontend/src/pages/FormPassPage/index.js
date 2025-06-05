import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";

export default class FormPassPage extends Page {
  constructor(params) {
    super();
    this.formId = params.id;
    this.form = null;
    this.answers = {};
  }

  render() {
    return `
      <div class="form-pass-page">
        <h1 class="form-title">Завантаження форми...</h1>
        <p class="form-description"></p>
        <form id="form-pass-form"></form>
      </div>
    `;
  }

  async afterRender() {
    try {
      this.form = await api.getForm(this.formId);

      document.querySelector(".form-title").textContent = this.form.title;
      document.querySelector(".form-description").textContent = this.form.description || "";

      const formEl = document.getElementById("form-pass-form");
      formEl.innerHTML = this.form.questions
        .map(
          (q) => `
            <div class="question-block">
              <label>${q.label}</label>
              <input type="text" data-question-id="${q.id}" />
            </div>
          `
        )
        .join("");

      document.querySelectorAll("input[data-question-id]").forEach((input) => {
        input.addEventListener("input", (e) => {
          const questionId = e.target.getAttribute("data-question-id");
          this.answers[questionId] = e.target.value;
        });
      });

      formEl.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
          await api.sendResponse(this.formId, { answers: JSON.stringify(this.answers) });
          alert("Форму успішно надіслано!");
          this.answers = {};
          history.back();
        } catch (err) {
          console.error("Помилка при надсиланні відповіді:", err);
        }
      });
    } catch (err) {
      console.error("Помилка при завантаженні форми:", err);
    }
  }
}
