import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

export default function FormPassPage() {
  const { id } = useParams(); 
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

 
  useEffect(() => {
    fetch(`http://localhost:6969/api/forms/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Помилка при завантаженні форми:", err));
  }, [id]);


  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:6969/api/forms/${id}/response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: JSON.stringify(answers) }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Форму успішно надіслано!");
       
        setAnswers({});
      })
      .catch((err) => console.error("Помилка при надсиланні відповіді:", err));
  };

  if (!form) return <div>Завантаження форми...</div>;

  return (
    <div className="form-pass-page">
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      <form onSubmit={handleSubmit}>
        {form.questions.map((q) => (
          <div key={q.id} className="question-block">
            <label>{q.text}</label>
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Відправити</button>
      </form>
    </div>
  );
}
