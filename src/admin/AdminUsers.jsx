import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected user for viewing details
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // View individual user
  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  // Close user details
  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  // Block / Unblock user
  const handleBlockToggle = async (user) => {
    try {
      await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        {
          blocked: !user.blocked,
        }
      );

      fetchUsers();

      // Update selected user if popup is open
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({
          ...selectedUser,
          blocked: !user.blocked,
        });
      }
    } catch (error) {
      console.log(
        "Error updating user block status:",
        error
      );
    }
  };

  // Soft delete user
  const handleSoftDelete = async (user) => {
    try {
      await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        {
          active: false,
        }
      );

      fetchUsers();

      // Update selected user if popup is open
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({
          ...selectedUser,
          active: false,
        });
      }
    } catch (error) {
      console.log(
        "Error deactivating user:",
        error
      );
    }
  };

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

              {/* ================= TABLE HEADER ================= */}

              <div className="p-6 border-b border-slate-200">

                <h3 className="text-xl font-bold text-slate-900">
                  Registered Users
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Total Users: {users.length}
                </p>

              </div>

              {/* ================= TABLE ================= */}

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

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user.id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        {/* NAME */}

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {user.name}
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4 text-slate-600">
                          {user.email}
                        </td>

                        {/* ROLE */}

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

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <div className="flex flex-col gap-1">

                            {/* Active / Inactive */}

                            <span
                              className={`w-fit px-3 py-1 rounded-full text-sm font-semibold ${
                                user.active === false
                                  ? "bg-slate-200 text-slate-600"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {user.active === false
                                ? "Inactive"
                                : "Active"}
                            </span>

                            {/* Blocked */}

                            {user.blocked && (

                              <span className="w-fit px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                                Blocked
                              </span>

                            )}

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex gap-2 flex-wrap">

                            {/* VIEW */}

                            <button
                              onClick={() =>
                                handleViewUser(user)
                              }
                              className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-700 transition"
                            >
                              View
                            </button>

                            {/* BLOCK / UNBLOCK */}

                            <button
                              onClick={() =>
                                handleBlockToggle(user)
                              }
                              className={`px-3 py-1.5 text-sm rounded-md transition ${
                                user.blocked
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {user.blocked
                                ? "Unblock"
                                : "Block"}
                            </button>

                            {/* SOFT DELETE */}

                            {user.active !== false && (

                              <button
                                onClick={() =>
                                  handleSoftDelete(user)
                                }
                                className="px-3 py-1.5 text-sm rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                              >
                                Delete
                              </button>

                            )}

                          </div>

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

      {/* ================= USER DETAILS MODAL ================= */}

      {selectedUser && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-xl font-bold text-slate-900">
                User Details
              </h3>

              <button
                onClick={handleCloseDetails}
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ✕
              </button>

            </div>

            {/* USER DETAILS */}

            <div className="space-y-4">

              <div>
                <p className="text-sm text-slate-500">
                  User ID
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedUser.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedUser.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>

                <p className="font-semibold text-slate-900">
                  {selectedUser.role || "user"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Account Status
                </p>

                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedUser.active === false
                      ? "bg-slate-200 text-slate-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedUser.active === false
                    ? "Inactive"
                    : "Active"}
                </span>
              </div>

              {selectedUser.blocked && (

                <div>
                  <p className="text-sm text-slate-500">
                    Block Status
                  </p>

                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    Blocked
                  </span>
                </div>

              )}

            </div>

            {/* BLOCK / UNBLOCK */}

            <button
              onClick={() =>
                handleBlockToggle(selectedUser)
              }
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                selectedUser.blocked
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {selectedUser.blocked
                ? "Unblock User"
                : "Block User"}
            </button>

            {/* SOFT DELETE */}

            {selectedUser.active !== false && (

              <button
                onClick={() => {
                  handleSoftDelete(selectedUser);
                }}
                className="w-full mt-3 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
              >
                Mark Inactive
              </button>

            )}

            {/* CLOSE */}

            <button
              onClick={handleCloseDetails}
              className="w-full mt-3 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;