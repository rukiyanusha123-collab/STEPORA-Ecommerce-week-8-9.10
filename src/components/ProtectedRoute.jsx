import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const userData = localStorage.getItem("user");

  // Login cheythittillenkil
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;