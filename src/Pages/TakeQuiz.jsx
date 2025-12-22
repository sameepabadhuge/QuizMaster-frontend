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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-bold text-center mb-2">{quizData.title}</h2>

        <div className="flex justify-between mb-4 text-sm">
          <span>
            Question {currentIndex + 1} / {quizData.questions.length}
          </span>
          {quizData.duration ? (
            <span className="font-semibold text-red-600">
              Time Left: {formatTime(timeLeft)}
            </span>
          ) : (
            <span>No time limit</span>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`block border p-3 rounded cursor-pointer ${
                answers[currentIndex] === option
                  ? "bg-blue-50 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`q-${currentIndex}`}
                checked={answers[currentIndex] === option}
                onChange={() => handleOptionSelect(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex + 1 === quizData.questions.length ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
