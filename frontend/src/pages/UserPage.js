import Page from "./Page.js";
export default class UserPage extends Page {
  render() {
    return `<h1>User Profile</h1><p>Hello, ${this.params.id}</p>`;
  }
}
