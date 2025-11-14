import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------
  // 🔥 Login Function + Token Save
  // ------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ------------------------------
      // 🟦 Save Token + User Data
      // ------------------------------
      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Decode token payload
      const payloadBase64 = token.split(".")[1];
      const decodedData = JSON.parse(atob(payloadBase64));

      // Save decoded user details
      localStorage.setItem("userId", decodedData.id || "");
      localStorage.setItem("userEmail", decodedData.email || "");

      // ------------------------------
      // 🚀 Redirect based on role
      // ------------------------------
      if (role === "Student") {
        navigate("/home");
      } else {
        navigate("/teacher-dashboard");
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Log in to your Quiz Master account.
        </p>

        <form onSubmit={handleLogin} className="mt-8">

          {/* Select Role */}
          <label className="font-medium text-gray-700">Login As</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>

          {/* Email */}
          <label className="font-medium text-gray-700 mt-4 block">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label className="font-medium text-gray-700 mt-4 block">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-6 hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-gray-300" />
          <p className="text-gray-500 text-sm">OR CONTINUE WITH</p>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Register Buttons */}
        <button
          onClick={() => navigate("/student-register")}
          className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg mb-3 hover:bg-gray-100 transition"
        >
          Register as Student
        </button>

        <button
          onClick={() => navigate("/teacher-register")}
          className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Register as Teacher
        </button>
      </div>
    </div>
  );
};

export default Login;
