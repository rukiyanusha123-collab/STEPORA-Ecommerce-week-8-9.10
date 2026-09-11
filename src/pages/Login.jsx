import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!email || !password) {
      setPopupMessage("Please enter email and password.");
      setSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      // Get all users
      const response = await axios.get(
        "http://localhost:3000/users"
      );

      const users = response.data;

      // Find user
      const loggedInUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() ===
            email.trim().toLowerCase() &&
          user.password === password
      );

      // Invalid login
      if (!loggedInUser) {
        setPopupMessage("Invalid email or password.");
        setSuccess(false);
        setShowPopup(true);
        return;
      }

      // Check blocked user
      if (loggedInUser.blocked === true) {
        setPopupMessage(
          "Your account has been blocked."
        );
        setSuccess(false);
        setShowPopup(true);
        return;
      }

      // User data to store in localStorage
      const userData = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role || "user",
      };

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // Clear old local cart
      localStorage.removeItem("cart");
      localStorage.removeItem("cartItems");

      // Clear form
      setEmail("");
      setPassword("");

      // Success popup
      setPopupMessage("Welcome back!");
      setSuccess(true);
      setShowPopup(true);

    } catch (error) {
      console.log("Login error:", error);

      setPopupMessage(
        "Login failed. Please try again."
      );

      setSuccess(false);
      setShowPopup(true);
    }
  };

  // Popup OK button
  const handleOk = () => {
    setShowPopup(false);

    if (success) {
      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      // Admin → Admin Dashboard
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        // User → Home
        navigate("/home");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4">

      {/* ================= LOGIN CARD ================= */}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* LOGO */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-[#722F37]">
            STEPORA
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Please login to continue.
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#722F37]"
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#722F37]"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="w-full bg-[#722F37] text-white py-3 rounded-lg font-semibold hover:bg-[#5f272e] transition"
          >
            Login
          </button>

        </form>

        {/* REGISTER LINK */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Don't have an account?{" "}

          <button
            onClick={() => navigate("/register")}
            className="text-[#722F37] font-semibold hover:underline"
          >
            Register
          </button>

        </p>

      </div>

      {/* ================= POPUP ================= */}

      {showPopup && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">

            {/* ICON */}

            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 ${
                success
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {success ? "✓" : "!"}
            </div>

            {/* MESSAGE */}

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {success
                ? "Login Successful"
                : "Login Failed"}
            </h2>

            <p className="text-gray-500 text-sm">
              {popupMessage}
            </p>

            {/* OK BUTTON */}

            <button
              onClick={handleOk}
              className="w-full mt-6 bg-[#722F37] text-white py-3 rounded-lg font-semibold hover:bg-[#5f272e] transition"
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Login;