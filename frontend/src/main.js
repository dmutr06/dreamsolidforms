import "./style.css";

import Router from "./router.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";

new Router({
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
});
