import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import heroShoe from "../assets/hero-shoe.jpg.avif";
import steporaLogo from "../assets/stepora-logo.png";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const [menuOpen, setMenuOpen] = useState(false);

  // ================= AUTH =================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  );

  // ================= LOADING =================

  const [loading, setLoading] = useState(true);

  // ================= INFINITE SCROLL =================

  const [visibleCount, setVisibleCount] = useState(6);

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "http://localhost:3000/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= CATEGORIES =================

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // ================= FILTER PRODUCTS =================

  const filteredProducts = products.filter((product) => {
    const productName =
      product.name?.toLowerCase() || "";

    const searchText =
      search.toLowerCase();

    const matchesSearch =
      productName.includes(searchText);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  // ================= SORT PRODUCTS =================

  const sortedProducts = [
    ...filteredProducts,
  ].sort((a, b) => {
    if (sort === "low") {
      return (
        Number(a.price) -
        Number(b.price)
      );
    }

    if (sort === "high") {
      return (
        Number(b.price) -
        Number(a.price)
      );
    }

    return 0;
  });

  // ================= VISIBLE PRODUCTS =================

  const visibleProducts =
    sortedProducts.slice(
      0,
      visibleCount
    );

  // ================= RESET SCROLL COUNT =================

  useEffect(() => {
    setVisibleCount(6);
  }, [search, category, sort]);

  // ================= INFINITE SCROLL =================

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight;

      if (
        scrollTop + windowHeight >=
        documentHeight - 200
      ) {
        setVisibleCount((prev) => {
          if (prev < sortedProducts.length) {
            return prev + 6;
          }

          return prev;
        });
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [sortedProducts.length]);

  // ================= LOGIN =================

  const goToLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  // ================= LOGOUT =================

  const handleLogout = async () => {
    const storedUser =
      localStorage.getItem("user");

    const user = storedUser
      ? JSON.parse(storedUser)
      : null;

    try {
      if (user) {
        const response = await axios.get(
          `http://localhost:3000/carts?userId=${user.id}`
        );

        if (response.data.length > 0) {
          await axios.patch(
            `http://localhost:3000/carts/${response.data[0].id}`,
            {
              items: [],
            }
          );
        }
      }
    } catch (error) {
      console.log(
        "Logout cart clear error:",
        error
      );
    }

    // Remove login data
    localStorage.removeItem("user");

    // Remove cart data
    localStorage.removeItem("cart");
    localStorage.removeItem("cartItems");

    // Update UI
    setIsLoggedIn(false);
    setMenuOpen(false);

    // IMPORTANT:
    // replace prevents logout page from staying
    // in browser history
    navigate("/login", {
      replace: true,
    });
  };

  // ================= NAVIGATION =================

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMenuOpen(false);
  };

  const goToHome = () => {
    navigate("/home");
    setMenuOpen(false);
  };

  const goToOrders = () => {
    navigate("/orders");
    setMenuOpen(false);
  };

  const goToCart = () => {
    navigate("/cart");
    setMenuOpen(false);
  };

  // ================= SKELETON CARD =================

  const SkeletonCard = () => {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">

        {/* IMAGE SKELETON */}

        <div className="h-56 sm:h-64 bg-gray-200"></div>

        {/* CONTENT SKELETON */}

        <div className="p-5 sm:p-6">

          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>

          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

          <div className="h-6 bg-gray-200 rounded w-1/2 mb-5"></div>

          <div className="flex justify-between mb-5">

            <div className="h-6 bg-gray-200 rounded w-1/4"></div>

            <div className="h-4 bg-gray-200 rounded w-1/5"></div>

          </div>

          <div className="h-12 bg-gray-200 rounded-xl"></div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F1E8] overflow-x-hidden">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white shadow-sm sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between min-h-[72px]">

            {/* LOGO */}

            <div className="flex items-center gap-2 sm:gap-3">

              <img
                src={steporaLogo}
                alt="STEPORA Logo"
                className="w-11 h-11 sm:w-14 sm:h-14 object-contain shrink-0"
              />

              <h1
                onClick={goToHome}
                className="text-2xl sm:text-3xl font-bold text-[#7A3039] cursor-pointer"
              >
                STEPORA
              </h1>

            </div>

            {/* DESKTOP NAVIGATION */}

            <div className="hidden md:flex items-center gap-5 lg:gap-7">

              <button
                onClick={goToHome}
                className="text-gray-700 hover:text-[#7A3039] font-medium transition"
              >
                Home
              </button>

              <button
                onClick={scrollToProducts}
                className="text-gray-700 hover:text-[#7A3039] font-medium transition"
              >
                Products
              </button>

              {/* LOGGED IN OPTIONS */}

              {isLoggedIn && (
                <>
                  <button
                    onClick={goToOrders}
                    className="text-gray-700 hover:text-[#7A3039] font-medium transition"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={goToCart}
                    className="text-gray-700 hover:text-[#7A3039] font-medium transition"
                  >
                    🛒 Cart
                  </button>
                </>
              )}

              {/* LOGIN / LOGOUT */}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-[#7A3039] text-white px-4 lg:px-5 py-2 rounded-lg hover:bg-[#64252D] transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={goToLogin}
                  className="bg-[#7A3039] text-white px-4 lg:px-5 py-2 rounded-lg hover:bg-[#64252D] transition"
                >
                  Login
                </button>
              )}

            </div>

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="md:hidden text-2xl text-[#7A3039] w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F8F1E8] transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

          {/* MOBILE NAVIGATION */}

          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">

              <div className="flex flex-col gap-2">

                <button
                  onClick={goToHome}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[#F8F1E8] hover:text-[#7A3039] transition"
                >
                  Home
                </button>

                <button
                  onClick={scrollToProducts}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[#F8F1E8] hover:text-[#7A3039] transition"
                >
                  Products
                </button>

                {isLoggedIn && (
                  <>
                    <button
                      onClick={goToOrders}
                      className="w-full text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[#F8F1E8] hover:text-[#7A3039] transition"
                    >
                      My Orders
                    </button>

                    <button
                      onClick={goToCart}
                      className="w-full text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-[#F8F1E8] hover:text-[#7A3039] transition"
                    >
                      🛒 Cart
                    </button>
                  </>
                )}

                {/* LOGIN / LOGOUT */}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#7A3039] text-white px-5 py-3 rounded-lg hover:bg-[#64252D] transition mt-2"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={goToLogin}
                    className="w-full bg-[#7A3039] text-white px-5 py-3 rounded-lg hover:bg-[#64252D] transition mt-2"
                  >
                    Login
                  </button>
                )}

              </div>

            </div>
          )}

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">

        <div className="bg-[#E9D8C9] rounded-2xl sm:rounded-3xl overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-0 md:min-h-[500px]">

            {/* HERO TEXT */}

            <div className="p-7 sm:p-10 md:p-14">

              <p className="text-[#7A3039] font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                STEP INTO STYLE
              </p>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5 sm:mb-6">

                Find Your

                <span className="text-[#7A3039]">
                  {" "}Perfect{" "}
                </span>

                Pair

              </h2>

              <p className="text-gray-600 text-base sm:text-lg mb-7 sm:mb-8 max-w-md leading-relaxed">
                Discover stylish and comfortable shoes
                designed to match your everyday lifestyle.
              </p>

              <button
                onClick={scrollToProducts}
                className="bg-[#7A3039] text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-[#64252D] transition w-full sm:w-auto"
              >
                Shop Now
              </button>

            </div>

            {/* HERO IMAGE */}

            <div className="flex justify-center items-center px-5 pb-7 sm:px-8 sm:pb-8 md:p-8">

              <div className="w-full max-w-lg h-[260px] sm:h-[330px] md:h-[380px] bg-[#F5F0EA] rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden shadow-lg">

                <img
                  src={heroShoe}
                  alt="Stepora Shoe"
                  className="w-full h-full object-contain p-5 sm:p-8"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= PRODUCTS ================= */}

      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >

        {/* SECTION HEADING */}

        <div className="mb-7 sm:mb-8">

          <p className="text-[#7A3039] font-semibold text-sm sm:text-base mb-2">
            OUR COLLECTION
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Our Shoes
          </h2>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search shoes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7A3039]"
          />

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7A3039]"
          >

            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat === "All"
                  ? "All Categories"
                  : cat}
              </option>
            ))}

          </select>

          {/* SORT */}

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#7A3039]"
          >

            <option value="default">
              Sort By Price
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

          </select>

        </div>

        {/* ================= PRODUCT COUNT ================= */}

        {!loading && (
          <p className="text-gray-500 mb-5 sm:mb-6">
            Showing {visibleProducts.length} of{" "}
            {sortedProducts.length} products
          </p>
        )}

        {/* ================= SKELETON LOADING ================= */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 lg:gap-8">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <SkeletonCard key={item} />
              )
            )}

          </div>

        ) : sortedProducts.length === 0 ? (

          /* ================= NO PRODUCTS ================= */

          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              No shoes found
            </h3>

            <p className="text-gray-500">
              Try another search or category.
            </p>

          </div>

        ) : (

          /* ================= PRODUCT GRID ================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 lg:gap-8">

            {visibleProducts.map(
              (product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="h-56 sm:h-64 bg-[#F5F0EA] flex items-center justify-center p-5 sm:p-6">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />

                  </div>

                  {/* PRODUCT INFO */}

                  <div className="p-5 sm:p-6">

                    <p className="text-sm text-[#7A3039] font-medium mb-2">
                      {product.category}
                    </p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[28px] sm:min-h-[30px]">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between gap-3 mb-5">

                      <p className="text-xl sm:text-2xl font-bold text-[#7A3039]">
                        ₹{product.price}
                      </p>

                      <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        Stock: {product.stock}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                      className="w-full bg-[#7A3039] text-white py-3 rounded-xl font-semibold hover:bg-[#64252D] transition"
                    >
                      View Details
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

        {/* ================= INFINITE SCROLL MESSAGE ================= */}

        {!loading &&
          visibleProducts.length <
            sortedProducts.length && (

            <div className="text-center py-10">

              <div className="inline-flex items-center gap-3 text-gray-500">

                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#7A3039] rounded-full animate-spin"></div>

                <span>
                  Scroll down to load more shoes...
                </span>

              </div>

            </div>

          )}

        {/* ================= ALL PRODUCTS LOADED ================= */}

        {!loading &&
          sortedProducts.length > 0 &&
          visibleProducts.length >=
            sortedProducts.length && (

            <p className="text-center text-gray-400 py-10">
              You have reached the end of the collection.
            </p>

          )}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-[#7A3039] text-white py-8 sm:py-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-2xl font-bold mb-2">
            STEPORA
          </h2>

          <p className="text-white/80 text-sm sm:text-base">
            Step into style. Walk with confidence.
          </p>

          <p className="text-white/60 text-xs sm:text-sm mt-4">
            © 2026 STEPORA. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;