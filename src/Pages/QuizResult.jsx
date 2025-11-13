import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ If quiz data is passed via navigate("/quizresult", { state: quizData })
  const quizData =
    location.state || {
      title: "Introduction to React Hooks",
      score: 7,
      total: 10,
      percentage: 70,
      timeTaken: "12:25",
      questions: [
        {
          id: 1,
          question:
            "Which hook is used for state management in functional components?",
          correctAnswer: "useState",
          userAnswer: "useState",
          isCorrect: true,
          explanation:
            "useState allows functional components to manage local state.",
        },
        {
          id: 2,
          question: "Which hook can be used to perform side effects?",
          correctAnswer: "useEffect",
          userAnswer: "useCallback",
          isCorrect: false,
          explanation:
            "useEffect handles side effects such as data fetching or subscriptions.",
        },
        {
          id: 3,
          question: "How do you access context in functional components?",
          correctAnswer: "useContext",
          userAnswer: "useReducer",
          isCorrect: false,
          explanation:
            "useContext allows access to context values provided by Context.Provider.",
        },
        {
          id: 4,
          question: "What is the purpose of useCallback?",
          correctAnswer:
            "To memoize functions to prevent unnecessary re-renders",
          userAnswer: "To memoize values",
          isCorrect: true,
          explanation:
            "useCallback memoizes functions between re-renders for optimization.",
        },
        {
          id: 5,
          question: "When should you use useMemo?",
          correctAnswer: "To memoize expensive calculations",
          userAnswer: "To handle side effects",
          isCorrect: true,
          explanation:
            "useMemo optimizes performance by memoizing computed values.",
        },
        {
          id: 6,
          question: "What does useRef do?",
          correctAnswer: "Accesses or stores mutable DOM references",
          userAnswer: "Stores state values",
          isCorrect: false,
          explanation:
            "useRef provides a way to persist mutable values across renders.",
        },
        {
          id: 7,
          question:
            "Which hook is generally preferred for managing complex state logic?",
          correctAnswer: "useReducer",
          userAnswer: "useReducer",
          isCorrect: true,
          explanation:
            "useReducer simplifies managing state with multiple transitions.",
        },
        {
          id: 8,
          question: "Can you call hooks inside loops or conditionals?",
          correctAnswer: "No, hooks must be called at the top level",
          userAnswer: "Yes, inside loops",
          isCorrect: false,
          explanation:
            "Hooks must always be called at the top level of React functions.",
        },
        {
          id: 9,
          question: "What is the main benefit of using hooks?",
          correctAnswer: "Reusing stateful logic without classes",
          userAnswer: "Improving rendering performance",
          isCorrect: true,
          explanation:
            "Hooks simplify component logic and promote reusability.",
        },
        {
          id: 10,
          question: "Which hook is used for optimizing expensive calculations?",
          correctAnswer: "useMemo",
          userAnswer: "useCallback",
          isCorrect: false,
          explanation:
            "useMemo memoizes computed values to avoid recalculations.",
        },
      ],
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-2xl p-6 mt-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Quiz Results
        </h1>

        {/* Summary Section */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-medium text-gray-700">{quizData.title}</h2>
          <p className="text-gray-600 text-sm">Time Taken: {quizData.timeTaken}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              Score: {quizData.score}/{quizData.total}
            </span>
            <span
              className={`text-lg font-semibold ${
                quizData.percentage >= 50 ? "text-green-600" : "text-red-600"
              }`}
            >
              {quizData.percentage}%
            </span>
          </div>
        </div>

        {/* Question Breakdown */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Question Breakdown
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {quizData.questions.map((q) => (
            <div
              key={q.id}
              className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="font-medium text-gray-800 mb-2">
                {q.id}. {q.question}
              </p>
              <p
                className={`text-sm ${
                  q.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {q.isCorrect ? "✅ Correct" : "❌ Incorrect"}
              </p>
              <p className="text-sm mt-1 text-gray-700">
                <span className="font-semibold">Your Answer:</span>{" "}
                {q.userAnswer}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Correct Answer:</span>{" "}
                {q.correctAnswer}
              </p>
              <p className="text-sm text-gray-600 mt-2">{q.explanation}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/home")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
