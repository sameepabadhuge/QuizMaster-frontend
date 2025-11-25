import React from "react";
import {
  MdOutlinePeople,
  MdOutlineAvTimer,
  MdOutlineSchool,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";
import { VscRefresh } from "react-icons/vsc";

// --- Static Data to populate the table and stats ---
const quizStats = {
  totalQuizzes: 7,
  averageScore: "81.3%",
  quizzesInProgress: 1,
  studentsReviewed: 7,
};

const individualSubmissions = [
  {
    studentName: "Alice Smith",
    quizTitle: "Algebra Fundamentals",
    score: "85/100",
    percentage: 85,
    status: "Completed",
    submissionDate: "2023-10-26",
  },
  {
    studentName: "Bob Johnson",
    quizTitle: "Calculus Basics",
    score: "72/100",
    percentage: 72,
    status: "Completed",
    submissionDate: "2023-10-25",
  },
  {
    studentName: "Charlie Brown",
    quizTitle: "Geometry Principles",
    score: "91/100",
    percentage: 91,
    status: "Completed",
    submissionDate: "2023-10-27",
  },
  {
    studentName: "Diana Prince",
    quizTitle: "Algebra Fundamentals",
    score: "68/100",
    percentage: 68,
    status: "In Progress",
    submissionDate: "2023-10-27",
  },
];

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
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quiz Results Overview</h2>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4 -mt-14">
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition duration-150 font-medium px-4 py-2 rounded-md">
          <VscRefresh className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mb-8">
        <StatCard
          title="Total Quizzes"
          value={quizStats.totalQuizzes}
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
          title="Quizzes In Progress"
          value={quizStats.quizzesInProgress}
          detail="submissions pending completion"
          icon={MdOutlineCheckCircleOutline}
          borderClass="border-gray-200"
        />
        <StatCard
          title="Students Reviewed"
          value={quizStats.studentsReviewed}
          detail="unique students with reviewed submissions"
          icon={MdOutlinePeople}
        />
      </div>

      {/* Submissions Table */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Individual Quiz Submissions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
              {individualSubmissions.map((submission, index) => (
                <SubmissionRow key={index} submission={submission} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default QuizSubmissions;
