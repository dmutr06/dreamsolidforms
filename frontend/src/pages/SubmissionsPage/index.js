import { api } from "../../api";
import { navigate } from "../../utils/navigate";
import Page from "../Page";

import "./style.css";

export default class SubmissionsPage extends Page {
    constructor() {
        super();

        this.submissions = [];
    }
    render() {
        return `
            <h1 class="page-title">Your submissions</h1>
            <ul class="submissions-list"></ul> 
            
        `
    }


    async afterRender() {
        await this.loadSubmissions();
    }

    async loadSubmissions() {
        try {
            this.submissions = await api.getMySubmissions();
            this.renderSubmissions();
        } catch (e) {
            if (e.message == "Unauthorized") return navigate("/login")

            alert("Error:", e.message);
        }
    }

    renderSubmissions() {
        const listEl = document.querySelector(".submissions-list"); 
        listEl.innerHTML = "";

        const items = this.submissions.map(sub => {
            const li = document.createElement("li");

            const link = document.createElement("a");
            link.dataset.link = "";
            link.href = `/submissions/${sub.id}`;
            link.textContent = sub.form.title;

            li.appendChild(link);

            return li;
        });

        listEl.append(...items);
    }
}
