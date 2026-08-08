import { Navigate } from "react-router-dom";

// Same pattern as your existing PrivateRoute (children-based).
// Checks: 1) user is logged in, 2) role stored at login is "admin".
// Assumes login flow does: localStorage.setItem("user", JSON.stringify({ role, user_id, email }))
// as in the AuthContext I gave earlier. Adjust the key names below if your
// login code stores it differently.
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // Logged in, but not an admin -> send to home, not login
    return <Navigate to="/home" replace />;
  }

  return children;
}