import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // Show navbar only for students
  if (!role || role !== "student") {
    return null;
  }

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Quiz List", path: "/quiz-list" },
    { name: "Quiz Result", path: "/quiz-result" },
    { name: "Leaderboard", path: "/leader-board" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-cyan-600 text-white px-8 py-4 shadow-md sticky top-0 z-50">
      <h2 className="text-2xl font-bold tracking-wide">QuizMaster</h2>

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

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 font-semibold transition"
      >
        Logout
      </button>
    </nav>
  );
}
