import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!name || !email || !password) {
      setPopupMessage("Please fill all the fields.");
      setShowPopup(true);
      return;
    }

    try {
      // Get existing users
      const response = await axios.get(
        "http://localhost:3000/users"
      );

      const users = response.data;

      // Check duplicate email
      const existingUser = users.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        setPopupMessage(
          "This email is already registered."
        );
        setShowPopup(true);
        return;
      }

      // Save new user
      await axios.post(
        "http://localhost:3000/users",
        {
          name: name,
          email: email,
          password: password,
          role: "user",
        }
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Directly go to Login page
      navigate("/login");

    } catch (error) {
      console.log(error);

      setPopupMessage(
        "Registration failed. Please try again."
      );
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4 sm:px-6 py-8">

      {/* Register Card */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl">

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-[#722F37]">
            STEPORA
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Step into your style
          </p>

        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#2D2424] mb-6 sm:mb-8">
          Create Account
        </h2>

        <form
          onSubmit={handleRegister}
          className="space-y-4 sm:space-y-5"
        >

          {/* Name */}
          <div>

            <label className="block text-sm font-semibold text-[#2D2424] mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-[#2D2424] text-sm sm:text-base focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] transition"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-sm font-semibold text-[#2D2424] mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-[#2D2424] text-sm sm:text-base focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] transition"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-semibold text-[#2D2424] mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-[#2D2424] text-sm sm:text-base focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] transition"
            />

          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#722F37] text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#5E252C] transition active:scale-[0.98]"
          >
            REGISTER
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">

          <p className="text-gray-500 text-sm sm:text-base">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-2 text-[#722F37] font-semibold hover:underline"
          >
            Login
          </button>

        </div>

      </div>

      {/* Error Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl text-center">

            {/* Error Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 bg-red-100 text-red-600">
              !
            </div>

            {/* Popup Title */}
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-red-600">
              Registration Error
            </h2>

            {/* Popup Message */}
            <p className="text-[#2D2424] text-sm sm:text-base mb-6">
              {popupMessage}
            </p>

            {/* OK Button */}
            <button
              type="button"
              onClick={() => setShowPopup(false)}
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

export default Register;