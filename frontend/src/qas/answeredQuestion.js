export class AnsweredQuestion {
    constructor(q, a) {
        this.question = q;
        this.answer = a;
        this.isRight = this.validateAnswer();
    }

    validateAnswer() {
        return false; 
    }

    render() {
        return "";
    }
}
