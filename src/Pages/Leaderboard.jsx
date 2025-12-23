import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");

  const role = sessionStorage.getItem("role");
  const teacherId = sessionStorage.getItem("teacherId");
  const isTeacher = role === "teacher";

  const fetchLeaderboard = async (subject = "all") => {
    try {
      setLoading(true);
      let res;
      
      if (isTeacher && teacherId) {
        // Teacher: fetch leaderboard for their quizzes with optional subject filter
        const url = subject === "all"
          ? `http://localhost:5000/api/teachers/leaderboard/${teacherId}`
          : `http://localhost:5000/api/teachers/leaderboard/${teacherId}?subject=${encodeURIComponent(subject)}`;
        res = await axios.get(url);
        
        if (res.data.success) {
          setLeaderboardData(res.data.leaderboard);
          setSubjects(res.data.subjects || []);
        }
      } else {
        // Student: fetch general leaderboard with optional subject filter
        const url = subject === "all"
          ? "http://localhost:5000/api/students/leaderboard"
          : `http://localhost:5000/api/students/leaderboard?subject=${encodeURIComponent(subject)}`;
        res = await axios.get(url);
        if (res.data.success) {
          setLeaderboardData(res.data.leaderboard);
          setSubjects(res.data.subjects || []);
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedSubject);
  }, [selectedSubject]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

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
        <div className="mb-8 text-center max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Top Performing Students</h1>
          <p className="text-gray-600">
            {isTeacher 
              ? "Students performance on your quizzes" 
              : "Celebrating our highest achieving students"}
          </p>
        </div>

        {/* Subject Filter (For both Teachers and Students) */}
        {subjects.length > 0 && (
          <div className="mb-6 max-w-6xl w-full">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap items-center gap-4">
              <label className="text-gray-700 font-semibold">📚 Filter by Subject:</label>
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 min-w-[200px]"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {selectedSubject !== "all" && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  Showing results for: {selectedSubject}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300 max-w-6xl w-full">
          {leaderboardData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-white uppercase tracking-wider">Student</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-white uppercase tracking-wider">Quizzes Attempted</th>
                  <th className="px-8 py-5 text-center text-xs font-bold text-white uppercase tracking-wider">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((student) => (
                  <tr
                    key={student.studentId}
                    className="hover:bg-blue-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center">
                        {student.rank === 1 ? (
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-xl animate-pulse" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center font-bold text-xl text-white border-2 border-yellow-300">
                              🥇
                            </div>
                          </div>
                        ) : student.rank === 2 ? (
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-lg"></div>
                            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg flex items-center justify-center font-bold text-lg text-white border-2 border-cyan-300">
                              🥈
                            </div>
                          </div>
                        ) : student.rank === 3 ? (
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-pink-500 shadow-lg"></div>
                            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg flex items-center justify-center font-bold text-lg text-white border-2 border-purple-300">
                              🥉
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 font-bold text-white text-sm shadow-md">
                            {student.rank}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {student.profilePhoto ? (
                          <img
                            src={student.profilePhoto}
                            alt={`${student.firstName}'s profile`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {student.firstName?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-gray-700 font-medium">
                      {student.quizzesAttempted}
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-blue-600">
                      {student.totalScore}/{student.totalQuestions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg">
                {selectedSubject === "all"
                  ? isTeacher 
                    ? "No quiz submissions yet for your quizzes"
                    : "No quiz submissions yet"
                  : `No submissions yet for ${selectedSubject} quizzes`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
