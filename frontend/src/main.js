import "./styles/global.css";
import "./styles/auth.css";

import Router from "./router.js";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateFormPage from "./pages/CreateFormPage";
import PassFormPage from "./pages/PassFormPage/index.js";
import SubmissionsPage from "./pages/SubmissionsPage/index.js";
import SubmissionPage from "./pages/SubmissionPage/index.js";

new Router({
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/create-form": CreateFormPage,
  "/forms/:id": PassFormPage,
  "/submissions": SubmissionsPage,
  "/submissions/:id": SubmissionPage,
});
