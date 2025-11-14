import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/student/quiz/${quizId}`)
      .then((res) => {
        setQuizData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading Quiz...
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        Quiz Not Found!
      </div>
    );
  }

  const question = quizData.questions[currentIndex];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/student/submit-quiz", {
        quizId,
        answers,
      })
      .then(() => {
        navigate("/quiz-result");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Nav />

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        
        {/* Quiz Title */}
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          {quizData.title}
        </h2>

        {/* Question Progress */}
        <div className="text-right mb-4 font-semibold text-gray-700">
          Question {currentIndex + 1} / {quizData.questions.length}
        </div>

        {/* Question Box */}
        <div className="p-5 border rounded-lg bg-gray-50 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4">{question.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`block p-3 border rounded-lg cursor-pointer transition ${
                  answers[currentIndex] === option
                    ? "bg-blue-100 border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  className="mr-2"
                  checked={answers[currentIndex] === option}
                  onChange={() => handleOptionSelect(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className={`px-6 py-2 rounded-md font-semibold ${
              currentIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Previous
          </button>

          {currentIndex + 1 === quizData.questions.length ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}

