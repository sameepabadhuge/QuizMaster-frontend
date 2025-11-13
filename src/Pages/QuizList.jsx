// QuizList.jsx
import React, { useState } from "react";

const quizzesData = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Test your foundational knowledge of JavaScript syntax, variables, and basic functions.",
    lecture: "JavaScript",
    subject: "Programming",
    difficulty: "Easy",
    estTime: "15 min",
  },
  {
    id: 2,
    title: "Advanced React Hooks",
    description: "Challenge your understanding of useEffect, useContext, and custom hooks in React.",
    lecture: "React",
    subject: "Frontend",
    difficulty: "Medium",
    estTime: "30 min",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Comprehensive quiz covering fundamental data structures and common algorithmic paradigms.",
    lecture: "DSA",
    subject: "Computer Science",
    difficulty: "Hard",
    estTime: "60 min",
  },
  {
    id: 4,
    title: "CSS Flexbox Fundamentals",
    description: "Evaluate your knowledge of Flexbox properties for responsive web layouts.",
    lecture: "CSS",
    subject: "Frontend",
    difficulty: "Easy",
    estTime: "20 min",
  },
  {
    id: 5,
    title: "Backend with Node.js",
    description: "Questions on Node.js runtime, Express.js, and database integration concepts.",
    lecture: "Node.js",
    subject: "Backend",
    difficulty: "Medium",
    estTime: "45 min",
  },
  {
    id: 6,
    title: "Cloud Computing Basics",
    description: "Understand the core concepts of cloud computing, services, and deployment models.",
    lecture: "Cloud",
    subject: "IT",
    difficulty: "Easy",
    estTime: "25 min",
  },
];

export default function QuizList() {
  const [search, setSearch] = useState("");

  const filteredQuizzes = quizzesData.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.lecture.toLowerCase().includes(search.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600 text-2xl font-bold">Quiz Master</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Student</span>
          <button className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Available Quizzes</h1>
        <p className="text-gray-600 mb-6">
          Select a quiz to test your knowledge and track your progress.
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search quizzes by title, lecture, or subject..."
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    quiz.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : quiz.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <p className="text-gray-500 mb-4">Est. Time: {quiz.estTime}</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Start Quiz
              </button>
            </div>
          ))}
          {filteredQuizzes.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No quizzes found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
