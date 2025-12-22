import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ quiz, isFailed = false, failedResult = null }) {
  const navigate = useNavigate();

  if (!quiz) return null;

  const handleStartQuiz = () => {
    const studentToken = sessionStorage.getItem("studentToken");
    if (!studentToken) {
      navigate("/login");
    } else {
      navigate(`/take-quiz/${quiz._id}`);
    }
  };

  // Get teacher info from populated data
  const teacher = quiz.teacherId;
  const teacherName = teacher?.firstName && teacher?.lastName 
    ? `${teacher.firstName} ${teacher.lastName}` 
    : quiz.lectureName || "Unknown Teacher";
  const teacherPhoto = teacher?.profilePicture || "";

  return (
    <div
      className={`
      p-6 rounded-xl shadow-lg
      hover:scale-105 hover:shadow-xl transition-all duration-300
      cursor-pointer relative
      ${isFailed 
        ? "bg-red-50 border-2 border-red-300" 
        : "bg-white border border-gray-200"
      }
      `}
    >
      {/* Failed Badge */}
      {isFailed && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ❌ Failed - {failedResult?.percentage?.toFixed(0) || 0}%
        </div>
      )}

      {/* Teacher Info */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        {teacherPhoto ? (
          <img
            src={teacherPhoto}
            alt={teacherName}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {teacherName.charAt(0).toUpperCase()}
          </div>
        )}
        <p className="text-sm font-semibold text-gray-800">{teacherName}</p>
      </div>

      <h2 className={`font-bold text-xl mb-3 ${isFailed ? "text-red-800" : "text-gray-900"}`}>
        {quiz.title}
      </h2>
      <p className="text-sm text-gray-600 mb-1">📚 Subject: {quiz.subject || "-"}</p>
      <p className="text-sm text-gray-600 mb-1">⏱️ Duration: {quiz.duration || "-"} min</p>
      <p className="text-sm text-gray-600 mb-1">❓ Questions: {quiz.questions?.length || 0}</p>
      <p className="text-sm text-gray-600 mb-4">🎯 Difficulty: {quiz.difficulty || "-"}</p>

      {/* Show previous score for failed quizzes */}
      {isFailed && failedResult && (
        <div className="mb-4 p-3 bg-red-100 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium">
            Previous Score: {failedResult.score}/{failedResult.totalQuestions} ({failedResult.percentage?.toFixed(0)}%)
          </p>
          <p className="text-xs text-red-600 mt-1">You need 50% or more to pass</p>
        </div>
      )}

      <button
        onClick={handleStartQuiz}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg ${
          isFailed
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        }`}
      >
        {isFailed ? "🔄 Retry Quiz" : "Start Quiz"}
      </button>
    </div>
  );
}
