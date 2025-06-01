import Page from "./Page.js";

export default class LoginPage extends Page {
  render() {
    return /*html*/`
      <h1>Login</h1>
      <form id="login-form" novalidate>
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" required minlength="6" />
        </div>
        <button type="submit">Log In</button>
        <p id="error"></p>
      </form>

      <p class="switch-auth">
        Don't have an account? <a href="/register" data-link class="login-register-link">Register</a>
      </p>
    `;
  }

  afterRender() {
    const form = document.getElementById("login-form");
    const errorEl = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const email = form.email.value.trim();
      const password = form.password.value;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorEl.textContent = "Please enter a valid email.";
        return;
      }
      if (password.length < 6) {
        errorEl.textContent = "Password must be at least 6 characters.";
        return;
      }

      try {
        const fakeToken = "login_token_123";
        localStorage.setItem("token", fakeToken);

        history.pushState(null, "", "/dashboard");
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }
}
