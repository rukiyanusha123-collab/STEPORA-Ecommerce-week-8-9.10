import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Get all orders
        const response = await axios.get(
          "http://localhost:3000/orders"
        );

        const allOrders = response.data || [];

        // Find current user's orders
        const userOrders = allOrders
          .filter(
            (order) =>
              String(order.userId) === String(user.id) ||
              order.userEmail?.toLowerCase() ===
                user.email?.toLowerCase()
          )
          .sort(
            (a, b) =>
              new Date(b.date) - new Date(a.date)
          );

        setOrders(userOrders);

      } catch (error) {
        console.log(
          "Orders loading error:",
          error
        );

        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user?.id, user?.email]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4">

        <h2 className="text-xl sm:text-2xl font-semibold text-[#722F37] text-center">
          Loading orders...
        </h2>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center py-2 px-4 text-xs sm:text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 shadow-sm">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LOGO */}
          <h1
            onClick={() => navigate("/home")}
            className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer"
          >
            STEPORA
          </h1>

          {/* NAV LINKS */}
          <div className="hidden md:flex gap-6 lg:gap-8 font-medium">

            <button
              onClick={() => navigate("/home")}
              className="hover:text-[#722F37] transition"
            >
              HOME
            </button>

            <button
              onClick={() => navigate("/home")}
              className="hover:text-[#722F37] transition"
            >
              PRODUCTS
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="hover:text-[#722F37] transition"
            >
              CART
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="text-[#722F37] font-semibold"
            >
              ORDERS
            </button>

          </div>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="text-xl sm:text-2xl hover:scale-110 transition"
          >
            🛒
          </button>

        </div>

      </nav>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">

        {/* TITLE */}
        <div className="mb-7 sm:mb-10">

          <p className="text-[#722F37] font-semibold tracking-widest text-sm sm:text-base">
            ORDER HISTORY
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2424] mt-2">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base md:text-lg">
            View your previous orders and their status.
          </p>

        </div>

        {/* NO ORDERS */}
        {orders.length === 0 ? (

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-8 sm:p-12 text-center">

            <div className="text-5xl sm:text-6xl mb-6">
              📦
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2424]">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base md:text-lg">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-7 sm:mt-8 bg-[#722F37] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[#5E252C] transition"
            >
              Start Shopping
            </button>

          </div>

        ) : (

          /* ORDERS */
          <div className="space-y-6 sm:space-y-8">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 md:p-8"
              >

                {/* ORDER HEADER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

                  {/* ORDER ID */}
                  <div className="min-w-0">

                    <p className="text-gray-500 text-sm">
                      Order ID
                    </p>

                    <h3 className="font-bold text-base sm:text-lg text-[#2D2424] break-all">
                      #{order.id}
                    </h3>

                  </div>

                  {/* DATE */}
                  <div>

                    <p className="text-gray-500 text-sm">
                      Order Date
                    </p>

                    <p className="font-semibold text-[#2D2424] text-sm sm:text-base">
                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div className="sm:col-span-2 md:col-span-1">

                    <p className="text-gray-500 text-sm mb-2">
                      Status
                    </p>

                    <span
                      className={`inline-block px-4 sm:px-5 py-2 rounded-full font-semibold text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>

                  </div>

                </div>

                {/* ORDER CONTENT */}
                <div className="border-t mt-5 sm:mt-6 pt-5 sm:pt-6">

                  {/* DELIVERY DETAILS */}
                  <div className="bg-[#F8F1E7] rounded-xl sm:rounded-2xl p-4 sm:p-5">

                    <h3 className="text-base sm:text-lg font-bold text-[#2D2424] mb-3">
                      Delivery Details
                    </h3>

                    <div className="space-y-1 text-sm sm:text-base">

                      <p className="text-gray-600 break-words">
                        {order.customer?.name || "N/A"}
                      </p>

                      <p className="text-gray-600 break-words">
                        {order.customer?.address || "N/A"}
                      </p>

                      <p className="text-gray-600 break-words">
                        {order.customer?.city || "N/A"}
                        {" - "}
                        {order.customer?.pincode || "N/A"}
                      </p>

                      <p className="text-gray-600 break-words">
                        Phone:{" "}
                        {order.customer?.phone || "N/A"}
                      </p>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-5 sm:mt-6 space-y-5">

                    {order.items?.map(
                      (item, index) => (

                        <div
                          key={`${item.id}-${item.size}-${index}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 border-b pb-5"
                        >

                          {/* IMAGE */}
                          <div className="w-full sm:w-24 h-48 sm:h-24 shrink-0 bg-[#F5F0EA] rounded-xl flex items-center justify-center overflow-hidden">

                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="w-full h-full object-contain"
                            />

                          </div>

                          {/* DETAILS */}
                          <div className="flex-1 min-w-0">

                            <h3 className="text-lg sm:text-xl font-bold text-[#2D2424] break-words">
                              {item.name}
                            </h3>

                            <p className="text-gray-500 mt-1 text-sm sm:text-base">
                              Size:{" "}
                              {item.size}
                            </p>

                            <p className="text-gray-500 text-sm sm:text-base">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                          </div>

                          {/* PRICE */}
                          <p className="font-bold text-[#722F37] text-base sm:text-lg whitespace-nowrap">
                            ₹
                            {Number(
                              item.price || 0
                            ) *
                              Number(
                                item.quantity || 0
                              )}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                  {/* TOTAL */}
                  <div className="mt-5 sm:mt-6">

                    {/* SUBTOTAL */}
                    <div className="flex justify-between gap-4 text-gray-500 text-sm sm:text-base">

                      <span>
                        Subtotal
                      </span>

                      <span className="font-medium whitespace-nowrap">
                        ₹{order.subtotal || 0}
                      </span>

                    </div>

                    {/* SHIPPING */}
                    <div className="flex justify-between gap-4 text-gray-500 mt-2 text-sm sm:text-base">

                      <span>
                        Shipping
                      </span>

                      <span className="font-medium whitespace-nowrap">
                        {Number(
                          order.shipping || 0
                        ) === 0
                          ? "FREE"
                          : `₹${order.shipping}`}
                      </span>

                    </div>

                    {/* TOTAL */}
                    <div className="border-t mt-4 pt-4 flex justify-between items-center gap-4">

                      <span className="text-lg sm:text-xl font-bold">
                        Total
                      </span>

                      <span className="text-xl sm:text-2xl font-bold text-[#722F37] whitespace-nowrap">
                        ₹{order.total || 0}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2D2424] text-white mt-8 sm:mt-10">

        <div className="text-center py-8 sm:py-10 px-4">

          <h2 className="text-xl sm:text-2xl font-bold">
            STEPORA
          </h2>

          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            Step into comfort. Walk with confidence.
          </p>

          <p className="text-gray-400 text-xs sm:text-sm mt-5">
            © 2026 STEPORA
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Orders;