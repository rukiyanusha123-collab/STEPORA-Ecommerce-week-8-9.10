import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category filter
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // Add product form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  // Popup
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD PRODUCT =================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (
      !name ||
      !price ||
      !category ||
      !image ||
      !description ||
      !stock
    ) {
      setMessage("Please fill all product details.");
      setShowPopup(true);
      return;
    }

    // Check duplicate product
    const duplicateProduct = products.find(
      (product) =>
        product.name.trim().toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (duplicateProduct) {
      setMessage("Product already exists.");
      setShowPopup(true);
      return;
    }

    try {
      const newProduct = {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        image: image.trim(),
        description: description.trim(),
        stock: Number(stock),
        active: true,
      };

      await axios.post(
        "http://localhost:3000/products",
        newProduct
      );

      setMessage("Product added successfully!");
      setShowPopup(true);

      // Clear form
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setDescription("");
      setStock("");

      // Refresh products
      fetchProducts();

    } catch (error) {
      console.log("Error adding product:", error);

      setMessage("Failed to add product.");
      setShowPopup(true);
    }
  };

  // ================= CATEGORIES =================

  const categories = [
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // ================= FILTER PRODUCTS =================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white hidden md:flex flex-col">

        <div className="h-20 flex items-center px-6 border-b border-slate-700">

          <h1
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold cursor-pointer"
          >
            STEPORA
          </h1>

        </div>

        <div className="flex-1 px-4 py-6">

          <p className="text-xs uppercase text-slate-400 font-semibold px-3 mb-3">
            Dashboard
          </p>

          <button
            onClick={() => navigate("/admin")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition mb-2"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/products")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white mb-2"
          >
            👟 Products
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            👥 Users
          </button>

        </div>

      </aside>

      {/* ================= MOBILE HEADER ================= */}

      <div className="md:hidden bg-slate-900 text-white px-4 py-4">

        <div className="flex justify-between items-center">

          <h1 className="text-xl font-bold">
            STEPORA ADMIN
          </h1>

          <button
            onClick={() => navigate("/admin")}
            className="text-sm bg-slate-700 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <main className="md:ml-64 min-h-screen">

        <header className="bg-white border-b border-slate-200 px-6 py-5">

          <p className="text-sm text-slate-500">
            Admin Panel
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Products
          </h2>

        </header>

        <section className="max-w-7xl mx-auto px-6 py-8">

          {/* ================= ADD PRODUCT ================= */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">

            <h3 className="text-xl font-bold text-slate-900">
              Add New Product
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Add a new shoe to the store.
            </p>

            <form
              onSubmit={handleAddProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* Product Name */}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter product name"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Price */}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="Enter price"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="Example: Running"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Stock */}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Stock
                </label>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  placeholder="Enter stock"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Image */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Image URL
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                  placeholder="Enter image URL"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

              </div>

              {/* Add Button */}

              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
                >
                  + Add Product
                </button>

              </div>

            </form>

          </div>

          {/* ================= PRODUCT LIST ================= */}

          {loading ? (

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

              <p className="text-slate-500">
                Loading products...
              </p>

            </div>

          ) : (

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

              {/* PRODUCT HEADER */}

              <div className="p-6 border-b border-slate-200">

                <h3 className="text-xl font-bold text-slate-900">
                  Product List
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Total Products: {filteredProducts.length}
                </p>

                {/* CATEGORY FILTER */}

                <div className="mt-4">

                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    View by Category
                  </label>

                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value)
                    }
                    className="border border-slate-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="All">
                      All Categories
                    </option>

                    {categories.map((category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* PRODUCT TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Product
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Price
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Stock
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.length > 0 ? (

                      filteredProducts.map((product) => (

                        <tr
                          key={product.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition"
                        >

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-4">

                              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">

                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain p-2"
                                />

                              </div>

                              <span className="font-semibold text-slate-900">
                                {product.name}
                              </span>

                            </div>

                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {product.category}
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-900">
                            ₹{product.price}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                Number(product.stock) > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >

                              {Number(product.stock) > 0
                                ? `In Stock (${product.stock})`
                                : "Out of Stock"}

                            </span>

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan="4"
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          No products found in this category.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

      </main>

      {/* ================= POPUP ================= */}

      {showPopup && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">

            <p className="text-slate-800 font-medium mb-5">
              {message}
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminProducts;