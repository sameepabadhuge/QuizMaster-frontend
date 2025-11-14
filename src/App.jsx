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
import Nav from "./Components/Nav";
import TeacherHome from "./Pages/TeacherHome";

function App() {
  return <MainApp />;
}

function MainApp() {
  const location = useLocation();

  // Show Navbar only if NOT on Landing, Login, or Register pages
  const hideNavbarPaths = ["/", "/login", "/student-register", "/teacher-register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      {shouldShowNavbar && <Nav />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/teacher-register" element={<TeacherRegister />} />
        <Route path="/teacher-home" element={<TeacherHome />} />

        {/* Redirect /home to ensure default after login */}
        <Route path="/home" element={<Home />} />

        {/* Quiz routes */}
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/leader-board" element={<Leaderboard />} />

        {/* Redirect unknown routes to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
