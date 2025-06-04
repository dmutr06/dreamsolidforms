import Question from "./Question.js";

export default class NumberQuestion extends Question {
  constructor(label = "", required = false, answer = null, min = null, max = null) {
    super(label, required);
    this.type = "number";
    this.info = { answer, min, max };
  }

  getSpecificSettingsUI() {
    return `
      <div class="setting-row">
        <label for="q-number-answer">Correct Answer (number):</label>
        <input
          type="number"
          id="q-number-answer"
          class="input"
          value="${this.info.answer !== null && this.info.answer !== undefined ? this.info.answer : ""}"
        />
      </div>
      <div class="setting-row">
        <label for="q-min">Minimum (optional):</label>
        <input
          type="number"
          id="q-min"
          class="input"
          value="${this.info.min !== null && this.info.min !== undefined ? this.info.min : ""}"
        />
      </div>
      <div class="setting-row">
        <label for="q-max">Maximum (optional):</label>
        <input
          type="number"
          id="q-max"
          class="input"
          value="${this.info.max !== null && this.info.max !== undefined ? this.info.max : ""}"
        />
      </div>
    `;
  }

  attachSpecificListeners(container, onSettingsChanged) {
    const numAns = container.querySelector("#q-number-answer");
    if (numAns) {
      numAns.addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        this.info.answer = isNaN(v) ? null : v;
      });
    }
    const minInput = container.querySelector("#q-min");
    if (minInput) {
      minInput.addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        this.info.min = isNaN(v) ? null : v;
      });
    }
    const maxInput = container.querySelector("#q-max");
    if (maxInput) {
      maxInput.addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        this.info.max = isNaN(v) ? null : v;
      });
    }
  }

  validate() {
    if (!this.label.trim()) {
      return { ok: false, message: "Question text cannot be empty." };
    }
    const ans = this.info.answer;
    if (ans === null || ans === undefined || isNaN(ans)) {
      return { ok: false, message: "Numerical answer is required." };
    }
    if (
      this.info.min !== null &&
      this.info.max !== null &&
      this.info.min > this.info.max
    ) {
      return { ok: false, message: "Minimum cannot be greater than maximum." };
    }
    return { ok: true };
  }

  toDTO() {
    const dto = {
      label: this.label,
      type: this.type,
      info: { answer: this.info.answer },
    };
    if (this.info.min !== null && this.info.min !== undefined) {
      dto.info.min = this.info.min;
    }
    if (this.info.max !== null && this.info.max !== undefined) {
      dto.info.max = this.info.max;
    }
    if (this.required) {
      dto.required = true;
    }
    return dto;
  }
}
