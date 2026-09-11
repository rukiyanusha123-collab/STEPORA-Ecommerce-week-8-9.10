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

  // FETCH PRODUCTS
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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // CATEGORIES
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // FILTER PRODUCTS
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // SORT PRODUCTS
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

  const visibleProducts = filteredProducts.slice(
    0,
    visibleCount
  );

  // LOAD MORE
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // RESET VISIBLE COUNT
  useEffect(() => {
    setVisibleCount(6);
  }, [search, category, sort]);

  // FIND PUMA SMASH V2 FOR HERO
  const heroProduct = products.find(
    (product) =>
      product.name.toLowerCase() ===
      "puma smash v2".toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center px-4 py-2 text-xs sm:text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between gap-4">

            {/* LOGO */}
            <h1
              onClick={() => navigate("/home")}
              className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer shrink-0"
            >
              STEPORA
            </h1>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7 font-medium">

              <button
                onClick={() => navigate("/home")}
                className="text-[#2D2424] hover:text-[#722F37] transition"
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
                className="text-[#2D2424] hover:text-[#722F37] transition"
              >
                Products
              </button>

              <button
                onClick={() => navigate("/orders")}
                className="text-[#2D2424] hover:text-[#722F37] transition"
              >
                My Orders
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="text-[#2D2424] hover:text-[#722F37] transition"
              >
                Wishlist ❤️
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="text-[#2D2424] hover:text-[#722F37] transition"
              >
                🛒 Cart
              </button>

              <button
                onClick={handleLogout}
                className="bg-[#722F37] text-white px-5 py-2.5 rounded-lg hover:bg-[#5E252C] transition"
              >
                Logout
              </button>

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-[#722F37]"
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

          {/* MOBILE NAVIGATION */}
          {menuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">

              <div className="flex flex-col gap-3">

                <button
                  onClick={() => {
                    navigate("/home");
                    setMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-[#2D2424] hover:bg-[#F8F1E7] hover:text-[#722F37]"
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
                  className="text-left px-3 py-2 rounded-lg text-[#2D2424] hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  Products
                </button>

                <button
                  onClick={() => {
                    navigate("/orders");
                    setMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-[#2D2424] hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-[#2D2424] hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  Wishlist ❤️
                </button>

                <button
                  onClick={() => {
                    navigate("/cart");
                    setMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-[#2D2424] hover:bg-[#F8F1E7] hover:text-[#722F37]"
                >
                  🛒 Cart
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-lg bg-[#722F37] text-white hover:bg-[#5E252C]"
                >
                  Logout
                </button>

              </div>

            </div>
          )}

        </div>

      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">

        <div className="bg-[#E8D7C7] rounded-2xl sm:rounded-3xl overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[460px]">

            {/* HERO TEXT */}
            <div className="p-7 sm:p-10 lg:p-14 xl:p-16">

              <p className="text-[#722F37] font-semibold tracking-widest text-sm sm:text-base">
                STEP INTO STYLE
              </p>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#111827] leading-[1.05] mt-4">
                Find Your
                <br />
                <span className="text-[#722F37]">
                  Perfect Pair
                </span>
              </h2>

              <p className="text-[#4B5563] text-sm sm:text-base lg:text-lg mt-6 max-w-lg leading-relaxed">
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
                className="mt-7 bg-[#722F37] text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-[#5E252C] hover:shadow-lg transition duration-300"
              >
                Shop Now
              </button>

            </div>

            {/* HERO SHOE IMAGE */}
            <div className="px-5 sm:px-8 lg:px-12 pb-8 md:pb-0">

              <div className="relative bg-[#FDFBF8] rounded-2xl sm:rounded-3xl min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] flex items-center justify-center overflow-hidden shadow-sm">

                {/* DECORATIVE CIRCLE */}
                <div className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-[#E8D7C7]" />

                {/* PUMA SMASH V2 - SAME IMAGE FROM db.json */}
                {heroProduct && (
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="relative z-10 w-[82%] sm:w-[75%] lg:w-[72%] max-h-[330px] sm:max-h-[380px] lg:max-h-[420px] object-contain"
                  />
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= PRODUCTS ================= */}
      <main
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >

        {/* SECTION TITLE */}
        <div className="mb-7 sm:mb-9">

          <p className="text-[#722F37] font-medium text-sm sm:text-base tracking-wide">
            OUR COLLECTION
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-2">
            Explore Our Shoes
          </h2>

        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search shoes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#722F37]"
          />

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#722F37]"
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
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#722F37]"
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

        {/* PRODUCT COUNT */}
        <div className="mb-5 text-sm text-gray-500">
          Showing {visibleProducts.length} of{" "}
          {filteredProducts.length} products
        </div>

        {/* NO PRODUCTS */}
        {filteredProducts.length === 0 ? (

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <h3 className="text-xl font-semibold text-[#2D2424]">
              No products found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or category.
            </p>

          </div>

        ) : (

          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {visibleProducts.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col"
              >

                {/* PRODUCT IMAGE */}
                <div
                  onClick={() =>
                    navigate(`/product/${product.id}`)
                  }
                  className="bg-[#F5F0EA] h-[230px] sm:h-[260px] lg:h-[280px] p-5 flex items-center justify-center cursor-pointer"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-xl"
                  />

                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-5 flex flex-col flex-1">

                  <p className="text-[#722F37] text-xs font-semibold uppercase tracking-widest">
                    {product.category}
                  </p>

                  <h3 className="text-xl font-bold text-[#2D2424] mt-2 break-words">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 mt-4">

                    <span className="text-2xl font-bold text-[#722F37]">
                      ₹{product.price}
                    </span>

                    {product.stock > 0 ? (
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    )}

                  </div>

                  {/* VIEW PRODUCT */}
                  <button
                    onClick={() =>
                      navigate(`/product/${product.id}`)
                    }
                    className="mt-5 w-full bg-[#722F37] text-white py-3 rounded-xl font-semibold hover:bg-[#5E252C] transition"
                  >
                    View Product
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* LOAD MORE */}
        {visibleCount < filteredProducts.length && (

          <div className="flex justify-center mt-8">

            <button
              onClick={handleLoadMore}
              className="bg-white border border-[#722F37] text-[#722F37] px-7 py-3 rounded-xl font-semibold hover:bg-[#722F37] hover:text-white transition"
            >
              Load More
            </button>

          </div>

        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2D2424] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">

          <div className="text-center">

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

        </div>

      </footer>

    </div>
  );
}

export default Home;