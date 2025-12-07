import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultId } = useParams();

  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(false);

  // 🔹 1. Load saved result from localStorage on refresh
  useEffect(() => {
    if (!data) {
      const saved = localStorage.getItem("latestQuizResult");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("📌 Loaded quiz result from localStorage:", parsed);
        setData(parsed);
      }
    }
  }, []);

  // 🔹 2. Fetch result from backend if resultId exists
  useEffect(() => {
    if (resultId && !location.state && !data) {
      const fetchResult = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/students/quiz-result/${resultId}`
          );
          console.log("📥 Backend quiz result response:", res.data);

          const resultData = res.data.data || res.data;

          setData(resultData);

          // Save in localStorage for future
          localStorage.setItem(
            "latestQuizResult",
            JSON.stringify(resultData)
          );
        } catch (err) {
          console.error("❌ Error fetching result:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ❌ No Results Found
          </h1>
          <p className="text-gray-600 mb-6">
            Please take a quiz first, then submit it to see results.
          </p>
          <button
            onClick={() => navigate("/quiz-list")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const quizTitle = data.quizTitle || "Quiz Results";
  const score = data.score || 0;
  const totalQuestions = data.totalQuestions || 0;
  const percentage = data.percentage || 0;
  const results = Array.isArray(data.results) ? data.results : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100  p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            📊 Quiz Results
          </h1>
          <h2 className="text-xl text-gray-600 mb-6">{quizTitle}</h2>

          {/* Score Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold">Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {score}/{totalQuestions}
              </p>
            </div>

            <div
              className={`rounded-lg p-4 border-l-4 ${
                percentage >= 50
                  ? "bg-green-50 border-green-600"
                  : "bg-red-50 border-red-600"
              }`}
            >
              <p className="text-gray-600 text-sm font-semibold">Percentage</p>
              <p
                className={`text-3xl font-bold ${
                  percentage >= 50 ? "text-green-600" : "text-red-600"
                }`}
              >
                {percentage}%
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
              <p className="text-gray-600 text-sm font-semibold">Status</p>
              <p
                className={`text-lg font-bold ${
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
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Question Breakdown
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl shadow-md p-6 border-l-4 ${
                    item.isCorrect
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-gray-800">
                      Q{idx + 1}: {item.question}
                    </p>
                    <span className="text-2xl">
                      {item.isCorrect ? "✅" : "❌"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Your Answer:</span>{" "}
                      <span className="text-blue-600">
                        {item.userAnswer || "Not answered"}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      <span className="text-green-600">
                        {item.correctAnswer}
                      </span>
                    </p>
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

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/quiz-list")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Back to Quizzes
          </button>
          
        </div>
      </div>
    </div>
  );
}
