import { api } from "../../api";
import { AnsweredQuestionFactory } from "../../qas/answeredQuestionsFactory";
import { navigate } from "../../utils/navigate";
import Page from "../Page";

import "./style.css";

export default class SubmissionPage extends Page {
    constructor(params) {
        super(params);

        this.submissionId = params.id;
        this.submission = null;

        this.domElements = {};
    }

    render() {
        return `
            <div class="submission-container">
                <div class="submission-info">
                  <h1 class="submission-title"></h1>
                  <p class="submission-description"></p>
                </div>
                <ul class="submission-answers"></ul>
            </div>
        `;
    }

    async afterRender() {
        this.domElements.title = document.querySelector(".submission-title")
        this.domElements.description = document.querySelector(".submission-description");
        this.domElements.answers = document.querySelector(".submission-answers");

        await this.loadSubmission();

        this.domElements.title.textContent = this.submission.form.title;
        this.domElements.description.textContent = this.submission.form.description || "";

        const questions = this.submission.form.questions;
        const answers = this.submission.answers;

        const qas = questions.map(q => {
            const ans = answers.find(ans => ans.questionId === q.id);
            if (!ans && q.required) {
                alert("Bad submission");
                return navigate("/");
            }

            const renderer = AnsweredQuestionFactory.create(q, ans);

            const li = document.createElement("li");
            li.innerHTML = renderer.render();
            if (ans) {
                li.classList.add(renderer.isRight ? "answer-right" : "answer-wrong")
            }

            return li;
        });

        this.domElements.answers.append(...qas);
    }

    async loadSubmission() {
        try {
            this.submission = await api.getSubmission(this.submissionId);
        } catch (e) {
            if (e.message == "Unauthorized") return navigate("/login");

            alert("Error:", e.message);
        }
    }
}
