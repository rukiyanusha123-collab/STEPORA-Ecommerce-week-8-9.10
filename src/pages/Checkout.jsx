import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { removeFromCart } from "../redux/cartSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Selected product from Cart
  const checkoutItems = location.state?.checkoutItems || [];

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = checkoutItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const shipping = total >= 999 ? 0 : 99;
  const finalTotal = total + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (checkoutItems.length === 0) {
      alert("Please select a product first.");
      navigate("/cart");
      return;
    }

    if (
      !name ||
      !address ||
      !city ||
      !pincode ||
      !phone
    ) {
      alert("Please fill all the details.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Pincode must contain exactly 6 numbers.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 numbers.");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const order = {
        userId: user.id,
        userEmail: user.email,

        customer: {
          name,
          address,
          city,
          pincode,
          phone,
        },

        items: checkoutItems,

        subtotal: total,
        shipping: shipping,
        total: finalTotal,

        status: "Pending",

        date: new Date().toISOString(),
      };

      // Save order
      await axios.post(
        "http://localhost:3000/orders",
        order
      );

      // Update cart
      try {
        const cartResponse = await axios.get(
          `http://localhost:3000/carts?userId=${user.id}`
        );

        if (cartResponse.data.length > 0) {
          const userCart = cartResponse.data[0];

          let remainingItems =
            userCart.items || [];

          checkoutItems.forEach((orderedItem) => {
            remainingItems =
              remainingItems.filter(
                (cartItem) =>
                  !(
                    String(cartItem.id) ===
                      String(orderedItem.id) &&
                    String(cartItem.size) ===
                      String(orderedItem.size)
                  )
              );
          });

          await axios.patch(
            `http://localhost:3000/carts/${userCart.id}`,
            {
              items: remainingItems,
            }
          );

          checkoutItems.forEach((orderedItem) => {
            dispatch(
              removeFromCart({
                id: orderedItem.id,
                size: orderedItem.size,
              })
            );
          });

          localStorage.setItem(
            `cartItems_${user.id}`,
            JSON.stringify(remainingItems)
          );
        }
      } catch (cartError) {
        console.log(
          "Cart update error:",
          cartError
        );
      }

      // Clear form
      setName("");
      setAddress("");
      setCity("");
      setPincode("");
      setPhone("");

      // Go to orders
      navigate("/orders");

    } catch (error) {
      console.log("Order error:", error);

      alert(
        "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // No product selected
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F1E7]">

        {/* TOP BAR */}
        <div className="bg-[#722F37] text-white text-center py-2 px-4 text-xs sm:text-sm">
          Free Shipping on Orders Above ₹999
        </div>

        {/* NAVBAR */}
        <nav className="bg-white px-4 sm:px-6 md:px-8 py-4 shadow-sm">

          <div className="max-w-7xl mx-auto flex items-center justify-between">

            <h1
              onClick={() => navigate("/home")}
              className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer"
            >
              STEPORA
            </h1>

            <div className="hidden md:flex gap-6 lg:gap-8 font-medium">

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
              className="text-xl sm:text-2xl"
            >
              🛒
            </button>

          </div>

        </nav>

        {/* EMPTY CHECKOUT */}
        <main className="min-h-[65vh] flex items-center justify-center px-4 sm:px-6">

          <div className="text-center max-w-md">

            <div className="text-5xl sm:text-6xl mb-6">
              🛒
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2424]">
              No Product Selected
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Please select a product from your cart.
            </p>

            <button
              onClick={() => navigate("/cart")}
              className="mt-8 bg-[#722F37] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-[#5E252C] transition"
            >
              Go to Cart
            </button>

          </div>

        </main>

        {/* FOOTER */}
        <footer className="bg-[#2D2424] text-white">

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

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center py-2 px-4 text-xs sm:text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white px-4 sm:px-6 md:px-8 py-4 shadow-sm">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LOGO */}
          <h1
            onClick={() => navigate("/home")}
            className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer"
          >
            STEPORA
          </h1>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-6 lg:gap-8 font-medium">

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

        {/* BACK */}
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 sm:mb-8 text-[#722F37] font-semibold hover:underline text-sm sm:text-base"
        >
          ← Back to Cart
        </button>

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2424] mb-7 sm:mb-10">
          Checkout
        </h1>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* DELIVERY DETAILS */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-5 sm:p-7 md:p-8">

            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2424] mb-5 sm:mb-6">
              Delivery Details
            </h2>

            <form onSubmit={handlePlaceOrder}>

              {/* NAME */}
              <div className="mb-5">

                <label className="block font-semibold mb-2 text-sm sm:text-base">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                />

              </div>

              {/* ADDRESS */}
              <div className="mb-5">

                <label className="block font-semibold mb-2 text-sm sm:text-base">
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter your delivery address"
                  rows="4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37] resize-none"
                />

              </div>

              {/* CITY */}
              <div className="mb-5">

                <label className="block font-semibold mb-2 text-sm sm:text-base">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Enter your city"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                />

              </div>

              {/* PINCODE */}
              <div className="mb-5">

                <label className="block font-semibold mb-2 text-sm sm:text-base">
                  Pincode
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={pincode}
                  onChange={(e) => {

                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      setPincode(value);
                    }

                  }}
                  placeholder="Enter 6 digit pincode"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                />

              </div>

              {/* PHONE */}
              <div className="mb-6">

                <label className="block font-semibold mb-2 text-sm sm:text-base">
                  Phone Number
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => {

                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      setPhone(value);
                    }

                  }}
                  placeholder="Enter 10 digit phone number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                />

              </div>

              {/* PLACE ORDER */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#722F37] text-white py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[#5E252C] transition disabled:bg-gray-400"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-5 sm:p-7 md:p-8 h-fit lg:sticky lg:top-6">

            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2424] mb-5 sm:mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">

              {checkoutItems.map(
                (item, index) => (

                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="flex flex-col xs:flex-row sm:flex-row items-start sm:items-center gap-4 border-b pb-4"
                  >

                    {/* IMAGE */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#F5F0EA] rounded-xl flex items-center justify-center overflow-hidden">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />

                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0 w-full">

                      <h3 className="font-semibold text-[#2D2424] text-sm sm:text-base break-words">
                        {item.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    {/* PRICE */}
                    <p className="font-bold text-[#722F37] text-sm sm:text-base whitespace-nowrap">
                      ₹
                      {Number(item.price) *
                        item.quantity}
                    </p>

                  </div>

                )
              )}

            </div>

            {/* TOTAL */}
            <div className="border-t mt-6 pt-6">

              <div className="flex justify-between gap-4 text-gray-500 text-sm sm:text-base">

                <span>
                  Subtotal
                </span>

                <span className="whitespace-nowrap">
                  ₹{total}
                </span>

              </div>

              <div className="flex justify-between gap-4 text-gray-500 mt-3 text-sm sm:text-base">

                <span>
                  Shipping
                </span>

                <span className="whitespace-nowrap">
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping}`}
                </span>

              </div>

              <div className="border-t mt-4 pt-4 flex justify-between gap-4">

                <span className="text-lg sm:text-xl font-bold">
                  Total
                </span>

                <span className="text-xl sm:text-2xl font-bold text-[#722F37] whitespace-nowrap">
                  ₹{finalTotal}
                </span>

              </div>

            </div>

          </div>

        </div>

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

export default Checkout;