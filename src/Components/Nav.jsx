import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation(); // to get current path

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Quiz List", path: "/quiz-list" },
    { name: "Quiz Result", path: "/quiz-result" },
    { name: "Leaderboard", path: "/leader-board" },
  ];

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white px-8 py-4 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <h2 className="text-2xl font-bold tracking-wide">QuizMaster</h2>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-semibold transition duration-200 ${
              location.pathname === link.path
                ? "text-yellow-300 border-b-2 border-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
