import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [selectedItemKey, setSelectedItemKey] = useState(null);

  // Get logged-in user
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch user cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        setCartLoaded(true);  
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/carts"
        );

        const carts = response.data;

        const existingCart = carts.find(
          (cart) =>
            String(cart.userId) === String(user.id) ||
            cart.userEmail?.toLowerCase() ===
              user.email?.toLowerCase()
        );

        if (existingCart) {
          setCartId(existingCart.id);

          const cartItems = existingCart.items || [];

          dispatch(setCart(cartItems));

          localStorage.setItem(
            `cartItems_${user.id}`,
            JSON.stringify(cartItems)
          );
        } else {
          const newCart = await axios.post(
            "http://localhost:3000/carts",
            {
              userId: user.id,
              userEmail: user.email,
              items: [],
            }
          );

          setCartId(newCart.data.id);

          dispatch(setCart([]));

          localStorage.setItem(
            `cartItems_${user.id}`,
            JSON.stringify([])
          );
        }
      } catch (error) {
        console.log("Cart fetch error:", error);

        const savedCart = localStorage.getItem(
          `cartItems_${user.id}`
        );

        if (savedCart) {
          dispatch(setCart(JSON.parse(savedCart)));
        }
      } finally {
        setLoading(false);
        setCartLoaded(true);
      }
    };

    fetchCart();
  }, [dispatch, user?.id, user?.email]);

  // Save cart changes to JSON Server
  useEffect(() => {
    if (!cartLoaded || !user || !cartId) {
      return;
    }

    const updateCart = async () => {
      try {
        await axios.patch(
          `http://localhost:3000/carts/${cartId}`,
          {
            userId: user.id,
            userEmail: user.email,
            items: items,
          }
        );

        localStorage.setItem(
          `cartItems_${user.id}`,
          JSON.stringify(items)
        );
      } catch (error) {
        console.log("Cart update error:", error);
      }
    };

    updateCart();
  }, [
    items,
    cartLoaded,
    cartId,
    user?.id,
    user?.email,
  ]);

  // Total price
  const totalPrice = items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // Total items
  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Buy selected item
  const handleCheckout = () => {
    if (!selectedItemKey) {
      alert("Please select a product to checkout.");
      return;
    }

    const selectedItem = items.find(
      (item) =>
        `${item.id}-${item.size}` === selectedItemKey
    );

    if (!selectedItem) {
      alert("Selected product not found.");
      return;
    }

    navigate("/checkout", {
      state: {
        checkoutItems: [selectedItem],
      },
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#722F37] text-center">
          Loading cart...
        </h2>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex flex-col">

        {/* TOP BAR */}
        <div className="bg-[#722F37] text-white text-center px-4 py-2 text-xs sm:text-sm">
          Free Shipping on Orders Above ₹999
        </div>

        {/* NAVBAR */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

            <div className="flex items-center justify-between gap-4">

              {/* LOGO */}
              <h1
                onClick={() => navigate("/home")}
                className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer shrink-0"
              >
                STEPORA
              </h1>

              {/* DESKTOP NAV */}
              <div className="hidden sm:flex items-center gap-5 md:gap-8 font-medium">

                <button
                  onClick={() => navigate("/home")}
                  className="text-gray-700 hover:text-[#722F37] transition"
                >
                  HOME
                </button>

                <button
                  onClick={() => navigate("/home")}
                  className="text-gray-700 hover:text-[#722F37] transition"
                >
                  PRODUCTS
                </button>

              </div>

              {/* CART */}
              <button
                onClick={() => navigate("/home")}
                className="text-lg sm:text-xl hover:scale-110 transition"
              >
                🛒
              </button>

            </div>

            {/* MOBILE NAV */}
            <div className="flex sm:hidden items-center justify-center gap-6 pt-4 mt-4 border-t border-gray-100">

              <button
                onClick={() => navigate("/home")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
              >
                HOME
              </button>

              <button
                onClick={() => navigate("/home")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
              >
                PRODUCTS
              </button>

            </div>

          </div>
        </nav>

        {/* EMPTY CART */}
        <main className="flex-1 min-h-[65vh] flex items-center justify-center px-4 sm:px-6 py-16">

          <div className="text-center max-w-lg">

            <div className="text-6xl sm:text-7xl mb-5 sm:mb-6">
              🛒
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2424]">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-3 text-base sm:text-lg leading-relaxed">
              Looks like you haven't added anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-7 sm:mt-8 bg-[#722F37] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-[#5E252C] transition"
            >
              Continue Shopping
            </button>

          </div>

        </main>

        {/* FOOTER */}
        <footer className="bg-[#2D2424] text-white">

          <div className="text-center px-4 py-8 sm:py-10">

            <h2 className="text-xl sm:text-2xl font-bold">
              STEPORA
            </h2>

            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Step into comfort. Walk with confidence.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5">
              © 2026 STEPORA
            </p>

          </div>

        </footer>

      </div>
    );
  }

  // Cart with products
  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center px-4 py-2 text-xs sm:text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between gap-4">

            {/* LOGO */}
            <h1
              onClick={() => navigate("/home")}
              className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer shrink-0"
            >
              STEPORA
            </h1>

            {/* DESKTOP NAV */}
            <div className="hidden sm:flex items-center gap-5 md:gap-8 font-medium">

              <button
                onClick={() => navigate("/home")}
                className="text-gray-700 hover:text-[#722F37] transition"
              >
                HOME
              </button>

              <button
                onClick={() => navigate("/home")}
                className="text-gray-700 hover:text-[#722F37] transition"
              >
                PRODUCTS
              </button>

            </div>

            {/* CART */}
            <button
              onClick={() => navigate("/cart")}
              className="text-lg sm:text-xl hover:scale-110 transition"
            >
              🛒
            </button>

          </div>

          {/* MOBILE NAV */}
          <div className="flex sm:hidden items-center justify-center gap-6 pt-4 mt-4 border-t border-gray-100">

            <button
              onClick={() => navigate("/home")}
              className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
            >
              HOME
            </button>

            <button
              onClick={() => navigate("/home")}
              className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
            >
              PRODUCTS
            </button>

          </div>

        </div>

      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* HEADING */}
        <div className="mb-7 sm:mb-10">

          <p className="text-[#722F37] font-semibold tracking-widest text-xs sm:text-sm">
            SHOPPING CART
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2424] mt-2">
            Your Cart
          </h2>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}{" "}
            in your cart
          </p>

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* PRODUCTS */}
          <div className="lg:col-span-2 space-y-5">

            {items.map((item) => {

              const itemKey = `${item.id}-${item.size}`;

              return (

                <div
                  key={itemKey}
                  className="bg-white rounded-2xl shadow-md p-4 sm:p-5"
                >

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                    {/* IMAGE */}
                    <div className="w-full sm:w-36 md:w-40 h-52 sm:h-36 md:h-40 bg-[#F5F0EA] rounded-xl overflow-hidden flex items-center justify-center shrink-0">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />

                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">

                      {/* NAME + REMOVE */}
                      <div className="flex justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-xs sm:text-sm text-gray-500">
                            {item.category}
                          </p>

                          <h3 className="text-lg sm:text-xl font-bold text-[#2D2424] mt-1 break-words">
                            {item.name}
                          </h3>

                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => {
                            dispatch(
                              removeFromCart({
                                id: item.id,
                                size: item.size,
                              })
                            );

                            if (
                              selectedItemKey === itemKey
                            ) {
                              setSelectedItemKey(null);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs sm:text-sm shrink-0"
                        >
                          Remove
                        </button>

                      </div>

                      {/* SIZE */}
                      <p className="text-gray-500 mt-3 text-sm sm:text-base">
                        Size:{" "}
                        <span className="font-semibold text-[#2D2424]">
                          {item.size}
                        </span>
                      </p>

                      {/* PRICE */}
                      <p className="text-[#722F37] font-bold text-lg sm:text-xl mt-2 sm:mt-3">
                        ₹{item.price}
                      </p>

                      {/* QUANTITY + ITEM TOTAL */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 mt-4 sm:mt-5">

                        {/* QUANTITY */}
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">

                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  id: item.id,
                                  size: item.size,
                                })
                              )
                            }
                            className="px-3 sm:px-4 py-2 text-lg font-bold hover:bg-gray-100"
                          >
                            −
                          </button>

                          <span className="px-4 sm:px-5 py-2 font-semibold text-sm sm:text-base">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  id: item.id,
                                  size: item.size,
                                })
                              )
                            }
                            className="px-3 sm:px-4 py-2 text-lg font-bold hover:bg-gray-100"
                          >
                            +
                          </button>

                        </div>

                        {/* ITEM TOTAL */}
                        <p className="font-bold text-base sm:text-lg text-[#2D2424]">
                          ₹
                          {Number(item.price) *
                            item.quantity}
                        </p>

                      </div>

                      {/* BUY THIS ITEM */}
                      <button
                        onClick={() =>
                          setSelectedItemKey(itemKey)
                        }
                        className={`w-full mt-4 sm:mt-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition ${
                          selectedItemKey === itemKey
                            ? "bg-green-600 text-white"
                            : "bg-[#722F37] text-white hover:bg-[#5E252C]"
                        }`}
                      >
                        {selectedItemKey === itemKey
                          ? "✓ Selected"
                          : "Buy This Item"}
                      </button>

                    </div>

                  </div>

                </div>

              );
            })}

            {/* CLEAR CART */}
            <button
              onClick={() => {
                dispatch(clearCart());
                setSelectedItemKey(null);
              }}
              className="text-red-500 font-semibold text-sm sm:text-base hover:underline"
            >
              Clear Cart
            </button>

          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 lg:sticky lg:top-6">

              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2424]">
                Order Summary
              </h3>

              {/* SUBTOTAL */}
              <div className="flex justify-between gap-4 mt-6 sm:mt-7 text-sm sm:text-base">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹{totalPrice}
                </span>

              </div>

              {/* SHIPPING */}
              <div className="flex justify-between gap-4 mt-4 text-sm sm:text-base">

                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  {totalPrice >= 999
                    ? "FREE"
                    : "₹99"}
                </span>

              </div>

              {/* TOTAL */}
              <div className="border-t mt-5 sm:mt-6 pt-5 sm:pt-6 flex justify-between gap-4">

                <span className="text-lg sm:text-xl font-bold">
                  Total
                </span>

                <span className="text-xl sm:text-2xl font-bold text-[#722F37]">
                  ₹
                  {totalPrice >= 999
                    ? totalPrice
                    : totalPrice + 99}
                </span>

              </div>

              {/* CHECKOUT */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 sm:mt-7 bg-[#722F37] text-white py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[#5E252C] transition"
              >
                Proceed to Checkout
              </button>

              {/* CONTINUE SHOPPING */}
              <button
                onClick={() => navigate("/home")}
                className="w-full mt-3 border border-[#722F37] text-[#722F37] py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#722F37] hover:text-white transition"
              >
                Continue Shopping
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2D2424] text-white mt-6 sm:mt-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">

          <h2 className="text-xl sm:text-2xl font-bold">
            STEPORA
          </h2>

          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            Step into comfort. Walk with confidence.
          </p>

          <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-5">
            © 2026 STEPORA
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Cart;