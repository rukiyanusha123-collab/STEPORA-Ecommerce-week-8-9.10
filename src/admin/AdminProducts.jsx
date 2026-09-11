import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= CATEGORY FILTER =================

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // ================= ADD PRODUCT =================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  // ================= EDIT PRODUCT =================

  const [editingProduct, setEditingProduct] =
    useState(null);

  // ================= POPUP =================

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
      console.log(
        "Error fetching products:",
        error
      );
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

    if (
      !name ||
      !price ||
      !category ||
      !image ||
      !description ||
      !stock
    ) {
      setMessage(
        "Please fill all product details."
      );
      setShowPopup(true);
      return;
    }

    // Duplicate check

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

      setMessage(
        "Product added successfully!"
      );
      setShowPopup(true);

      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setDescription("");
      setStock("");

      fetchProducts();
    } catch (error) {
      console.log(
        "Error adding product:",
        error
      );

      setMessage("Failed to add product.");
      setShowPopup(true);
    }
  };

  // ================= EDIT PRODUCT =================

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
    });
  };

  // ================= UPDATE PRODUCT =================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (
      !editingProduct.name ||
      !editingProduct.price ||
      !editingProduct.category ||
      !editingProduct.image ||
      !editingProduct.description ||
      editingProduct.stock === ""
    ) {
      setMessage(
        "Please fill all product details."
      );
      setShowPopup(true);
      return;
    }

    // Duplicate name check

    const duplicateProduct = products.find(
      (product) =>
        product.id !== editingProduct.id &&
        product.name.trim().toLowerCase() ===
          editingProduct.name
            .trim()
            .toLowerCase()
    );

    if (duplicateProduct) {
      setMessage(
        "Another product with this name already exists."
      );
      setShowPopup(true);
      return;
    }

    try {
      const updatedProduct = {
        name: editingProduct.name.trim(),
        price: Number(editingProduct.price),
        category:
          editingProduct.category.trim(),
        image: editingProduct.image.trim(),
        description:
          editingProduct.description.trim(),
        stock: Number(editingProduct.stock),
        active:
          editingProduct.active !== false,
      };

      await axios.patch(
        `http://localhost:3000/products/${editingProduct.id}`,
        updatedProduct
      );

      setMessage(
        "Product updated successfully!"
      );
      setShowPopup(true);

      setEditingProduct(null);

      fetchProducts();
    } catch (error) {
      console.log(
        "Error updating product:",
        error
      );

      setMessage(
        "Failed to update product."
      );
      setShowPopup(true);
    }
  };

  // ================= SOFT DELETE =================

  const handleSoftDelete = async (product) => {
    try {
      await axios.patch(
        `http://localhost:3000/products/${product.id}`,
        {
          active: false,
        }
      );

      setMessage(
        "Product moved to inactive."
      );
      setShowPopup(true);

      fetchProducts();
    } catch (error) {
      console.log(
        "Error deleting product:",
        error
      );

      setMessage(
        "Failed to deactivate product."
      );
      setShowPopup(true);
    }
  };

  // ================= CATEGORIES =================

  const categories = [
    ...new Set(
      products.map(
        (product) => product.category
      )
    ),
  ];

  // ================= FILTER PRODUCTS =================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            selectedCategory
        );

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("cartItems");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            STEPORA
          </h1>

          <p className="text-sm text-slate-400">
            Admin Product Management
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <div className="p-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-800">
            Products
          </h2>

          <p className="text-slate-500 mt-1">
            Add, update and manage products
          </p>

        </div>

        {/* ================= ADD PRODUCT ================= */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

          <h3 className="text-xl font-bold text-slate-800 mb-5">
            Add New Product
          </h3>

          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
            />

            <button
              type="submit"
              className="md:col-span-2 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
            >
              Add Product
            </button>

          </form>
        </div>

        {/* ================= EDIT PRODUCT ================= */}

        {editingProduct && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-2 border-slate-300">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Edit Product
                </h3>

                <p className="text-sm text-slate-500">
                  Update product details
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingProduct(null)
                }
                className="text-slate-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleUpdateProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <input
                type="text"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <input
                type="number"
                placeholder="Price"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <input
                type="text"
                placeholder="Category"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={editingProduct.image}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <input
                type="number"
                placeholder="Stock"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <input
                type="text"
                placeholder="Description"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description:
                      e.target.value,
                  })
                }
                className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />

              <button
                type="submit"
                className="md:col-span-2 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
              >
                Update Product
              </button>

            </form>
          </div>
        )}

        {/* ================= CATEGORY FILTER ================= */}

        <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Filter Products
              </h3>

              <p className="text-sm text-slate-500">
                View products by category
              </p>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none"
            >

              <option value="All">
                All Categories
              </option>

              {categories.map(
                (categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                )
              )}

            </select>

          </div>
        </div>

        {/* ================= PRODUCT LIST ================= */}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h3 className="text-xl font-bold text-slate-800">
              Product List
            </h3>

            <p className="text-sm text-slate-500">
              {filteredProducts.length} products
            </p>

          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100">

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

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >

                        {/* PRODUCT */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />

                            <div>

                              <p className="font-semibold text-slate-800">
                                {product.name}
                              </p>

                              <p className="text-sm text-slate-500">
                                ID: {product.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-4 text-slate-600">
                          {product.category}
                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-4 font-semibold text-slate-800">
                          ₹{product.price}
                        </td>

                        {/* STOCK */}

                        <td className="px-6 py-4 text-slate-600">
                          {product.stock}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {product.active === false ? (
                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                              Inactive
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                              Active
                            </span>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                            >
                              Edit
                            </button>

                            {product.active !==
                              false && (
                              <button
                                onClick={() =>
                                  handleSoftDelete(
                                    product
                                  )
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                              >
                                Delete
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      {/* ================= POPUP ================= */}


      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-sm text-center">

            <h3 className="text-xl font-bold text-slate-800 mb-3">
              STEPORA
            </h3>

            <p className="text-slate-600 mb-6">
              {message}
            </p>

            <button
              onClick={() =>
                setShowPopup(false)
              }
              className="bg-slate-900 text-white px-8 py-2 rounded-lg hover:bg-slate-800"
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