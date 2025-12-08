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

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, detail, icon: Icon, borderClass }) => (
  <div className={`flex flex-col p-4 bg-white border-r ${borderClass} shadow-sm`}>
    <div className="text-sm font-semibold text-gray-500 uppercase flex items-center mb-1">
      <Icon className="w-4 h-4 mr-1" />
      <span>{title}</span>
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
  </div>
);

const SubmissionRow = ({ submission }) => {
  const isCompleted = submission.status === "Completed";
  const statusStyle = isCompleted
    ? "text-green-600 bg-green-100"
    : "text-yellow-600 bg-yellow-100";
  const scoreColor = submission.percentage >= 80 ? "text-green-600" : "text-gray-700";

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 whitespace-nowrap text-sm text-gray-800">{submission.studentName}</td>
      <td className="p-3 whitespace-nowrap text-sm text-gray-600">{submission.quizTitle}</td>
      <td className={`p-3 whitespace-nowrap text-sm font-semibold ${scoreColor}`}>
        {submission.score} <span className="font-normal text-gray-500">({submission.percentage}%)</span>
      </td>
      <td className="p-3 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}>
          {submission.status}
        </span>
      </td>
      <td className="p-3 whitespace-nowrap text-sm text-gray-500">{submission.submissionDate}</td>
      <td className="p-3 whitespace-nowrap">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 px-3 py-1 rounded-md transition duration-150">
          View Details
        </button>
      </td>
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
      
      console.log("Teacher ID from localStorage:", teacherId);

      if (!teacherId) {
        setError("Teacher ID not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Fetching from URL:", `http://localhost:5000/api/teachers/submissions/${teacherId}`);
      
      const response = await axios.get(
        `http://localhost:5000/api/teachers/submissions/${teacherId}`
      );

      console.log("Submissions data:", response.data);

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
      console.error("Error fetching submissions:", err);
      console.error("Error response:", err.response);
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
    <main className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz Results Overview</h2>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4 -mt-14">
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition duration-150 font-medium px-4 py-2 rounded-md disabled:opacity-50"
        >
          <VscRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Loading..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mb-8">
        <StatCard
          title="Total Submissions"
          value={quizStats.totalSubmissions}
          detail="submissions"
          icon={MdOutlineSchool}
          borderClass="border-gray-200"
        />
        <StatCard
          title="Average"
          value={quizStats.averageScore}
          detail="overall average success score - all quizzes"
          icon={MdOutlineAvTimer}
          borderClass="border-gray-200"
        />
        <StatCard
          title="Completed"
          value={quizStats.completedSubmissions}
          detail="submissions completed"
          icon={MdOutlineCheckCircleOutline}
          borderClass="border-gray-200"
        />
        <StatCard
          title="Students Reviewed"
          value={quizStats.studentsReviewed}
          detail="unique students with submissions"
          icon={MdOutlinePeople}
        />
      </div>

      {/* Submissions Table */}
      <section className="bg-blue-100 p-6 rounded-lg shadow-lg mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Quiz Submissions</h3>
        {submissions.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
    </main>
  );
};

export default QuizSubmissions;
