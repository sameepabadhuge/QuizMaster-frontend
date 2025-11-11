import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import QuizList from "./Pages/QuizList";
import QuizResult from "./Pages/QuizResult";
import Leaderboard from "./Pages/Leaderboard";
import Login from "./Pages/Login";
import StudentRegister from "./Pages/StudentRegister";
import Nav from "./Components/Nav";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();

  // Show Navbar only if NOT on Landing or Login/Register
  const hideNavbarPaths = ["/", "/login", "/student-register"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Nav />}  {/* Navbar shows only after login */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quizlist" element={<QuizList />} />
        <Route path="/quizresult" element={<QuizResult />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
      </Routes>
    </div>
  );
}

export default App;
