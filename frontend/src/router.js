import NotFoundPage from "./pages/NotFoundPage.js";

export default class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener("popstate", () => this.render());
    window.addEventListener("load", () => this.render());
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-link]");
      if (link) {
        e.preventDefault();
        history.pushState(null, "", link.href);
        this.render();
      }
    });
  }

  match(pathname) {
    const pathParts = pathname.split("/").filter(Boolean);
    for (const [path, component] of Object.entries(this.routes)) {
      const routeParts = path.split("/").filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < routeParts.length; i++) {
        const r = routeParts[i], p = pathParts[i];
        if (r.startsWith(":")) params[r.slice(1)] = p;
        else if (r !== p) { matched = false; break; }
      }
      if (matched) return { component, params };
    }
    return { component: NotFoundPage, params: {} };
  }

  render() {
  const { component, params } = this.match(window.location.pathname);
  const view = new component(params);
  const app = document.getElementById("app");

  app.innerHTML = view.render();

  if (typeof view.afterRender === "function") {
    view.afterRender();
  }
}
}
