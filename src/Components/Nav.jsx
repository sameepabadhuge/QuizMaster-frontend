import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const storedPhoto = sessionStorage.getItem("profilePhoto");
    setRole(storedRole);
    setProfilePhoto(storedPhoto || "");
    setIsLoading(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show loading state while checking role
  if (isLoading) {
    return null;
  }

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
    sessionStorage.clear();
    navigate("/login");
  };

  const studentName = sessionStorage.getItem("studentName") || "Student";

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 shadow-lg sticky top-0 z-50">
      <h2 
        className="text-2xl font-bold tracking-wide cursor-pointer hover:text-teal-100 transition-colors duration-200"
        onClick={() => navigate("/home")}
      >
        QuizMaster
      </h2>

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

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 focus:outline-none"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
              {studentName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
            <button
              onClick={() => {
                setShowDropdown(false);
                navigate("/student-settings");
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-3"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
