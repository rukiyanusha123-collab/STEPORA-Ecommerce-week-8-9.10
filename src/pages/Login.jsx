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

    if (!email || !password) {
      setPopupMessage("Please enter email and password.");
      setSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/users"
      );

      const users = response.data;

      const loggedInUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() ===
            email.trim().toLowerCase() &&
          user.password === password
      );

      if (!loggedInUser) {
        setPopupMessage("Invalid email or password.");
        setSuccess(false);
        setShowPopup(true);
        return;
      }

      const userData = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role || "user",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("cartItems");

      setEmail("");
      setPassword("");

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

  const handleOk = () => {
    setShowPopup(false);

    if (success) {
      const userData = JSON.parse(
        localStorage.getItem("user")
      );

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4 sm:px-6 py-8">

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl">

        {/* LOGO */}
        <div className="text-center mb-6 sm:mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-[#722F37]">
            STEPORA
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Welcome back to STEPORA
          </p>

        </div>

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#2D2424] mb-6 sm:mb-8">
          Login
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-4 sm:space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-sm font-semibold text-[#2D2424] mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-[#2D2424] text-sm sm:text-base focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] transition"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-sm font-semibold text-[#2D2424] mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-[#2D2424] text-sm sm:text-base focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] transition"
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#722F37] text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#5E252C] transition active:scale-[0.98]"
          >
            LOGIN
          </button>

        </form>

        {/* REGISTER */}
        <div className="text-center mt-6">

          <p className="text-gray-500 text-sm sm:text-base">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-2 text-[#722F37] font-semibold hover:underline"
          >
            Create an Account
          </button>

        </div>

      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-center">

            {/* ICON */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 ${
                success
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {success ? "✓" : "!"}
            </div>

            {/* POPUP TITLE */}
            <h2
              className={`text-xl sm:text-2xl font-bold mb-3 ${
                success
                  ? "text-[#722F37]"
                  : "text-red-600"
              }`}
            >
              {success
                ? "Login Successful!"
                : "Login Error"}
            </h2>

            {/* MESSAGE */}
            <p className="text-[#2D2424] text-sm sm:text-base mb-6">
              {popupMessage}
            </p>

            {/* OK BUTTON */}
            <button
              type="button"
              onClick={handleOk}
              className="w-full sm:w-auto bg-[#722F37] text-white px-8 sm:px-10 py-3 rounded-xl font-semibold hover:bg-[#5E252C] transition"
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