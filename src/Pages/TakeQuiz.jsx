import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const submitLock = useRef(false);

  // ============================
  // FETCH QUIZ
  // ============================
  useEffect(() => {
    const studentToken = sessionStorage.getItem("studentToken");
    if (!studentToken) {
      alert("You must be logged in to take this quiz!");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/createquiz/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      })
      .then((res) => {
        const data = res.data;

        if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
          setLoadError("Quiz data is invalid or empty.");
          setLoading(false);
          return;
        }

        setQuizData(data);

        const duration = Number(data.duration);
        if (duration > 0) {
          setTimeLeft(duration * 60); // minutes → seconds
        }

        setLoading(false);
      })
      .catch(() => {
        setLoadError("Failed to load quiz.");
        setLoading(false);
      });
  }, [quizId, navigate]);

  // ============================
  // TIMER (AUTO SUBMIT)
  // ============================
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      if (!submitLock.current) {
		handleSubmit(); // ⏰ AUTO SUBMIT
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ============================
  // HANDLERS
  // ============================
  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleSubmit = async () => {
    if (submitLock.current) return;
    submitLock.current = true;

    const studentId = sessionStorage.getItem("studentId");
    if (!studentId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/submit-quiz",
        { quizId, answers, studentId },
        { headers: { "Content-Type": "application/json" } }
      );

      navigate(`/quiz-result/${res.data.resultId}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz.");
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  // ============================
  // RENDER SAFETY
  // ============================
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (loadError) return <div className="text-center mt-10 text-red-600">{loadError}</div>;

  const safeIndex = Math.min(currentIndex, quizData.questions.length - 1);
  const question = quizData.questions[safeIndex];

  if (!question || !Array.isArray(question.options)) {
    return (
      <div className="text-center mt-10 text-red-600">
        Invalid question format. Options missing.
      </div>
    );
  }

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">{quizData.title}</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-700">
                Question <span className="text-blue-600">{currentIndex + 1}</span> / <span className="text-gray-500">{quizData.questions.length}</span>
              </span>
            </div>
            {quizData.duration ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  <span className={`${timeLeft <= 30 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                    ⏱️ {formatTime(timeLeft)}
                  </span>
                </span>
              </div>
            ) : (
              <span className="text-gray-600">No time limit</span>
            )}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white shadow-lg p-4 md:p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h3>
            <div className="h-1 w-16 bg-blue-600 rounded"></div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`block border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  answers[currentIndex] === option
                    ? "bg-blue-50 border-blue-600 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`q-${currentIndex}`}
                    checked={answers[currentIndex] === option}
                    onChange={() => handleOptionSelect(option)}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-3 text-lg text-gray-800 font-medium">{option}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizData.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Previous
            </button>

            <div className="text-center text-sm text-gray-600 font-medium flex items-center">
              {currentIndex + 1} of {quizData.questions.length}
            </div>

            {currentIndex + 1 === quizData.questions.length ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
              >
                {submitting ? "Submitting..." : "✓ Submit"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
