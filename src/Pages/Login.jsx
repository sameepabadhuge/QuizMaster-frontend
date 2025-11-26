import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !role) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = { role: role.toLowerCase(), email, password };
      console.log("📤 Sending login payload:", payload);

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 LOGIN RESPONSE:", data);

      setLoading(false);

      // Handle failure
      if (!res.ok) {
        const msg = data.message || "Login failed";
        setErrorMsg(msg);
        alert(msg);
        return;
      }

      // -----------------------------
      // 🟦 Save Token
      // -----------------------------
      if (!data.token) {
        alert("No token received from server!");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role.toLowerCase());

      // -----------------------------
      // 🟦 Save User Data (Correct)
      // -----------------------------
      if (data.user && data.user._id) {
        localStorage.setItem("studentId", data.user._id);
        localStorage.setItem("userEmail", data.user.email);
        console.log("✅ User data saved:", data.user);
      } else {
        console.warn("⚠️ User data missing:", data);
        alert("Login successful but user data missing.");
      }

      // -----------------------------
      // 🟦 Decode Token (Optional)
      // -----------------------------
      try {
        const payloadBase64 = data.token.split(".")[1] || "";
        const decoded = payloadBase64 ? JSON.parse(atob(payloadBase64)) : {};
        localStorage.setItem("userId", decoded.id || "");
        console.log("🔍 Decoded token:", decoded);
      } catch (err) {
        console.warn("⚠️ Token decode failed:", err);
      }

      // -----------------------------
      // 🚀 Redirect by Role
      // -----------------------------
      if (role.toLowerCase() === "student") {
        navigate("/home");
      } else {
        navigate("/teacher-home");
      }

    } catch (error) {
      console.error("❌ Network error:", error);
      setLoading(false);
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center text-gray-900">Welcome Back!</h1>
        <p className="text-center text-gray-500 mt-1">
          Log in to your Quiz Master account.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
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
            placeholder="Enter your email"
            required
            value={email}
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="font-medium text-gray-700 mt-4 block">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-6 hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <hr className="grow border-gray-300" />
          <p className="text-gray-500 text-sm">OR CONTINUE WITH</p>
          <hr className="grow border-gray-300" />
        </div>

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
