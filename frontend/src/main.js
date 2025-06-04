import "./global.css";

import Router from "./router.js";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FormPassPage from "./pages/FormPassPage";
import ResultsPage from "./pages/ResultsPage";
import NotFoundPage from "./pages/NotFoundPage";



new Router({
  "/": HomePage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/forms/:id/pass": FormPassPage,
  "/forms/:id/results": ResultsPage,
});

const router = new Router(routes);