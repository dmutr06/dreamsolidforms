import "./style.css";
import Page from "../Page.js";
import { api } from "../../api.js";

export default class HomePage extends Page {
  render() {
    return `
      <h1>Home</h1>
      <p>
        Welcome to the home page, 
        <span class="user-name">...</span>.
      </p>
    `;
  }

  afterRender() {
    const usernameEl = document.querySelector(".user-name");

    (async () => {
      try {
        const res = await api.getMe();
        usernameEl.textContent = res.name;
      } catch (err) {
        history.pushState(null, "", "/login");
        window.dispatchEvent(new Event("popstate"));
      }
    })();
  }
}