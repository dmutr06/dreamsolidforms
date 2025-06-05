import "./styles/global.css";
import "./styles/auth.css";

import Router from "./router.js";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateFormPage from "./pages/CreateFormPage";
import FormPassPage from "./pages/FormPassPage";

new Router({
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/create-form": CreateFormPage,
  "/forms/:id": FormPassPage,
});
