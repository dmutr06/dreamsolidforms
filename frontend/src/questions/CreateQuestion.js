import { escapeHTML } from "../utils/htmlUtils.js";

export default class CreateQuestion {
  constructor(label = "", required = false) {
    this.label = label;
    this.required = required;
    this.type = "";
    this.info = {};
  }

  getSettingsUI() {
    return `
      <div class="setting-row">
        <label for="q-label">Question Text:</label>
        <input
          type="text"
          id="q-label"
          class="input"
          placeholder="Enter question text"
          value="${escapeHTML(this.label)}"
        />
      </div>
      <div class="setting-row">
        <label for="q-type">Type:</label>
        <select id="q-type" class="select">
          <option value="text" ${this.type === "text" ? "selected" : ""}>
            Text
          </option>
          <option value="choice" ${this.type === "choice" ? "selected" : ""}>
            Multiple Choice
          </option>
          <option value="number" ${this.type === "number" ? "selected" : ""}>
            Number
          </option>
        </select>
      </div>
      <div class="setting-row">
        <label>
          <input
            type="checkbox"
            id="q-required"
            ${this.required ? "checked" : ""}
          />
          Required
        </label>
      </div>
      ${this.getSpecificSettingsUI()}
    `;
  }

  attachSettingsListeners(container, onSettingsChanged) {
    const labelInput = container.querySelector("#q-label");
    if (labelInput) {
      labelInput.addEventListener("input", (e) => {
        this.label = e.target.value;
      });
    }

    const requiredCheckbox = container.querySelector("#q-required");
    if (requiredCheckbox) {
      requiredCheckbox.addEventListener("change", (e) => {
        this.required = e.target.checked;
      });
    }

    this.attachSpecificListeners(container, onSettingsChanged);
  }

  getSpecificSettingsUI() {
    throw new Error("getSpecificSettingsUI() must be implemented in subclass");
  }

  attachSpecificListeners(container, onSettingsChanged) {
    throw new Error("attachSpecificListeners() must be implemented in subclass");
  }

  validate() {
    throw new Error("validate() must be implemented in subclass");
  }

  toDTO() {
    throw new Error("toDTO() must be implemented in subclass");
  }
}
