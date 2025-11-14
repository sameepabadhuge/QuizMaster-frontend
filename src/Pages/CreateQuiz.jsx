import React, { useState } from "react";
import axios from "axios";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [lectureName, setLectureName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);

  const addQuestion = () => setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, index) => index !== i));
  const handleQuestionChange = (i, value) => { const q = [...questions]; q[i].text = value; setQuestions(q); };
  const handleOptionChange = (qIndex, oIndex, value) => { const q = [...questions]; q[qIndex].options[oIndex] = value; setQuestions(q); };
  const handleCorrectChange = (qIndex, oIndex) => { const q = [...questions]; q[qIndex].correctIndex = oIndex; setQuestions(q); };

  const handleSaveQuiz = async () => {
    try {
      const payload = {
        title: quizTitle,
        subject,
        lectureName,
        duration,
        difficulty,
        questions: questions.map(q => ({
          questionText: q.text,
          options: q.options,
          correctAnswer: q.correctIndex,
        })),
      };

      const res = await axios.post("http://localhost:5000/api/quiz/create", payload);

      if (res.data.success) {
        alert("Quiz saved successfully!");
        setQuizTitle(""); setQuizDescription(""); setLectureName(""); setSubject(""); setDuration(10); setDifficulty("Easy"); setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Create New Quiz</h2>

      <div className="bg-white p-6 rounded shadow mb-6">
        <input type="text" placeholder="Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
        <input type="text" placeholder="Lecture Name" value={lectureName} onChange={(e) => setLectureName(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
        <input type="number" placeholder="Duration (min)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded-lg mb-4">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-bold mb-4">Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 border p-4 rounded bg-gray-50">
            <input type="text" placeholder={`Question ${qIndex + 1}`} value={q.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} className="w-full p-2 border rounded mb-2" />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex gap-2 mb-2 items-center">
                <input type="radio" name={`correct-${qIndex}`} checked={q.correctIndex === oIndex} onChange={() => handleCorrectChange(qIndex, oIndex)} />
                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-1 p-2 border rounded" />
              </div>
            ))}
            <button onClick={() => removeQuestion(qIndex)} className="bg-red-500 text-white px-2 py-1 rounded">Remove Question</button>
          </div>
        ))}
        <button onClick={addQuestion} className="bg-blue-500 text-white px-3 py-2 rounded">+ Add Question</button>
      </div>

      <button onClick={handleSaveQuiz} className="w-full bg-green-600 text-white py-2 px-4 rounded">Save Quiz</button>
    </div>
  );
}
