import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    subject: "",
    phone: "",
    bio: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const teacherId = sessionStorage.getItem("teacherId");
      
      // If no teacherId, try to get it from teacher object
      if (!teacherId) {
        const teacherData = sessionStorage.getItem("teacher");
        if (teacherData) {
          const teacher = JSON.parse(teacherData);
          setProfile(teacher);
          setLoading(false);
          return;
        }
        setMessage({ type: "error", text: "Please login again" });
        setLoading(false);
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/teachers/profile/${teacherId}`);
      if (res.data.success) {
        setProfile(res.data.teacher);
        // Also update sessionStorage
        sessionStorage.setItem("teacher", JSON.stringify(res.data.teacher));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Fallback to sessionStorage data
      const teacherData = sessionStorage.getItem("teacher");
      if (teacherData) {
        setProfile(JSON.parse(teacherData));
      } else {
        setMessage({ type: "error", text: "Failed to load profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const teacherId = sessionStorage.getItem("teacherId") || profile._id;
      
      if (!teacherId) {
        setMessage({ type: "error", text: "Please login again" });
        setSaving(false);
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/teachers/profile/${teacherId}`,
        profile
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        // Update sessionStorage with new data
        sessionStorage.setItem("teacher", JSON.stringify(res.data.teacher));
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to update profile" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      setSaving(true);
      const teacherId = sessionStorage.getItem("teacherId") || profile._id;
      
      if (!teacherId) {
        setMessage({ type: "error", text: "Please login again" });
        setSaving(false);
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/teachers/change-password/${teacherId}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to change password" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">👤 My Profile</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-teal-500">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {profile.firstName?.charAt(0)?.toUpperCase() || "T"}
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-500">@{profile.username}</p>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile.username || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={profile.subject || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={isEditing ? "Enter phone number" : "Not provided"}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              placeholder={isEditing ? "Tell us about yourself..." : "No bio provided"}
              className={`w-full p-3 border rounded-lg ${
                isEditing
                  ? "border-teal-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all resize-none`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset to original data
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                🔒 Change Password
              </button>
            </>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
