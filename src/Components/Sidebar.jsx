import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-50 p-6 border-r">
      <h2 className="text-xl font-bold mb-8">Teacher Home</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/teacher" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
          <span>📊</span> Dashboard
        </Link>
        <Link to="/teacher/create-quiz" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
          <span>➕</span> Create Quiz
        </Link>
        <Link to="/teacher/results" className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
          <span>📈</span> View Results
        </Link>
      </nav>
    </div>
  );
}
