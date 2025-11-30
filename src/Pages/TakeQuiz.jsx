import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 🔒 Check if student is logged in
    const studentToken = localStorage.getItem("studentToken"); // token stored at login
    if (!studentToken) {
      alert("You must be logged in to take this quiz!");
      navigate("/login"); // redirect unregistered student
      return;
    }

    // Fetch quiz data if logged in
    axios
      .get(`http://localhost:5000/api/createquiz/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${studentToken}` } // optional: backend can verify
      })
      .then((res) => {
        setQuizData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [quizId, navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!quizData) return <div className="text-center mt-10">Quiz not found!</div>;

  const question = quizData.questions[currentIndex];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting!");
      return;
    }

    setSubmitting(true);

    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      alert("You are not logged in properly. Please log in again.");
      setSubmitting(false);
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/submit-quiz",
        { quizId, answers, studentId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.resultId) {
        navigate(`/quiz-result/${res.data.resultId}`);
      } else {
        const resultData = {
          quizTitle: res.data.quizTitle || "Quiz",
          score: res.data.score || 0,
          totalQuestions: res.data.totalQuestions || 0,
          percentage: res.data.percentage || 0,
          results: res.data.results || []
        };
        navigate("/quiz-result", { state: resultData });
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      alert(`Error submitting quiz: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">{quizData.title}</h2>

      <div className="text-right mb-4">
        Question {currentIndex + 1} / {quizData.questions.length}
      </div>

      <div className="p-5 border rounded-lg bg-gray-50 mb-6">
        <h3 className="text-xl font-bold mb-4">{question.question}</h3>
        {question.options.map((option, idx) => (
          <label
            key={idx}
            className={`block p-3 border rounded-lg cursor-pointer mb-2 ${
              answers[currentIndex] === option ? "bg-blue-100 border-blue-600" : ""
            }`}
          >
            <input
              type="radio"
              name={`question-${currentIndex}`}
              checked={answers[currentIndex] === option}
              onChange={() => handleOptionSelect(option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex + 1 === quizData.questions.length ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
