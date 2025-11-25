import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ------------------------------
  // 🔥 Login Function + Token Save
  // ------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate before sending
    if (!email || !password || !role) {
      const msg = "Please fill in all fields";
      console.error("❌ Validation error:", msg);
      setErrorMsg(msg);
      return;
    }
    
    setLoading(true);
    setErrorMsg("");

    try {
      // send role in lowercase to match typical backend enums (e.g. 'student' / 'teacher')
      const payload = { role: role.toLowerCase(), email, password };
      console.log("📤 Sending login payload:", JSON.stringify(payload));
      console.log("📊 Current state - email:", email, "password:", password.length + " chars", "role:", role);

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Server response:", { status: res.status, data });
      setLoading(false);

      if (!res.ok) {
        // show server message when login fails
        const errMsg = data.message || `Login failed (${res.status})`;
        console.error("❌ Login error:", errMsg);
        setErrorMsg(errMsg);
        alert(errMsg);
        return;
      }

      // ------------------------------
      // 🟦 Save Token + User Data
      // ------------------------------
      const token = data.token;
      if (!token) {
        const noTokenMsg = "Login did not return a token. Server response: " + JSON.stringify(data);
        console.error("❌ No token:", noTokenMsg);
        setErrorMsg(noTokenMsg);
        alert(noTokenMsg);
        return;
      }

      console.log("✅ Token received, saving to localStorage...");
      localStorage.setItem("token", token);
      // store normalized role
      localStorage.setItem("role", (role || "").toLowerCase());

      // Decode token payload safely (guard in case token format is unexpected)
      try {
        const payloadBase64 = token.split(".")[1] || "";
        const decodedData = payloadBase64 ? JSON.parse(atob(payloadBase64)) : {};
        localStorage.setItem("userId", decodedData.id || "");
        localStorage.setItem("userEmail", decodedData.email || "");
        console.log("✅ User data saved:", decodedData);
      } catch (err) {
        console.warn("⚠️ Failed to decode token payload:", err);
      }

      // ------------------------------
      // 🚀 Redirect based on role
      // ------------------------------
      console.log("🚀 Redirecting user...");
      if ((role || "").toLowerCase() === "student") {
        navigate("/home");
      } else {
        navigate("/teacher-home");
      }

    } catch (error) {
      console.error("❌ Network/Parse error:", error);
      setLoading(false);
      const msg = error.message || "Something went wrong!";
      setErrorMsg(msg);
      alert(msg);
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

        {/* Error Message Display */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

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
            required
            value={email}
            className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label className="font-medium text-gray-700 mt-4 block">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
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
          <hr className="grow border-gray-300" />
          <p className="text-gray-500 text-sm">OR CONTINUE WITH</p>
          <hr className="grow border-gray-300" />
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
