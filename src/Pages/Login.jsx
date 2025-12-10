import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

      // ⭐ STUDENT LOGIN
      if (role.toLowerCase() === "student") {
        localStorage.setItem("role", "student");  // ⭐ IMPORTANT
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentId", data.user._id);
        localStorage.setItem("student", JSON.stringify({ email: data.user.email }));

        navigate("/home");
      } 
      
      // ⭐ TEACHER LOGIN
      else {
        localStorage.setItem("role", "teacher");  // ⭐ IMPORTANT
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-center text-gray-600 mb-6">Login to continue your learning journey</p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8">
          <label className="font-medium text-gray-700">Login As</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>

          <label className="font-medium text-gray-700 mt-4 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <label className="font-medium text-gray-700 mt-4 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold mt-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
