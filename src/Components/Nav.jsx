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
    <nav className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 shadow-lg sticky top-0 z-50">
      <h2 className="text-2xl font-bold tracking-wide">QuizMaster</h2>

      <div className="flex space-x-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + "/");
          return (
            <Link
              key={link.path}
              to={link.path}
              aria-current={isActive ? "page" : undefined}
              className={`font-semibold transition duration-200 ${
                isActive ? "text-white border-b-2 border-white" : "hover:text-white/80"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
      >
        Logout
      </button>
    </nav>
  );
}
