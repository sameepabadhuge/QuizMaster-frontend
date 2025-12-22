import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ userType, activeTab, onSelectTab }) {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const teacherData = sessionStorage.getItem("teacher");
    if (teacherData) {
      const teacher = JSON.parse(teacherData);
      setTeacherName(teacher.username || `${teacher.firstName} ${teacher.lastName}`);
      setProfilePicture(teacher.profilePicture || "");
    }
  }, [activeTab]);

  if (userType !== "teacher") return null;

  const menuItems = [
    { id: "create-quiz", label: "Create Quiz", icon: "➕" },
    { id: "view-submissions", label: "Student Results", icon: "📊" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 border-r border-blue-100 flex flex-col shadow-lg">
      <div 
        className="flex flex-col items-center mb-6 cursor-pointer group"
        onClick={() => onSelectTab("profile")}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-600 shadow-md mb-3 group-hover:border-blue-500 group-hover:scale-105 transition-all duration-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-700 shadow-md mb-3 group-hover:bg-blue-500 group-hover:scale-105 transition-all duration-200">
            {teacherName ? teacherName.charAt(0).toUpperCase() : "T"}
          </div>
        )}
        <h2 className="text-xl font-bold text-blue-900 text-center group-hover:text-blue-700 transition-colors">
        {teacherName || "Teacher"}
        </h2>
      </div>

      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${activeTab === item.id 
                ? "bg-blue-600 text-white shadow-md transform scale-105" 
                : "hover:bg-blue-100 hover:translate-x-1 hover:shadow-sm text-blue-800"}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-md">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-300 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:shadow-md transition-all mt-6 text-sm flex items-center justify-center gap-2"
      >
         Logout
      </button>
    </div>
  );
}
