import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Animation helper for staggered option appearance
const getDelayClass = (index) => {
  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400'];
  return delays[index] || '';
};

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 relative">
      {/* Background Pattern/Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="max-w-lg w-full">
          {/* Quiz Card - Popup Style */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-fade-in-scale">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
                {quizData.title}
              </h2>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-white">
                    Question <span className="text-yellow-300 font-bold">{currentIndex + 1}</span> / <span className="text-white/80">{quizData.questions.length}</span>
                  </span>
                </div>
                {quizData.duration ? (
                  <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
                    timeLeft <= 30 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : timeLeft <= 60 
                        ? 'bg-yellow-400 text-yellow-900' 
                        : 'bg-white/20 text-white'
                  }`}>
                    <span>⏱️</span>
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <span className="text-white/80 bg-white/20 px-4 py-2 rounded-full text-sm">No time limit</span>
                )}
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 md:p-6" key={currentIndex}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{question.question}</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => (
                  <label
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`block border-2 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      answers[currentIndex] === option
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500 shadow-lg transform scale-[1.02]"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        answers[currentIndex] === option
                          ? 'border-blue-500 bg-blue-500 shadow-md'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {answers[currentIndex] === option && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="radio"
                        name={`q-${currentIndex}`}
                        checked={answers[currentIndex] === option}
                        onChange={() => handleOptionSelect(option)}
                        className="sr-only"
                      />
                      <span className={`ml-4 text-base font-medium transition-colors duration-200 ${
                        answers[currentIndex] === option ? 'text-blue-700 font-semibold' : 'text-gray-700'
                      }`}>{option}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentIndex + 1) / quizData.questions.length) * 100)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="progress-bar-animated h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / quizData.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center gap-3">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  className="btn-animated px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center gap-2 text-sm"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {quizData.questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-4 bg-blue-500'
                          : answers[idx]
                            ? 'bg-green-400'
                            : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentIndex + 1 === quizData.questions.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-animated px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 text-sm"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>✓ Submit</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    className="btn-animated px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
