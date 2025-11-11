import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white px-8 py-4 shadow-md">
      {/* Logo */}
      <h2 className="text-2xl font-bold tracking-wide">QuizMaster</h2>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link
          to="/home"
          className="hover:text-yellow-300 transition duration-200 font-semibold"
        >
          Home
        </Link>
        <Link
          to="/quiz-list"
          className="hover:text-yellow-300 transition duration-200 font-semibold"
        >
          Quiz List
        </Link>
        <Link
          to="/quiz-result"
          className="hover:text-yellow-300 transition duration-200 font-semibold"
        >
          Quiz Result
        </Link>
        <Link
          to="/leader-board"
          className="hover:text-yellow-300 transition duration-200 font-semibold"
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}
