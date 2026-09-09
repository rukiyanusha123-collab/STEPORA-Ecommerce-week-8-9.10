import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white hidden md:flex flex-col">

        <div className="h-20 flex items-center px-6 border-b border-slate-700">
          <h1
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold tracking-wide cursor-pointer"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white mb-2"
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/products")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition mb-2"
          >
            <span>👟</span>
            Products
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span>👥</span>
            Users
          </button>

        </div>

        {/* ADMIN INFO + LOGOUT */}
        <div className="p-4 border-t border-slate-700">

          <div className="mb-4">

            <p className="text-sm font-semibold">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition font-medium"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-4 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          STEPORA ADMIN
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <main className="md:ml-64 min-h-screen">

        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 py-5">

          <div className="max-w-7xl mx-auto">

            <p className="text-sm text-slate-500">
              Admin Panel
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Dashboard
            </h2>

          </div>

        </header>

        {/* CONTENT */}
        <section className="max-w-7xl mx-auto px-6 py-8">

          <div className="mb-8">

            <h3 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.name || "Admin"} 👋
            </h3>

            <p className="text-slate-500 mt-2">
              Manage your STEPORA store from the admin panel.
            </p>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRODUCTS */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 hover:shadow-md transition">

              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-2xl mb-5">
                👟
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Products
              </h3>

              <p className="text-slate-500 mb-6">
                View and manage all products available in STEPORA.
              </p>

              <button
                onClick={() => navigate("/admin/products")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition"
              >
                Manage Products
              </button>

            </div>

            {/* USERS */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 hover:shadow-md transition">

              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-2xl mb-5">
                👥
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Users
              </h3>

              <p className="text-slate-500 mb-6">
                View all registered STEPORA users and their roles.
              </p>

              <button
                onClick={() => navigate("/admin/users")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition"
              >
                Manage Users
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;