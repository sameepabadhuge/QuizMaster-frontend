import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../assets/1.avif";   // <-- IMPORTANT: import background

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = { role: role.toLowerCase(), email, password };

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }

      if (role.toLowerCase() === "student") {
        localStorage.setItem("role", "student");
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentId", data.user._id);
        localStorage.setItem("student", JSON.stringify({ email: data.user.email }));
        navigate("/home");
      } else {
        localStorage.setItem("role", "teacher");
        localStorage.setItem("teacherToken", data.token);
        localStorage.setItem("teacherId", data.user._id);
        navigate("/teacher-home");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-white/30 relative z-10"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-white mb-2 drop-shadow-lg"
        >
          Welcome Back!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/90 mb-6"
        >
          Login to continue your learning journey
        </motion.p>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="font-medium text-white">Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white backdrop-blur-sm"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="font-medium text-white mt-4 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="font-medium text-white mt-4 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold mt-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-white/90">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-300 hover:text-blue-100 font-semibold transition-colors"
            >
              Register
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
