import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Card from "../Components/Card";
import axios from "axios";

export default function TeacherHome() {
  const [stats, setStats] = useState({
    activeQuizzes: 0,
    totalStudents: 0,
    pendingReviews: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState("");

  const teacherName = localStorage.getItem("userEmail") || "Teacher";
  const navigate = useNavigate();

  useEffect(() => {
    // Example API call
    axios
      .get("http://localhost:5000/api/teacher/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setErrorStats("Failed to load stats");
      })
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-700">
              Welcome Back, <strong>{teacherName}</strong>! Manage your quizzes,
              track student progress, and create new learning experiences with ease.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4">Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loadingStats ? (
              <p>Loading...</p>
            ) : errorStats ? (
              <p className="text-red-500">{errorStats}</p>
            ) : (
              <>
                <Card title="Active Quizzes" value={stats.activeQuizzes} icon="📋" />
                <Card title="Total Students" value={stats.totalStudents} icon="👥" />
                <Card title="Pending Reviews" value={stats.pendingReviews} icon="💬" />
              </>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-500 text-2xl">📝</span>
                <h4 className="font-bold">Create New Quiz</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Start building engaging quizzes for your students.
              </p>
              <button
                onClick={() => navigate("/create-quiz")}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Start Creating
              </button>
            </div>

            <div className="bg-white p-6 rounded shadow flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-500 text-2xl">📊</span>
                <h4 className="font-bold">Analyze Student Performance</h4>
              </div>
              <p className="text-gray-600 mb-4">
                Review results and analytics for all quizzes.
              </p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                View All Results
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
