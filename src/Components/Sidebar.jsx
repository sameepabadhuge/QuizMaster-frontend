import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ userType, activeTab, onSelectTab }) {
  const navigate = useNavigate();

  if (userType !== "teacher") return null;

  const menuItems = [
    { id: "create-quiz", label: "Create Quiz", icon: "➕" },
    { id: "results", label: "View Results", icon: "📈" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "view-submissions", label: "View Submissions", icon: "📝" }, // ✅ New Tab
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-blue-100 p-6 border-r flex flex-col">
      <h2 className="text-xl font-bold mb-8">Teacher Dashboard</h2>
      <nav className="flex flex-col gap-4 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-2 p-2 rounded font-semibold transition-colors
              ${activeTab === item.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-3 rounded font-semibold hover:bg-red-600 transition-colors mt-4 text-sm"
      >
        Logout
      </button>
    </div>
  );
}

