import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [menuOpen, setMenuOpen] = useState(false);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products"
        );

        setProducts(
          response.data.filter(
            (product) => product.active !== false
          )
        );
      } catch (error) {
        console.log("Products fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= CATEGORIES =================
  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // ================= FILTER =================
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // ================= SORT =================
  if (sort === "low") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  // ================= VISIBLE PRODUCTS =================
  const visibleProducts = filteredProducts.slice(
    0,
    visibleCount
  );

  // ================= LOAD MORE =================
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // ================= RESET COUNT =================
  useEffect(() => {
    setVisibleCount(6);
  }, [search, category, sort]);

  // ================= HERO PRODUCT =================
  const heroProduct = products.find(
    (product) =>
      product.name.toLowerCase() ===
      "puma smash v2".toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* =====================================================
          TOP BAR
      ====================================================== */}
      <div className="bg-[#722F37] text-white text-center px-4 py-2.5 text-xs sm:text-sm font-medium">
        Free Shipping on Orders Above ₹999
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">

            {/* LOGO */}
            <h1
              onClick={() => navigate("/home")}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#722F37] cursor-pointer"
            >
              STEPORA
            </h1>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">

              <button
                onClick={() => navigate("/home")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37] transition"
              >
                Home
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37] transition"
              >
                Products
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37] transition"
              >
                My Orders
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37] transition"
              >
                Wishlist ❤️
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="text-sm font-medium text-gray-700 hover:text-[#722F37] transition"
              >
                🛒 Cart
              </button>

              <button
                onClick={handleLogout}
                className="bg-[#722F37] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#5E252C] transition shadow-sm"
              >
                Logout
              </button>

            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-[#722F37]"
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

          {/* MOBILE NAV */}
          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">

              <div className="flex flex-col gap-1">

                <button
                  onClick={() => {
                    navigate("/home");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  Home
                </button>

                <button
                  onClick={() => {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  Products
                </button>

                <button
                  onClick={() => {
                    navigate("/orders");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  Wishlist ❤️
                </button>

                <button
                  onClick={() => {
                    navigate("/cart");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  🛒 Cart
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-lg bg-[#722F37] text-white mt-1"
                >
                  Logout
                </button>

              </div>

            </div>
          )}

        </div>

      </nav>

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">

        <div className="bg-[#E8D7C7] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">

            {/* HERO CONTENT */}
            <div className="p-7 sm:p-10 lg:p-14 xl:p-16">

              <p className="text-[#722F37] font-bold tracking-[0.2em] text-xs sm:text-sm">
                STEP INTO STYLE
              </p>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#111827] leading-[1.05] mt-4">
                Find Your
                <br />
                <span className="text-[#722F37]">
                  Perfect Pair
                </span>
              </h2>

              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-6 max-w-lg leading-relaxed">
                Discover stylish and comfortable shoes
                designed to match your everyday lifestyle.
              </p>

              <button
                onClick={() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="mt-7 bg-[#722F37] text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-[#5E252C] transition shadow-md"
              >
                Shop Now →
              </button>

            </div>

            {/* HERO IMAGE */}
            <div className="px-5 sm:px-8 lg:px-12 pb-6 md:pb-6">

              <div className="bg-white rounded-2xl sm:rounded-3xl h-[300px] sm:h-[380px] lg:h-[440px] flex items-center justify-center overflow-hidden">

                {heroProduct && (
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="w-[88%] h-[88%] object-contain"
                  />
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}
      <main
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >

        {/* SECTION HEADING */}
        <div className="mb-7 sm:mb-9">

          <p className="text-[#722F37] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase">
            Our Collection
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

            <div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-2">
                Explore Our Shoes
              </h2>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Find the perfect pair for every step.
              </p>

            </div>

            <span className="text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>

          </div>

        </div>

        {/* =====================================================
            FILTER BAR
        ====================================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* SEARCH */}
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search shoes..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-[#F8F1E7] border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37] transition"
              />

            </div>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full bg-[#F8F1E7] border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37] transition"
            >

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}

            </select>

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full bg-[#F8F1E7] border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37] transition"
            >

              <option value="">
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

        </div>

        {/* PRODUCT COUNT */}
        <div className="mb-5 text-sm text-gray-500">

          Showing{" "}
          <span className="font-semibold text-[#2D2424]">
            {visibleProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#2D2424]">
            {filteredProducts.length}
          </span>{" "}
          products

        </div>

        {/* =====================================================
            NO PRODUCTS
        ====================================================== */}
        {filteredProducts.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 sm:p-16 text-center shadow-sm">

            <div className="text-5xl mb-4">
              👟
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#2D2424]">
              No products found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or category.
            </p>

          </div>

        ) : (

          /* =====================================================
             PRODUCT GRID
          ====================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {visibleProducts.map((product) => (

              <div
                key={product.id}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col"
              >

                {/* =================================================
                    IMAGE AREA
                ================================================== */}
                <div
                  onClick={() =>
                    navigate(`/product/${product.id}`)
                  }
                  className="relative bg-white h-[280px] sm:h-[300px] lg:h-[320px] flex items-center justify-center cursor-pointer border-b border-gray-100"
                >

                  {/* BADGE */}
                  <div className="absolute top-4 left-4 z-10 bg-[#F8F1E7] text-[#722F37] px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                    {product.category}
                  </div>

                  {/* VIEW */}
                  <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ↗
                  </div>

                  {/* PRODUCT IMAGE */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[86%] h-[86%] object-contain"
                  />

                </div>

                {/* =================================================
                    PRODUCT DETAILS
                ================================================== */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">

                  {/* PRODUCT NAME */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug min-h-[52px]">
                    {product.name}
                  </h3>

                  {/* RATING */}
                  <div className="flex items-center gap-2 mt-2">

                    <div className="flex items-center gap-0.5 text-sm">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="text-gray-300">
                        ★
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      4.0
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed min-h-[40px]">
                    {product.description}
                  </p>

                  {/* PRICE */}
                  <div className="mt-4">

                    <span className="text-2xl sm:text-3xl font-extrabold text-[#722F37]">
                      ₹{product.price}
                    </span>

                  </div>

                  {/* STOCK */}
                  <div className="mt-3">

                    {product.stock > 0 ? (

                      <div>

                        <p className="text-sm font-semibold text-green-600">
                          In Stock
                        </p>

                        {product.stock <= 5 && (
                          <p className="text-xs text-red-500 mt-1">
                            Only {product.stock} left
                          </p>
                        )}

                      </div>

                    ) : (

                      <p className="text-sm font-semibold text-red-600">
                        Currently unavailable
                      </p>

                    )}

                  </div>

                  {/* BUTTON */}
                  <div className="mt-auto pt-5">

                    <button
                      onClick={() =>
                        navigate(`/product/${product.id}`)
                      }
                      className="w-full bg-[#722F37] text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#5E252C] transition"
                    >
                      View Product
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* =====================================================
            LOAD MORE
        ====================================================== */}
        {visibleCount < filteredProducts.length && (

          <div className="flex justify-center mt-10">

            <button
              onClick={handleLoadMore}
              className="bg-white border border-[#722F37] text-[#722F37] px-9 py-3 rounded-lg font-semibold hover:bg-[#722F37] hover:text-white transition"
            >
              Load More
            </button>

          </div>

        )}

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-[#2D2424] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 text-center">

          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
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

export default Home;