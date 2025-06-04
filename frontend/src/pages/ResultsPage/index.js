import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";

export default class ResultsPage extends Page {
  constructor(params) {
    super();
    this.formId = params.id;
    this.responses = [];
  }

  render() {
    return `
      <div class="results-page">
        <h1 class="results-title">Завантаження відповідей...</h1>
        <div class="responses-container"></div>
      </div>
    `;
  }

  async afterRender() {
    try {
      
      this.responses = await api.getResponses(this.formId);

      document.querySelector(".results-title").textContent = `Відповіді на форму #${this.formId}`;

      const container = document.querySelector(".responses-container");

      if (this.responses.length === 0) {
        container.innerHTML = `<p>Поки немає відповідей.</p>`;
        return;
      }

      container.innerHTML = this.responses
        .map((response) => {
          const answers = JSON.parse(response.answers);
          const answersHtml = Object.entries(answers)
            .map(([qId, answer]) => `<li>Питання ${qId}: ${answer}</li>`)
            .join("");

          return `
            <div class="response-block">
              <h3>Відповідь #${response.id}</h3>
              <ul>${answersHtml}</ul>
            </div>
          `;
        })
        .join("");
    } catch (err) {
      console.error("Помилка при отриманні відповідей:", err);
    }
  }
}
