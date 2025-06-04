import "./global.css";

import Router from "./router.js";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateFormPage from "./pages/CreateFormPage";
import NotFoundPage from "./pages/NotFoundPage";

new Router({
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/create-form": CreateFormPage,
});