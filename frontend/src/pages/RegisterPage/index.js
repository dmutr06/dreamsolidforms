import "./style.css";
import Page from "../Page.js";

import { api } from "../../api.js";

export default class RegisterPage extends Page {
  render() {
    return /*html*/`
      <h1>Register</h1>
      <form id="register-form" novalidate>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" required minlength="6" />
        </div>
        <div>
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" required minlength="6" />
        </div>
        <button type="submit">Sign Up</button>
        <p id="error" class="error-msg"></p>
      </form>

      <p class="switch-auth">
        Already have an account? 
        <a href="/login" data-link class="login-register-link">Log in</a>
      </p>
    `;
  }

  afterRender() {
    const form = document.getElementById("register-form");
    const errorEl = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const name = form.name.value.trim();
      const password = form.password.value;
      const confirm = form["confirm-password"].value;

      if (password !== confirm) {
        errorEl.textContent = "Passwords do not match";
        return;
      }
      if (!name || !password) {
        errorEl.textContent = "Please fill in all fields";
        return;
      }

      try {
        await api.register({ name, password });
        history.pushState(null, "", "/dashboard");
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }
}
