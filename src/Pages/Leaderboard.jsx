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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆Top performing students</h1>
          
        </div>

        {/* Leaderboard Table */}
        <div className="bg-blue-100 rounded-xl shadow-md overflow-hidden">
          {leaderboardData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-left text-gray-700">Email</th>
                  <th className="px-6 py-4 text-center text-gray-700">Quizzes Attempted</th>
                  <th className="px-6 py-4 text-center text-gray-700">Total Score</th>
                  <th className="px-6 py-4 text-right text-gray-700">Avg %</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((student) => (
                  <tr
                    key={student.studentId}
                    className={`border-b hover:bg-blue-200 transition ${
                      student.rank <= 3 ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        student.rank === 1
                          ? "bg-red-500 text-white"
                          : student.rank === 2
                          ? "bg-yellow-300 text-white"
                          : student.rank === 3
                          ? "bg-purple-400 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {student.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{student.email}</td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {student.quizzesAttempted}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {student.totalScore}/{student.totalQuestions}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
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
