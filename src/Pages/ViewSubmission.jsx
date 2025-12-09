import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdOutlinePeople,
  MdOutlineAvTimer,
  MdOutlineSchool,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";
import { VscRefresh } from "react-icons/vsc";

// --- Sub-Components ---
const StatCard = ({ title, value, detail, icon: Icon, borderClass }) => (
  <div className={`flex flex-col p-4 bg-white rounded-lg shadow-md ${borderClass} hover:shadow-lg transition-all duration-200`}>
    <div className="flex items-center text-sm font-semibold text-gray-500 uppercase mb-1">
      <Icon className="w-5 h-5 mr-2 text-gray-400" />
      {title}
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{detail}</div>
  </div>
);

const SubmissionRow = ({ submission }) => {
  const isCompleted = submission.status === "Completed";
  const statusStyle = isCompleted
    ? "text-green-700 bg-green-100"
    : "text-yellow-700 bg-yellow-100";
  const scoreColor = submission.percentage >= 80 ? "text-green-600" : "text-gray-700";

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-150">
      <td className="p-3 whitespace-nowrap text-sm text-gray-800">{submission.studentName}</td>
      <td className="p-3 whitespace-nowrap text-sm text-gray-600">{submission.quizTitle}</td>
      <td className={`p-3 whitespace-nowrap text-sm font-semibold ${scoreColor}`}>
        {submission.score} <span className="font-normal text-gray-500">({submission.percentage}%)</span>
      </td>
      <td className="p-3 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle} transition-colors duration-150`}>
          {submission.status}
        </span>
      </td>
      <td className="p-3 whitespace-nowrap text-sm text-gray-500">{submission.submissionDate}</td>
    </tr>
  );
};

// --- Main Component ---
const QuizSubmissions = () => {
  const [quizStats, setQuizStats] = useState({
    totalSubmissions: 0,
    averageScore: "0%",
    completedSubmissions: 0,
    studentsReviewed: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) {
        setError("Teacher ID not found. Please login again.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/teachers/submissions/${teacherId}`);
      if (response.data.success) {
        setQuizStats({
          totalSubmissions: response.data.stats.totalSubmissions,
          averageScore: `${response.data.stats.averageScore}%`,
          completedSubmissions: response.data.stats.completedSubmissions,
          studentsReviewed: response.data.stats.studentsReviewed,
        });
        setSubmissions(response.data.submissions);
        setError("");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to load submission data";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <main className="p-0 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz Results Overview</h2>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <VscRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Loading..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          {error}
        </div>
      )}

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Submissions"
          value={quizStats.totalSubmissions}
          detail="submissions"
          icon={MdOutlineSchool}
          borderClass="border-l-4 border-blue-400"
        />
        <StatCard
          title="Average Score"
          value={quizStats.averageScore}
          detail="overall average score"
          icon={MdOutlineAvTimer}
          borderClass="border-l-4 border-blue-400"
        />
        <StatCard
          title="Completed"
          value={quizStats.completedSubmissions}
          detail="submissions completed"
          icon={MdOutlineCheckCircleOutline}
          borderClass="border-l-4 border-blue-400"
        />
        <StatCard
          title="Students Reviewed"
          value={quizStats.studentsReviewed}
          detail="unique students with submissions"
          icon={MdOutlinePeople}
          borderClass="border-l-4 border-blue-400"
        />
      </div>

      {/* Submissions Table */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Quiz Submissions</h3>
        {submissions.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz Title</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {submissions.map((submission) => (
                  <SubmissionRow key={submission._id} submission={submission} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </div>
    </main>
  );
};

export default QuizSubmissions;
