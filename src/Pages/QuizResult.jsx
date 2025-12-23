import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

// Confetti celebration component
const Confetti = ({ isActive }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'];
    const newConfetti = [];

    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      });
    }

    setConfetti(newConfetti);

    const timeout = setTimeout(() => {
      setConfetti([]);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [isActive]);

  if (!isActive || confetti.length === 0) return null;

  return (
    <div className="confetti-container">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.color,
            width: `${c.size}px`,
            height: `${c.size}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Star burst animation component
const StarBurst = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${10 + Math.floor(i / 4) * 30}%`,
            animation: `star-burst 1.5s ease-out ${i * 0.1}s forwards`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultId } = useParams();

  const [allResults, setAllResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isNewResult, setIsNewResult] = useState(false);

  const role = sessionStorage.getItem("role");
  const studentId = sessionStorage.getItem("studentId");
  const isTeacher = role === "teacher";

  // Fetch all quiz results for the student
  useEffect(() => {
    const fetchAllResults = async () => {
      // Skip fetching for teachers
      if (isTeacher) {
        setLoading(false);
        return;
      }

      if (!studentId) {
        console.warn("⚠️ No studentId found in sessionStorage");
        setLoading(false);
        return;
      }

      try {
        console.log("📊 Fetching results for studentId:", studentId);
        const res = await axios.get(
          `http://localhost:5000/api/students/student-results/${studentId}`
        );
        console.log("📊 Results response:", res.data);
        if (res.data.success) {
          setAllResults(res.data.results || []);
        }
      } catch (err) {
        console.error("❌ Error fetching results:", err);
        // Show empty results instead of leaving loading state
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [studentId, isTeacher]);

  // If there's a resultId in URL or location state, fetch that specific result
  useEffect(() => {
    if (location.state) {
      setSelectedResult(location.state);
      setIsNewResult(true);
    } else if (resultId) {
      fetchResultDetail(resultId);
      setIsNewResult(true);
    }
  }, [resultId, location.state]);

  // Trigger celebration when quiz is passed
  useEffect(() => {
    if (selectedResult && isNewResult) {
      const percentage = selectedResult.percentage || 0;
      if (percentage >= 50) {
        setShowCelebration(true);
        // Stop celebration after 6 seconds
        const timeout = setTimeout(() => {
          setShowCelebration(false);
          setIsNewResult(false);
        }, 6000);
        return () => clearTimeout(timeout);
      }
    }
  }, [selectedResult, isNewResult]);

  const fetchResultDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/students/quiz-result/${id}`
      );
      if (res.data.success) {
        setSelectedResult(res.data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching result detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResultClick = (result) => {
    fetchResultDetail(result._id);
  };

  const handleBackToList = () => {
    setSelectedResult(null);
    navigate("/quiz-result", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading results...</p>
      </div>
    );
  }

  // Teacher view - show appropriate message
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            📊 Quiz Results
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Teacher View
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              As a teacher, you can view student quiz submissions and results through the <strong>"Student Results"</strong> section in the sidebar.
            </p>
            <p className="text-gray-500 text-sm">
              This page displays personal quiz results for students only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show detailed result view
  if (selectedResult) {
    const quizTitle = selectedResult.quizTitle || "Quiz Results";
    const score = selectedResult.score || 0;
    const totalQuestions = selectedResult.totalQuestions || 0;
    const percentage = selectedResult.percentage || 0;
    const results = Array.isArray(selectedResult.results) ? selectedResult.results : [];
    const quizId = selectedResult.quizId || selectedResult.quiz;

    const handleRetryQuiz = () => {
      if (quizId) {
        navigate(`/take-quiz/${quizId}`);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Celebration Effects */}
        <Confetti isActive={showCelebration} />
        
        <div className="p-10 relative z-10">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 flex items-center gap-2 animate-fade-in-up"
          >
            ← Back to All Results
          </button>

          {detailLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading details...</p>
            </div>
          ) : (
            <>
              {/* Celebration Banner for Passed Quiz */}
              {percentage >= 50 && showCelebration && (
                <div className="mb-8 animate-celebrate-bounce">
                  <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
                    <StarBurst isActive={showCelebration} />
                    <div className="relative z-10">
                      <div className="text-6xl mb-4 animate-trophy-shine">🏆</div>
                      <h2 className="text-4xl font-bold mb-2">Congratulations!</h2>
                      <p className="text-xl opacity-90">You passed the quiz with flying colors!</p>
                      <div className="mt-4 flex justify-center gap-4 text-4xl">
                        <span className="animate-float" style={{ animationDelay: '0s' }}>🎉</span>
                        <span className="animate-float" style={{ animationDelay: '0.2s' }}>⭐</span>
                        <span className="animate-float" style={{ animationDelay: '0.4s' }}>🌟</span>
                        <span className="animate-float" style={{ animationDelay: '0.6s' }}>🎊</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Failed Banner */}
              {percentage < 50 && isNewResult && (
                <div className="mb-8 animate-fade-in-up">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-6 text-center text-white shadow-xl">
                    <div className="text-5xl mb-3">💪</div>
                    <h2 className="text-2xl font-bold mb-2">Keep Going!</h2>
                    <p className="text-lg opacity-90 mb-4">Don't give up! Review your answers and try again.</p>
                    {quizId && (
                      <button
                        onClick={handleRetryQuiz}
                        className="mt-2 px-8 py-3 bg-white text-orange-500 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
                      >
                        <span>🔄</span>
                        <span>Retry Quiz</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 hover:shadow-xl transition-all duration-300 animate-fade-in-scale ${percentage >= 50 && showCelebration ? 'success-glow' : ''}`}>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  📊 Quiz Results
                </h1>
                <h2 className="text-lg text-gray-600 mb-6">{quizTitle}</h2>

                {/* Score Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 border-l-4 border-blue-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-slide-in-left">
                    <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">Score</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {score}/{totalQuestions}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                      percentage >= 50
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-green-600"
                        : "bg-gradient-to-br from-red-50 to-red-100 border-red-600"
                    }`}
                  >
                    <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">Percentage</p>
                    <p
                      className={`text-3xl font-bold mt-1 ${
                        percentage >= 50 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-slide-in-right ${
                    percentage >= 50 
                      ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-600" 
                      : "bg-gradient-to-br from-red-50 to-red-100 border-red-600"
                  }`}>
                    <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">Status</p>
                    <p
                      className={`text-lg font-bold mt-1 flex items-center gap-2 ${
                        percentage >= 50 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage >= 50 ? (
                        <><span className="text-2xl">✅</span> Passed</>
                      ) : (
                        <><span className="text-2xl">❌</span> Failed</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Breakdown */}
              {results.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>❓</span> Question Breakdown
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {results.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl shadow-sm p-4 border-l-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
                          item.isCorrect
                            ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500"
                            : "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
                        }`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-800 text-sm">
                            Q{idx + 1}: {item.question}
                          </p>
                          <span className={`text-2xl ${item.isCorrect ? 'animate-bounce-subtle' : ''}`}>
                            {item.isCorrect ? "✅" : "❌"}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-gray-700">
                            <span className="font-semibold">Your Answer:</span>{" "}
                            <span className={`font-medium ${item.isCorrect ? "text-green-600" : "text-red-600"}`}>
                              {item.userAnswer || "Not answered"}
                            </span>
                          </p>
                          {!item.isCorrect && percentage >= 50 && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Correct Answer:</span>{" "}
                              <span className="text-green-600 font-bold">
                                {item.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in-up">
                  <p className="text-gray-600 text-lg">
                    No question details available.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Show list of all quiz results
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          📋 My Quiz Results
        </h1>

        {allResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <p className="text-gray-600 text-lg mb-6">
              You haven't completed any quizzes yet.
            </p>
            <button
              onClick={() => navigate("/quiz-list")}
              className="px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-200"
            >
              Browse Quizzes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {allResults.map((result) => {
              const teacher = result.teacher;
              const teacherName = teacher?.firstName && teacher?.lastName 
                ? `${teacher.firstName} ${teacher.lastName}` 
                : "Unknown Teacher";
              const teacherPhoto = teacher?.profilePicture || "";

              return (
                <div
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  {/* Teacher Info */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
                    {teacherPhoto ? (
                      <img
                        src={teacherPhoto}
                        alt={teacherName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {teacherName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{teacherName}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4 truncate line-clamp-2">
                    {result.quizTitle}
                  </h3>
                  
                  {/* Score Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Score</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        {result.score}/{result.totalQuestions}
                      </p>
                    </div>
                    
                    <div className={`rounded-lg p-3 border-l-4 ${result.percentage >= 50 ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Percentage</p>
                      <p className={`text-lg font-bold mt-1 ${result.percentage >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {result.percentage}%
                      </p>
                    </div>
                    
                    <div className={`rounded-lg p-3 border-l-4 ${result.percentage >= 50 ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                      <p className={`text-lg font-bold mt-1 ${result.percentage >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {result.percentage >= 50 ? "✅ Pass" : "❌ Fail"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    🕐 {new Date(result.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform group-hover:scale-105">
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
