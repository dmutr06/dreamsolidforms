

export function navigate(path) {
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("popstate"));
}
