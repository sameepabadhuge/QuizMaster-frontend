import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, ListOrdered } from "lucide-react";

export default function Leaderboard() {
  const navigate = useNavigate();

  const leaderboardData = [
    { rank: 1, name: "Alex Johnson", score: 1250, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { rank: 2, name: "Maria Garcia", score: 1200, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { rank: 3, name: "David Lee", score: 1180, avatar: "https://randomuser.me/api/portraits/men/40.jpg" },
    { rank: 4, name: "Sophia Chen", score: 1150, avatar: "https://randomuser.me/api/portraits/women/41.jpg" },
    { rank: 5, name: "Ethan White", score: 1120, avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
    { rank: 6, name: "Olivia Brown", score: 1090, avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
    { rank: 7, name: "Liam Wilson", score: 1050, avatar: "https://randomuser.me/api/portraits/men/48.jpg" },
    { rank: 8, name: "Isabella Taylor", score: 1020, avatar: "https://randomuser.me/api/portraits/women/29.jpg" },
    { rank: 9, name: "Noah Miller", score: 980, avatar: "https://randomuser.me/api/portraits/men/15.jpg" },
    { rank: 10, name: "Ava Davis", score: 950, avatar: "https://randomuser.me/api/portraits/women/13.jpg" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-sm flex flex-col">
        <div className="flex items-center justify-center py-6 border-b">
          
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg px-3 py-2 transition"
          >
            <Home size={18} />
            Home
          </button>
          <button
            onClick={() => navigate("/quiz-list")}
            className="flex items-center gap-3 w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg px-3 py-2 transition"
          >
            <ListOrdered size={18} />
            Quizzes
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="flex items-center gap-3 w-full bg-blue-50 text-blue-600 rounded-lg px-3 py-2 transition"
          >
            🏆 Leaderboard
          </button>
        </nav>
        <div className="border-t p-4 text-center text-xs text-gray-500">
          © 2025 Quiz Master. All rights reserved.
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        
        
        

        {/* Leaderboard Table */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Top Scorers</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="pb-2">RANK</th>
                  <th className="pb-2">STUDENT</th>
                  <th className="pb-2 text-right">SCORE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((student) => (
                  <tr
                    key={student.rank}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2">{student.rank}</td>
                    <td className="flex items-center gap-3 py-2">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{student.name}</span>
                    </td>
                    <td className="text-right text-blue-600 font-semibold">
                      {student.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
