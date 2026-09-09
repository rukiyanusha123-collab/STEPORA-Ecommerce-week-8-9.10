import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users"
        );

        setUsers(response.data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition mb-2"
          >
            👟 Products
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
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
            Users
          </h2>

        </header>

        <section className="max-w-7xl mx-auto px-6 py-8">

          {loading ? (

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

              <p className="text-slate-500">
                Loading users...
              </p>

            </div>

          ) : (

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

              <div className="p-6 border-b border-slate-200">

                <h3 className="text-xl font-bold text-slate-900">
                  Registered Users
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Total Users: {users.length}
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Name
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Role
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user.id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {user.name}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role || "user"}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminUsers;