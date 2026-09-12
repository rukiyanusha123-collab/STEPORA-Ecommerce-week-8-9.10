import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate(

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-lg w-full">

        <div className="text-7xl font-extrabold text-[#722F37]">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2424] mt-4">
          Page Not Found
        </h1>

        <p className="text-gray-500 mt-3">
          Sorry, the page you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="mt-7 bg-[#722F37] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#5E252C] transition"
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}

export default NotFound;