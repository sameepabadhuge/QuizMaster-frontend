import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students/leaderboard");
        if (res.data.success) {
          setLeaderboardData(res.data.leaderboard);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-10 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-10 text-center max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Top Performing Students</h1>
          <p className="text-gray-600">Celebrating our highest achieving students</p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300 max-w-6xl w-full">
          {leaderboardData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Student Name</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-white uppercase tracking-wider">Quizzes Attempted</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-white uppercase tracking-wider">Total Score</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-white uppercase tracking-wider">Avg %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((student) => (
                  <tr
                    key={student.studentId}
                    className="hover:bg-blue-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white text-sm ${
                        student.rank === 1
                          ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg"
                          : student.rank === 2
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg"
                          : student.rank === 3
                          ? "bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}>
                        {student.rank}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-semibold text-gray-800">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-8 py-5 text-gray-600 text-sm">{student.email}</td>
                    <td className="px-8 py-5 text-center text-gray-700 font-medium">
                      {student.quizzesAttempted}
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-blue-600">
                      {student.totalScore}/{student.totalQuestions}
                    </td>
                    <td className="px-8 py-5 text-right font-semibold">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        student.averagePercentage >= 75
                          ? "bg-green-100 text-green-700"
                          : student.averagePercentage >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {student.averagePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">No quiz submissions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
