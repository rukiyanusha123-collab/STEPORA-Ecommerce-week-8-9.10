import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center py-2 text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white px-6 md:px-8 py-5 shadow-sm">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <h1
            onClick={() => navigate("/home")}
            className="text-3xl font-bold text-[#722F37] cursor-pointer"
          >
            STEPORA
          </h1>

          <div className="hidden md:flex gap-8 font-medium">

            <button
              onClick={() => navigate("/home")}
              className="hover:text-[#722F37]"
            >
              HOME
            </button>

            <button
              onClick={() => navigate("/home")}
              className="hover:text-[#722F37]"
            >
              PRODUCTS
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="hover:text-[#722F37]"
            >
              CART
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="hover:text-[#722F37]"
            >
              ORDERS
            </button>

          </div>

          <button
            onClick={() => navigate("/cart")}
            className="text-xl"
          >
            🛒
          </button>

        </div>

      </nav>

      {/* SUCCESS */}
      <main className="min-h-[70vh] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl w-full text-center">

          {/* SUCCESS ICON */}
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">

            <span className="text-5xl text-green-600">
              ✓
            </span>

          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2424] mt-8">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 text-lg mt-4">
            Thank you for shopping with STEPORA.
          </p>

          <p className="text-gray-500 mt-2">
            Your order has been placed successfully.
          </p>

          {/* ORDER CONFIRMED */}
          <div className="bg-[#F8F1E7] rounded-2xl p-6 mt-8">

            <div className="flex items-center justify-center gap-3">

              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                ✓
              </div>

              <div className="text-left">

                <p className="font-bold text-[#2D2424]">
                  Order Confirmed
                </p>

                <p className="text-sm text-gray-500">
                  We have received your order.
                </p>

              </div>

            </div>

            {/* ORDER TRACKING */}
            <div className="border-t mt-5 pt-5">

              <div className="flex items-center justify-between">

                <div className="text-center flex-1">

                  <div className="w-8 h-8 mx-auto rounded-full bg-[#722F37] text-white flex items-center justify-center">
                    ✓
                  </div>

                  <p className="text-sm font-semibold mt-2">
                    Confirmed
                  </p>

                </div>

                <div className="h-[2px] bg-gray-300 flex-1"></div>

                <div className="text-center flex-1">

                  <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    2
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Shipped
                  </p>

                </div>

                <div className="h-[2px] bg-gray-300 flex-1"></div>

                <div className="text-center flex-1">

                  <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                    3
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Delivered
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-[#722F37] text-white py-4 rounded-xl font-semibold hover:bg-[#5E252C] transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/home")}
              className="flex-1 border-2 border-[#722F37] text-[#722F37] py-4 rounded-xl font-semibold hover:bg-[#722F37] hover:text-white transition"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2D2424] text-white">

        <div className="text-center py-10">

          <h2 className="text-2xl font-bold">
            STEPORA
          </h2>

          <p className="text-gray-300 mt-2">
            Step into comfort. Walk with confidence.
          </p>

          <p className="text-gray-400 text-sm mt-5">
            © 2026 STEPORA
          </p>

        </div>

      </footer>

    </div>
  );
}

export default OrderSuccess;