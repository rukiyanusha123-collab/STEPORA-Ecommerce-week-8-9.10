import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:3000/users?email=${email}&password=${password}`
      );

      if (response.data.length === 0) {
        setError("Invalid email or password");
        return;
      }

      const user = response.data[0];

      // Check whether the user is admin
      if (user.role !== "admin") {
        setError("Access denied. Admin only.");
        return;
      }

      // Save admin login
      localStorage.setItem("admin", JSON.stringify(user));

      // Go to admin dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-black px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-purple-900 mb-2">
          STEPORA
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Admin Login
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@stepora.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-900 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            Admin Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;