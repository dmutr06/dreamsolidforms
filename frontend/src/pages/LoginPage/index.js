import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";

export default class LoginPage extends Page {
  render() {
    return /*html*/`
      <h1>Login</h1>
      <form id="login-form" novalidate>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" required minlength="6" />
        </div>
        <button type="submit">Log In</button>
        <p id="error" class="error-msg"></p>
      </form>

      <p class="switch-auth">
        Don't have an account? 
        <a href="/register" data-link class="login-register-link">Register</a>
      </p>
    `;
  }

  afterRender() {
    const form = document.getElementById("login-form");
    const errorEl = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const name = form.name.value.trim();
      const password = form.password.value;

      if (!name || !password) {
        errorEl.textContent = "Please fill in all fields";
        return;
      }

      try {
        await api.login({ name, password });

        history.pushState(null, "", "/dashboard");
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }
}
