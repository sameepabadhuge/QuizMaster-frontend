import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Card from "../Components/Card";
import CreateQuiz from "./CreateQuiz";
import QuizResult from "./QuizResult";
import Leaderboard from "./Leaderboard";
import ViewSubmission from "./ViewSubmission";
import axios from "axios";

export default function TeacherHome() {
  const [stats, setStats] = useState({
    activeQuizzes: 0,
    totalStudents: 0,
    pendingReviews: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState("");

  const [activeTab, setActiveTab] = useState("create-quiz"); // default tab
  const teacherName = localStorage.getItem("userEmail") || "Teacher";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teacher/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setErrorStats("Failed to load stats");
      })
      .finally(() => setLoadingStats(false));
  }, []);

  // Render content based on active sidebar tab
  const renderContent = () => {
    switch (activeTab) {
      case "create-quiz":
        return <CreateQuiz />;
      case "results":
        return <QuizResult />;
      case "leaderboard":
        return <Leaderboard />;
      case "view-submissions":
        return <ViewSubmission />;
      default:
        return <CreateQuiz />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar userType="teacher" activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Show Welcome + Overview only for Create Quiz tab */}
        {activeTab === "create-quiz" && (
          <>
            <section className="mb-10">
              <div className="bg-white p-6 rounded shadow">
                <p className="text-gray-700">
                  Welcome Back, <strong>{teacherName}</strong>! Manage your quizzes,
                  track student progress, and create new learning experiences with ease.
                </p>
              </div>
            </section>

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
          </>
        )}

        {/* Dynamic content */}
        <section>{renderContent()}</section>
      </div>
    </div>
  );
}
