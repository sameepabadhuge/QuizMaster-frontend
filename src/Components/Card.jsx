import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`
      p-6 rounded-2xl shadow-lg hover:shadow-2xl
      transition-all duration-300
      cursor-pointer relative overflow-hidden group
      ${isFailed 
        ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300" 
        : "bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300"
      }
      `}
    >
      {/* Background decoration */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${isFailed ? 'bg-red-400' : 'bg-blue-400'}`}></div>

      {/* Failed Badge */}
      {isFailed && (
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
        >
          ❌ Failed {failedResult?.percentage?.toFixed(0) || 0}%
        </motion.div>
      )}

      {/* Teacher Info */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200 relative z-10">
        {teacherPhoto ? (
          <img
            src={teacherPhoto}
            alt={teacherName}
            className={`w-12 h-12 rounded-full object-cover border-2 shadow-md ${isFailed ? "border-red-600" : "border-blue-600"}`}
          />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${isFailed ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-blue-500 to-blue-600"}`}>
            {teacherName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className={`text-sm font-semibold ${isFailed ? "text-red-900" : "text-blue-900"}`}>{teacherName}</p>
          <p className={`text-xs ${isFailed ? "text-red-800" : "text-blue-800"}`}>Instructor</p>
        </div>
      </div>

      {/* Quiz Title */}
      <h2 className={`font-bold text-xl mb-4 relative z-10 line-clamp-2 ${isFailed ? "text-red-800" : "text-blue-900"}`}>
        {quiz.title}
      </h2>

      {/* Quiz Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
        <div className={`flex items-center gap-3 p-3 rounded-lg ${isFailed ? "bg-red-400/20" : "bg-blue-400/20"}`}>
          <span className="text-2xl">🎓</span>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isFailed ? "text-red-900" : "text-blue-900"}`}>Subject</p>
            <p className={`font-bold text-sm mt-1 truncate ${isFailed ? "text-red-900" : "text-blue-900"}`}>{quiz.subject || "-"}</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 p-3 rounded-lg ${isFailed ? "bg-red-400/20" : "bg-blue-400/20"}`}>
          <span className="text-2xl">⏳</span>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isFailed ? "text-red-900" : "text-blue-900"}`}>Duration</p>
            <p className={`font-bold text-sm mt-1 ${isFailed ? "text-red-900" : "text-blue-900"}`}>{quiz.duration || "-"} min</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 p-3 rounded-lg ${isFailed ? "bg-red-400/20" : "bg-blue-400/20"}`}>
          <span className="text-2xl">📝</span>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isFailed ? "text-red-900" : "text-blue-900"}`}>Questions</p>
            <p className={`font-bold text-sm mt-1 ${isFailed ? "text-red-900" : "text-blue-900"}`}>{quiz.questions?.length || 0}</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 p-3 rounded-lg ${isFailed ? "bg-red-400/20" : "bg-blue-400/20"}`}>
          <span className="text-2xl">⭐</span>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isFailed ? "text-red-900" : "text-blue-900"}`}>Difficulty</p>
            <p className={`font-bold text-sm mt-1 ${isFailed ? "text-red-900" : "text-blue-900"}`}>{quiz.difficulty || "-"}</p>
          </div>
        </div>
      </div>

      {/* Show previous score for failed quizzes */}
      {isFailed && failedResult && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-5 p-3 bg-red-100 rounded-lg border border-red-300 relative z-10"
        >
          <p className="text-sm text-red-800 font-semibold">
            Previous Score: {failedResult.score}/{failedResult.totalQuestions}
          </p>
          <p className="text-xs text-red-600 mt-1">Score: {failedResult.percentage?.toFixed(0)}% | Need 50% to pass</p>
        </motion.div>
      )}

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartQuiz}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg relative z-10 flex items-center justify-center gap-2 ${
          isFailed
            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        }`}
      >
        {isFailed ? (
          <>
            <span>🔄</span>
            <span>Retry Quiz</span>
          </>
        ) : (
          <>
            <span>▶️</span>
            <span>Start Quiz</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
