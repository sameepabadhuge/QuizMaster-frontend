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
      bg-blue-100 p-6 rounded-3xl shadow
      hover:scale-105 transition-transform duration-300
      cursor-pointer drop-shadow-lg
      "
    >
      <h2 className="font-semibold text-xl mb-2">{quiz.title}</h2>
      <p className="text-sm text-gray-600">Lecture: {quiz.lectureName || "-"}</p>
      <p className="text-sm text-gray-600">Subject: {quiz.subject || "-"}</p>
      <p className="text-sm text-gray-600">Duration: {quiz.duration || "-"} min</p>
      <p className="text-sm text-gray-600">Questions: {quiz.questions?.length || 0}</p>
      <p className="text-sm text-gray-600 mb-4">Difficulty: {quiz.difficulty || "-"}</p>

      <button
        onClick={handleStartQuiz}
        className="mt-2 w-1/4 bg-blue-600 hover:bg-blue-400 text-white py-4 rounded-3xl bg-center"
      >
        Start Quiz
      </button>
    </div>
  );
}
