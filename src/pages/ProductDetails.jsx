import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCart } from "../redux/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );

        setProduct(response.data);

        // CHECK WISHLIST
        const userData = localStorage.getItem("user");

        if (userData) {
          const user = JSON.parse(userData);

          const savedWishlist = JSON.parse(
            localStorage.getItem(`wishlist_${user.id}`) || "[]"
          );

          const alreadyWishlisted = savedWishlist.some(
            (item) => String(item.id) === String(response.data.id)
          );

          setIsWishlisted(alreadyWishlisted);
        }
      } catch (error) {
        console.log("Product details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ADD / REMOVE WISHLIST
  const handleWishlist = () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);

    const savedWishlist = JSON.parse(
      localStorage.getItem(`wishlist_${user.id}`) || "[]"
    );

    const alreadyExists = savedWishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    let updatedWishlist;

    if (alreadyExists) {
      updatedWishlist = savedWishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );

      setIsWishlisted(false);
      alert("Removed from wishlist.");
    } else {
      updatedWishlist = [...savedWishlist, product];

      setIsWishlisted(true);
      alert("Added to wishlist ❤️");
    }

    localStorage.setItem(
      `wishlist_${user.id}`,
      JSON.stringify(updatedWishlist)
    );
  };

  // ADD TO CART
  const handleAddToCart = async () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login to add products to cart.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);

    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    if (product.stock <= 0) {
      alert("This product is out of stock.");
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

      const newItem = {
        ...product,
        size: selectedSize,
        quantity: 1,
      };

      let updatedItems = [];

      if (existingCart) {
        updatedItems = [...(existingCart.items || [])];

        const existingItemIndex =
          updatedItems.findIndex(
            (item) =>
              String(item.id) === String(product.id) &&
              String(item.size) === String(selectedSize)
          );

        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity:
              updatedItems[existingItemIndex].quantity + 1,
          };
        } else {
          updatedItems.push(newItem);
        }

        await axios.patch(
          `http://localhost:3000/carts/${existingCart.id}`,
          {
            userId: user.id,
            userEmail: user.email,
            items: updatedItems,
          }
        );
      } else {
        updatedItems = [newItem];

        await axios.post(
          "http://localhost:3000/carts",
          {
            userId: user.id,
            userEmail: user.email,
            items: updatedItems,
          }
        );
      }

      dispatch(setCart(updatedItems));

      localStorage.setItem(
        `cartItems_${user.id}`,
        JSON.stringify(updatedItems)
      );

      navigate("/cart");
    } catch (error) {
      console.log("Add to cart error:", error);
      alert("Unable to add product to cart.");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#722F37] text-center">
          Loading product...
        </h2>
      </div>
    );
  }

  // PRODUCT NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2424]">
          Product not found
        </h2>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 bg-[#722F37] text-white px-6 py-3 rounded-xl hover:bg-[#5E252C] transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

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

            {/* NAV LINKS */}
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

              <button
                onClick={() => navigate("/wishlist")}
                className="text-gray-700 hover:text-[#722F37] transition"
              >
                WISHLIST ❤️
              </button>

            </div>

            {/* CART */}
            <button
              onClick={() => navigate("/cart")}
              className="text-lg sm:text-xl hover:scale-110 transition shrink-0"
              aria-label="Cart"
            >
              🛒
            </button>

          </div>

          {/* MOBILE NAVIGATION */}
          <div className="flex sm:hidden items-center justify-center gap-4 pt-4 border-t border-gray-100 mt-4">

            <button
              onClick={() => navigate("/home")}
              className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
            >
              HOME
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="text-sm font-medium text-gray-700 hover:text-[#722F37]"
            >
              ❤️ WISHLIST
            </button>

          </div>

        </div>
      </nav>

      {/* PRODUCT DETAILS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/home")}
          className="mb-6 sm:mb-8 text-[#722F37] font-semibold text-sm sm:text-base hover:underline"
        >
          ← Back to Products
        </button>

        {/* PRODUCT CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* IMAGE SECTION */}
            <div className="bg-[#F5F0EA] min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center p-5 sm:p-8">

              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] flex items-center justify-center">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-2xl"
                />

                {/* WISHLIST BUTTON */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:scale-110 transition text-2xl"
                  aria-label="Wishlist"
                >
                  {isWishlisted ? "❤️" : "♡"}
                </button>

              </div>

            </div>

            {/* DETAILS SECTION */}
            <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">

              {/* CATEGORY */}
              <p className="text-[#722F37] font-semibold tracking-widest uppercase text-xs sm:text-sm">
                {product.category}
              </p>

              {/* PRODUCT NAME */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-[#2D2424] leading-tight break-words">
                {product.name}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 sm:mt-5 leading-relaxed">
                {product.description}
              </p>

              {/* PRICE */}
              <div className="mt-6 sm:mt-8">
                <span className="text-3xl sm:text-4xl font-bold text-[#722F37]">
                  ₹{product.price}
                </span>
              </div>

              {/* STOCK */}
              <div className="mt-4 sm:mt-5">

                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold text-sm sm:text-base">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold text-sm sm:text-base">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* SIZE */}
              <div className="mt-6 sm:mt-8">

                <h3 className="font-semibold text-base sm:text-lg mb-3">
                  Select Size
                </h3>

                <div className="flex gap-2 sm:gap-3 flex-wrap">

                  {["6", "7", "8", "9", "10"].map(
                    (size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`min-w-[48px] sm:min-w-[55px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border transition font-medium text-sm sm:text-base ${
                          selectedSize === size
                            ? "bg-[#722F37] text-white border-[#722F37]"
                            : "border-gray-300 hover:border-[#722F37] hover:text-[#722F37]"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}

                </div>

                {selectedSize && (
                  <p className="mt-3 text-sm text-[#722F37] font-semibold">
                    Selected Size: {selectedSize}
                  </p>
                )}

              </div>

              {/* ADD TO CART */}
              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="mt-6 sm:mt-8 w-full bg-[#722F37] text-white py-3.5 sm:py-4 px-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[#5E252C] transition disabled:bg-gray-400"
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : selectedSize
                  ? "Add to Cart"
                  : "Select Size First"}
              </button>

              {/* PRODUCT INFO */}
              <div className="mt-6 sm:mt-8 border-t pt-5 sm:pt-6">

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Category
                  </span>

                  <span className="font-medium text-sm sm:text-base break-words sm:text-right">
                    {product.category}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Product ID
                  </span>

                  <span className="font-medium text-sm sm:text-base break-all sm:text-right">
                    {product.id}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2">
                  <span className="text-gray-500 text-sm sm:text-base">
                    Availability
                  </span>

                  <span className="font-medium text-sm sm:text-base sm:text-right">
                    {product.stock > 0
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

              </div>

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

export default ProductDetails;