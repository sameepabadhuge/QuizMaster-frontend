import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ userType, activeTab, onSelectTab }) {
  const navigate = useNavigate();

  if (userType !== "teacher") return null;

  const menuItems = [
    { id: "create-quiz", label: "Create Quiz", icon: "➕" },
    { id: "results", label: "View Results", icon: "📈" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "view-submissions", label: "View Submissions", icon: "📝" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-teal-50 to-teal-200 p-6 border-r border-gray-300 flex flex-col shadow-lg">
      <h2 className="text-2xl font-bold mb-10 text-teal-900">Teacher Dashboard</h2>

      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${activeTab === item.id 
                ? "bg-teal-600 text-white shadow-md transform scale-105" 
                : "hover:bg-teal-100 hover:translate-x-1 hover:shadow-sm text-teal-800"}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-md">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:shadow-md transition-all mt-6 text-sm flex items-center justify-center gap-2"
      >
        🔒 Logout
      </button>
    </div>
  );
}
