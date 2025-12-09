import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ quiz }) {
  const navigate = useNavigate();

  if (!quiz) return null;

  const handleStartQuiz = () => {
    const studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
      navigate("/login");
    } else {
      navigate(`/take-quiz/${quiz._id}`);
    }
  };

  return (
    <div
      className="
      bg-white p-6 rounded-xl shadow-lg
      hover:scale-105 hover:shadow-xl transition-all duration-300
      cursor-pointer border border-gray-200
      "
    >
      <h2 className="font-bold text-xl mb-3 text-gray-900">{quiz.title}</h2>
      <p className="text-sm text-gray-600 mb-1">📖 Lecture: {quiz.lectureName || "-"}</p>
      <p className="text-sm text-gray-600 mb-1">📚 Subject: {quiz.subject || "-"}</p>
      <p className="text-sm text-gray-600 mb-1">⏱️ Duration: {quiz.duration || "-"} min</p>
      <p className="text-sm text-gray-600 mb-1">❓ Questions: {quiz.questions?.length || 0}</p>
      <p className="text-sm text-gray-600 mb-4">🎯 Difficulty: {quiz.difficulty || "-"}</p>

      <button
        onClick={handleStartQuiz}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
      >
        Start Quiz
      </button>
    </div>
  );
}
