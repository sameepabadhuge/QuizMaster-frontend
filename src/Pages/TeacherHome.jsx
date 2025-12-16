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

  const [activeTab, setActiveTab] = useState("create-quiz");
  const teacherName = localStorage.getItem("userEmail") || "Teacher";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teachers/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setErrorStats("Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

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
      <Sidebar userType="teacher" activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="flex-1 p-10 ml-64">
        {activeTab === "create-quiz" && (
          <>
            <section className="mb-10">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 rounded-xl shadow-lg text-white">
                <h2 className="text-3xl font-bold mb-2">Welcome! 👋</h2>
                <p className="text-lg text-teal-50">
                  Manage your quizzes and track student performance.
                </p>
              </div>
            </section>
            <section className="mb-10">
             
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
        <section>{renderContent()}</section>
      </div>
    </div>
  );
}
