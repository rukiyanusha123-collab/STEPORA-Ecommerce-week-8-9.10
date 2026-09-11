import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  // LOAD WISHLIST
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);

    const savedWishlist = JSON.parse(
      localStorage.getItem(`wishlist_${user.id}`) || "[]"
    );

    setWishlist(savedWishlist);
  }, [navigate]);

  // REMOVE FROM WISHLIST
  const handleRemove = (productId) => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);

    const updatedWishlist = wishlist.filter(
      (product) => String(product.id) !== String(productId)
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      `wishlist_${user.id}`,
      JSON.stringify(updatedWishlist)
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* TOP BAR */}
      <div className="bg-[#722F37] text-white text-center px-4 py-2 text-xs sm:text-sm">
        Free Shipping on Orders Above ₹999
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between">

            <h1
              onClick={() => navigate("/home")}
              className="text-2xl sm:text-3xl font-bold text-[#722F37] cursor-pointer"
            >
              STEPORA
            </h1>

            <div className="flex items-center gap-3 sm:gap-6">

              <button
                onClick={() => navigate("/home")}
                className="text-sm sm:text-base font-medium text-gray-700 hover:text-[#722F37]"
              >
                HOME
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="text-lg sm:text-xl hover:scale-110 transition"
              >
                🛒
              </button>

            </div>

          </div>

        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="flex items-center justify-between gap-4 mb-8">

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2424]">
              My Wishlist ❤️
            </h2>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              {wishlist.length} product
              {wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>

        </div>

        {/* EMPTY WISHLIST */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">

            <div className="text-6xl mb-5">
              ♡
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#2D2424]">
              Your wishlist is empty
            </h3>

            <p className="text-gray-500 mt-2">
              Save your favourite shoes here.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-6 bg-[#722F37] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5E252C] transition"
            >
              Explore Products
            </button>

          </div>
        ) : (

          /* PRODUCTS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
              >

                {/* IMAGE */}
                <div
                  onClick={() =>
                    navigate(`/product/${product.id}`)
                  }
                  className="bg-[#F5F0EA] h-56 sm:h-64 flex items-center justify-center p-5 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-5">

                  <p className="text-[#722F37] text-xs font-semibold uppercase tracking-widest">
                    {product.category}
                  </p>

                  <h3 className="text-xl font-bold text-[#2D2424] mt-2">
                    {product.name}
                  </h3>

                  <p className="text-[#722F37] text-2xl font-bold mt-3">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        navigate(`/product/${product.id}`)
                      }
                      className="flex-1 bg-[#722F37] text-white py-3 rounded-xl font-semibold hover:bg-[#5E252C] transition"
                    >
                      View Product
                    </button>

                    <button
                      onClick={() =>
                        handleRemove(product.id)
                      }
                      className="px-4 py-3 rounded-xl border border-gray-300 hover:border-red-500 hover:text-red-500 transition"
                    >
                      ❤️
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#2D2424] text-white mt-10">

        <div className="max-w-7xl mx-auto px-4 py-8 text-center">

          <h2 className="text-xl sm:text-2xl font-bold">
            STEPORA
          </h2>

          <p className="text-gray-300 mt-2 text-sm">
            Step into comfort. Walk with confidence.
          </p>

          <p className="text-gray-400 text-xs mt-4">
            © 2026 STEPORA
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Wishlist;