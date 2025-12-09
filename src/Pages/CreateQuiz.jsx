import React, { useState } from "react";
import axios from "axios";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [lectureName, setLectureName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);

  const addQuestion = () =>
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);

  const removeQuestion = (i) =>
    setQuestions(questions.filter((_, index) => index !== i));

  const handleQuestionChange = (i, value) => {
    const q = [...questions];
    q[i].text = value;
    setQuestions(q);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const q = [...questions];
    q[qIndex].options[oIndex] = value;
    setQuestions(q);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const q = [...questions];
    q[qIndex].correctIndex = oIndex;
    setQuestions(q);
  };

  const handleSaveQuiz = async () => {
    // Validation
    if (!quizTitle.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          alert(`Question ${i + 1}, Option ${j + 1} is empty`);
          return;
        }
      }
    }

    try {
      const payload = {
        title: quizTitle,
        description: quizDescription,
        lectureName,
        subject,
        duration: parseInt(duration) || 10,
        difficulty,
        teacherId: localStorage.getItem("teacherId"),
        questions: questions.map((q) => ({
          question: q.text,
          options: q.options,
          correctAnswer: q.correctIndex,
        })),
      };

      console.log("Sending payload:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/createquiz",
        payload
      );

      console.log("Response:", res.data);

      if (res.data.success) {
        alert("Quiz saved successfully!");
        setQuizTitle("");
        setQuizDescription("");
        setLectureName("");
        setSubject("");
        setDuration(10);
        setDifficulty("Easy");
        setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save quiz";
      alert("Failed to save quiz: " + errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Create New Quiz</h2>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quiz Details</h3>
          
          <input type="text" placeholder="Quiz Title" value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input type="text" placeholder="Lecture Name" value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input type="text" placeholder="Subject" value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input type="number" placeholder="Duration (min)" value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <select value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Questions</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border-2 border-gray-200 p-5 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question {qIndex + 1}</label>
              <input type="text" placeholder={`Enter question ${qIndex + 1}`} value={q.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <div className="space-y-2 mb-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex gap-3 items-center">
                    <input type="radio" name={`correct-${qIndex}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => handleCorrectChange(qIndex, oIndex)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                ))}
              </div>

              <button  
                onClick={() => removeQuestion(qIndex)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
              >
                Remove Question
              </button>
            </div>
          ))}

          <button onClick={addQuestion} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            + Add Question
          </button>
        </div>

        <button onClick={handleSaveQuiz} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Save Quiz
        </button>
      </div>
    </div>
  );
}
