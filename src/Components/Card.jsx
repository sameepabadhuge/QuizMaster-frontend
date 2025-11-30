import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ quiz }) {
  const navigate = useNavigate();

  if (!quiz) return null;

  const handleStartQuiz = () => {
    // Check if the student is logged in
    const studentToken = localStorage.getItem("studentToken"); // token set on login

    if (!studentToken) {
      // Redirect unregistered students to login
      navigate("/login");
    } else {
      // Navigate to quiz page
      navigate(`/take-quiz/${quiz._id}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="font-semibold text-xl mb-2">{quiz.title}</h2>
      <p className="text-sm text-gray-600">Lecture: {quiz.lectureName || "-"}</p>
      <p className="text-sm text-gray-600">Subject: {quiz.subject || "-"}</p>
      <p className="text-sm text-gray-600">Duration: {quiz.duration || "-"} min</p>
      <p className="text-sm text-gray-600">Questions: {quiz.questions?.length || 0}</p>
      <p className="text-sm text-gray-600 mb-4">Difficulty: {quiz.difficulty || "-"}</p>

      <button
        onClick={handleStartQuiz}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
      >
        Start Quiz
      </button>
    </div>
  );
}
