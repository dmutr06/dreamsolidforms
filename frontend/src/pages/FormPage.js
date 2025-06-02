const form = {
    id: "some id",
    title: "My form",
    user_id: "some user id",
    description: "This is my form",
    questions: [
        { id: "some id", label: "question 1", type: "text", order_index: 0, text_answer: "right answer" },
        { id: "some id", label: "question 1", type: "number", order_index: 0, number_answer: 10 },
    ]
}

class FormPage extends Page {
    constructor(params) {
        super(params);
        // getForm(params.id)
        this.form = form;
    }

    async getForm(id) {
        this.form = await api.getForm(id); 
    }
}
