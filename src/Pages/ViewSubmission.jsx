import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdOutlinePeople,
  MdOutlineAvTimer,
  MdOutlineSchool,
  MdOutlineCheckCircleOutline,
  MdArrowBack,
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

const SubmissionRow = ({ submission, onClick }) => {
  const isFailed = submission.percentage < 50;
  const isCompleted = submission.status === "Completed";
  
  // Status style - show Failed in red if percentage < 50
  const statusStyle = isFailed
    ? "text-red-700 bg-red-100"
    : isCompleted
      ? "text-green-700 bg-green-100"
      : "text-teal-700 bg-teal-100";
  
  // Score color based on percentage
  const scoreColor = isFailed 
    ? "text-red-600" 
    : submission.percentage >= 80 
      ? "text-green-600" 
      : "text-gray-700";

  // Row background for failed submissions
  const rowBgClass = isFailed 
    ? "bg-red-50 hover:bg-red-100" 
    : "hover:bg-teal-50";

  return (
    <tr 
      className={`border-b transition-colors duration-150 cursor-pointer ${rowBgClass}`}
      onClick={onClick}
    >
      <td className={`p-3 whitespace-nowrap text-sm ${isFailed ? "text-red-800 font-medium" : "text-gray-800"}`}>
        {submission.studentName}
      </td>
      <td className={`p-3 whitespace-nowrap text-sm ${isFailed ? "text-red-700" : "text-gray-600"}`}>
        {submission.quizTitle}
      </td>
      <td className={`p-3 whitespace-nowrap text-sm font-semibold ${scoreColor}`}>
        {submission.score} <span className={`font-normal ${isFailed ? "text-red-500" : "text-gray-500"}`}>({submission.percentage}%)</span>
      </td>
      <td className="p-3 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle} transition-colors duration-150`}>
          {isFailed ? "Failed" : submission.status}
        </span>
      </td>
      <td className={`p-3 whitespace-nowrap text-sm ${isFailed ? "text-red-500" : "text-gray-500"}`}>
        {submission.submissionDate}
      </td>
    </tr>
  );
};

// --- Result Detail Component ---
const ResultDetail = ({ result, onBack }) => {
  const quizTitle = result.quizTitle || "Quiz Results";
  const score = result.score || 0;
  const totalQuestions = result.totalQuestions || 0;
  const percentage = result.percentage || 0;
  const results = Array.isArray(result.results) ? result.results : [];
  const studentName = result.studentId 
    ? `${result.studentId.firstName} ${result.studentId.lastName}` 
    : "Student";

  return (
    <div className="bg-gray-50">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 flex items-center gap-2"
      >
        <MdArrowBack className="w-5 h-5" />
        Back to Submissions
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-xl p-8 mb-8 border border-teal-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          📊 Quiz Results
        </h1>
        <h2 className="text-xl text-gray-600 mb-2">{quizTitle}</h2>
        <p className="text-gray-500">Student: <span className="font-semibold text-gray-700">{studentName}</span></p>

        {/* Score Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 border-l-4 border-teal-600 shadow-md">
            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Score</p>
            <p className="text-4xl font-bold text-teal-600 mt-2">
              {score}/{totalQuestions}
            </p>
          </div>

          <div
            className={`bg-white rounded-xl p-6 border-l-4 shadow-md ${
              percentage >= 50 ? "border-green-600" : "border-red-600"
            }`}
          >
            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Percentage</p>
            <p
              className={`text-4xl font-bold mt-2 ${
                percentage >= 50 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-teal-600 shadow-md">
            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">Status</p>
            <p
              className={`text-lg font-bold mt-2 ${
                percentage >= 50 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentage >= 50 ? "✅ Passed" : "❌ Failed"}
            </p>
          </div>
        </div>
      </div>

      {/* Questions Breakdown */}
      {results.length > 0 ? (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ❓ Question Breakdown
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-all duration-200 ${
                  item.isCorrect
                    ? "bg-gradient-to-br from-green-50 to-green-100 border-green-500"
                    : "bg-gradient-to-br from-red-50 to-red-100 border-red-500"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="font-semibold text-gray-800 text-lg">
                    Q{idx + 1}: {item.question}
                  </p>
                  <span className="text-3xl">
                    {item.isCorrect ? "✅" : "❌"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Student's Answer:</span>{" "}
                    <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                      {item.userAnswer || "Not answered"}
                    </span>
                  </p>
                  {!item.isCorrect && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      <span className="text-green-600 font-semibold">
                        {item.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            No question details available.
          </p>
        </div>
      )}
    </div>
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
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const teacherId = sessionStorage.getItem("teacherId");
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

  const fetchResultDetail = async (studentId, quizId) => {
    try {
      setDetailLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/teachers/submission-detail/${studentId}/${quizId}`
      );
      if (response.data.success) {
        setSelectedResult(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching result detail:", err);
      setError("Failed to load result details. The detailed breakdown may not be available.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmissionClick = (submission) => {
    if (submission.studentId && submission.quizId) {
      fetchResultDetail(submission.studentId, submission.quizId);
    }
  };

  const handleBackToList = () => {
    setSelectedResult(null);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Show loading state for detail view
  if (detailLoading) {
    return (
      <main className="p-0 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading result details...</p>
      </main>
    );
  }

  // Show result detail view
  if (selectedResult) {
    return (
      <main className="p-0 bg-gray-50 min-h-screen">
        <ResultDetail result={selectedResult} onBack={handleBackToList} />
      </main>
    );
  }

  return (
    <main className="p-0 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz Results Overview</h2>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
          borderClass="border-l-4 border-teal-400"
        />
        <StatCard
          title="Average Score"
          value={quizStats.averageScore}
          detail="overall average score"
          icon={MdOutlineAvTimer}
          borderClass="border-l-4 border-teal-400"
        />
        <StatCard
          title="Completed"
          value={quizStats.completedSubmissions}
          detail="submissions completed"
          icon={MdOutlineCheckCircleOutline}
          borderClass="border-l-4 border-teal-400"
        />
        <StatCard
          title="Students Reviewed"
          value={quizStats.studentsReviewed}
          detail="unique students with submissions"
          icon={MdOutlinePeople}
          borderClass="border-l-4 border-teal-400"
        />
      </div>

      {/* Submissions Table */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-10 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Individual Quiz Submissions</h3>
          <p className="text-sm text-gray-500 italic">Click on a row to view details</p>
        </div>
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
                  <SubmissionRow 
                    key={submission._id} 
                    submission={submission} 
                    onClick={() => handleSubmissionClick(submission)}
                  />
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
