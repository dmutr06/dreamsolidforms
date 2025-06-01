import "./style.css";
import Router from "./router.js";
import HomePage from "./pages/HomePage.js";
import AboutPage from "./pages/AboutPage.js";
import UserPage from "./pages/UserPage.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";

new Router({
  "/": HomePage,
  "/about": AboutPage,
  "/user/:id": UserPage,
  "/login": LoginPage,
  "/register": RegisterPage,
});
