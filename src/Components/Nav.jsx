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
    <nav className="flex items-center justify-between bg-gray-400 text-slate-900 px-8 py-4 shadow-lg sticky top-0 z-50">
      <h2 
        className="text-2xl font-bold tracking-wide cursor-pointer text-blue-700 hover:text-blue-800 transition-colors duration-200"
        onClick={() => navigate("/home")}
      >
        QuizMaster
      </h2>

      <div className="flex space-x-8">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + "/");
          return (
            <Link
              key={link.path}
              to={link.path}
              aria-current={isActive ? "page" : undefined}
              className={`font-medium transition duration-300 relative ${
                isActive ? "text-blue-700" : "text-slate-700 hover:text-blue-600"
              }`}
            >
              {link.name}
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
            </Link>
          );
        })}
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200 focus:outline-none"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold text-lg border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
              {studentName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
            {/* Settings Option */}
            <button
              onClick={() => {
                setShowDropdown(false);
                navigate("/student-settings");
              }}
              className="w-full text-left px-6 py-4 text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-4 border-b border-gray-100 hover:text-blue-700"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Settings</span>
            </button>
            {/* Logout Option */}
            <button
              onClick={() => {
                setShowDropdown(false);
                handleLogout();
              }}
              className="w-full text-left px-6 py-4 text-red-500 hover:bg-red-50 transition-colors duration-200 flex items-center gap-4 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
