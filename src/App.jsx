import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import QuizList from "./Pages/QuizList";
import QuizResult from "./Pages/QuizResult";
import Leaderboard from "./Pages/Leaderboard";
import Login from "./Pages/Login";
import StudentRegister from "./Pages/StudentRegister";
import TeacherRegister from "./Pages/TeacherRegister";
import TeacherHome from "./Pages/TeacherHome";
import CreateQuiz from "./Pages/CreateQuiz";
import TakeQuiz from "./Pages/TakeQuiz";   // ✅ ADDED
import ViewSubmission from "./Pages/ViewSubmission"; // Matches filename exactly

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
        
        <Route path="/leader-board" element={<Leaderboard />} />
        <Route path="/view-submission/:quizId" element={<ViewSubmission />} /> {/* ✅ ADDED */}
        {/* Student Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-result/:resultId" element={<QuizResult />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        

        {/* ⭐⭐ Take Quiz PAGE */}
        <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />   {/* <= FIXED */}

        {/* Unknown Routes → Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
