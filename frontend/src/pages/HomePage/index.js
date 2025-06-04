import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";
import { escapeHTML } from "../../utils/htmlUtils.js";

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
          <button id="create-btn" class="button create-btn">Create New Form</button>
        </div>
        <ul id="forms-list" class="forms-list"></ul>
      </div>
    `;
  }

  afterRender() {
    this.formsListEl = document.getElementById("forms-list");
    this.createContainer = document.getElementById("create-container");
    const createBtn = document.getElementById("create-btn");

    createBtn.addEventListener("click", () => {
      history.pushState(null, "", "/create-form");
      window.dispatchEvent(new Event("popstate"));
    });

    this.loadForms();
  }

  async loadForms() {
    try {
      const forms = await api.getForms();
      this.forms = Array.isArray(forms) ? forms.reverse() : [];
      this.renderFormsList();
    } catch (err) {
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
        <div class="buttons-group">
          <button class="button fill-btn" data-id="${form.id}">Fill</button>
          <button class="button delete-btn" data-id="${form.id}">Delete</button>
        </div>
      `;

      const fillBtn = li.querySelector(".fill-btn");
      fillBtn.addEventListener("click", () => {
        history.pushState(null, "", `/form/${form.id}`);
        window.dispatchEvent(new Event("popstate"));
      });

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this form?")) return;
        try {
          await api.deleteForm(form.id);
          this.loadForms();
        } catch (err) {
          console.error(err);
          alert("Unable to delete form: " + err.message);
        }
      });

      this.formsListEl.appendChild(li);
    });
  }
}
