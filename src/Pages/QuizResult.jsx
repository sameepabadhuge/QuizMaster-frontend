import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultId } = useParams();

  const [allResults, setAllResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

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
    } else if (resultId) {
      fetchResultDetail(resultId);
    }
  }, [resultId, location.state]);

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

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-10">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            ← Back to All Results
          </button>

          {detailLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading details...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl shadow-xl p-8 mb-10 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  📊 Quiz Results
                </h1>
                <h2 className="text-xl text-gray-600 mb-6">{quizTitle}</h2>

                {/* Score Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Score</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                      {score}/{totalQuestions}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-6 border-l-4 shadow-md hover:shadow-lg transition-shadow ${
                      percentage >= 50
                        ? "bg-gradient-to-br from-green-50 to-green-100 border-green-600"
                        : "bg-gradient-to-br from-red-50 to-red-100 border-red-600"
                    }`}
                  >
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Percentage</p>
                    <p
                      className={`text-4xl font-bold mt-2 ${
                        percentage >= 50 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Status</p>
                    <p
                      className={`text-lg font-bold mt-2 ${
                        percentage >= 50 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage >= 50 ? "✅ Passed" : "❌ Failed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Breakdown */}
              {results.length > 0 ? (
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 mt-8 hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8">
                    ❓ Question Breakdown
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {results.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-all duration-200 ${
                          item.isCorrect
                            ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500"
                            : "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="font-semibold text-gray-800 text-lg">
                            Q{idx + 1}: {item.question}
                          </p>
                          <span className="text-3xl">
                            {item.isCorrect ? "✅" : "❌"}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-semibold">Your Answer:</span>{" "}
                            <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                              {item.userAnswer || "Not answered"}
                            </span>
                          </p>
                          {!item.isCorrect && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Correct Answer:</span>{" "}
                              <span className="text-green-600 font-semibold">
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
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-200"
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
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
                >
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

                  <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
                    {result.quizTitle}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-semibold text-blue-600">
                        {result.score}/{result.totalQuestions}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Percentage:</span>
                      <span className={`font-semibold ${result.percentage >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {result.percentage}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${result.percentage >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {result.percentage >= 50 ? "✅ Passed" : "❌ Failed"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(result.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-200">
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
