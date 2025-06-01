import Page from "./Page.js";

export default class RegisterPage extends Page {
  render() {
    return /*html*/`
      <h1>Register</h1>
      <form id="register-form" novalidate>
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" required />
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
        Already have an account? <a href="/login" data-link class="login-register-link">Log in</a>
      </p>
    `;
  }

  afterRender() {
    const form = document.getElementById("register-form");
    const errorEl = document.getElementById("error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      const email = form.email.value.trim();
      const password = form.password.value;
      const confirm = form["confirm-password"].value;

      if (password !== confirm) {
        errorEl.textContent = "Passwords do not match";
        return;
      }

      try {

        if (!email || !password) {
          throw new Error("Please fill in all fields");
        }
        const fakeToken = "registered_token_123";
        localStorage.setItem("token", fakeToken);

        history.pushState(null, "", "/dashboard");
        window.dispatchEvent(new Event("popstate"));
      } catch (err) {
        errorEl.textContent = err.message;
      }
    });
  }
}
