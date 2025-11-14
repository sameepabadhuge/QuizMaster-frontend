import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import QuizList from "./pages/QuizList";
import QuizResult from "./pages/QuizResult";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import TeacherRegister from "./pages/TeacherRegister";
import TeacherHome from "./pages/TeacherHome";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";   // ✅ ADDED
import ViewSubmission from "./pages/ViewSubmission"; // Matches filename exactly

import Nav from "./Components/Nav";

function App() {
  return <MainApp />;
}

function MainApp() {
  const location = useLocation();

  const hideNavbarPaths = ["/", "/login", "/student-register", "/teacher-register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavbar && <Nav />}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />

        {/* Teacher Pages */}
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz-results" element={<QuizResult />} />
        <Route path="/leader-board" element={<Leaderboard />} />
        <Route path="/view-submission/:quizId" element={<ViewSubmission />} /> {/* ✅ ADDED */}
        {/* Student Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/leader-board" element={<Leaderboard />} />

        {/* ⭐⭐ Take Quiz PAGE */}
        <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />   {/* <= FIXED */}

        {/* Unknown Routes → Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
