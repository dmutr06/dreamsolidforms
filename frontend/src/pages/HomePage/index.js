import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";
import { escapeHTML } from "../../utils/htmlUtils.js";
import { navigate } from "../../utils/navigate.js";

export default class HomePage extends Page {
  constructor(params) {
    super(params);
    this.forms = [];
    this.formsListEl = null;
    this.createContainer = null;
  }

  render() {
    return /*html*/ `
      <h1 class="page-title">Available Forms</h1>
      <div class="home-container">
        <div id="create-container" class="form-item create-item">
          <a href="/create-form" data-link class="btn">Create New Form</a>
          <a href="/submissions" data-link class="btn">Submissions</a>
        </div>
        <ul id="forms-list" class="forms-list"></ul>
      </div>
    `;
  }

  afterRender() {
    this.formsListEl = document.getElementById("forms-list");
    this.createContainer = document.getElementById("create-container");

    this.loadForms();
  }

  async loadForms() {
    try {
      const forms = await api.getForms();
      this.forms = Array.isArray(forms) ? forms.reverse() : [];
      this.renderFormsList();
    } catch (err) {

      if (err.message == "Unauthorized") return navigate("/login");
      console.error(err);
      alert("Unable to load forms: " + err.message);
    }
  }

  renderFormsList() {
    this.formsListEl.innerHTML = "";

    if (this.forms.length === 0) {
      this.formsListEl.innerHTML = `<li class="no-forms">No forms found.</li>`;
      return;
    }

    this.forms.forEach((form) => {
      const li = document.createElement("li");
      li.classList.add("form-item");

      li.innerHTML = `
        <div class="form-info">
          <h3 class="form-title">${escapeHTML(form.title)}</h3>
          <p class="form-description">${
            form.description ? escapeHTML(form.description) : "No description."
          }</p>
        </div>
        <a href="/forms/${form.id}" data-link class="btn fill-btn" data-id="${form.id}">Fill</a>
      `;

      this.formsListEl.appendChild(li);
    });
  }
}
