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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-center">{quizData.title}</h2>
          <div className="text-center mt-2 text-blue-100">
            Question {currentIndex + 1} / {quizData.questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  answers[currentIndex] === option 
                    ? "bg-blue-50 border-blue-600 shadow-md" 
                    : "border-gray-300 hover:border-blue-400 bg-white"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    checked={answers[currentIndex] === option}
                    onChange={() => handleOptionSelect(option)}
                    className="mr-3 w-5 h-5 text-blue-600"
                  />
                  <span className="text-lg text-gray-800">{option}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            ← Previous
          </button>

          {currentIndex + 1 === quizData.questions.length ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {submitting ? "Submitting..." : "✓ Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
