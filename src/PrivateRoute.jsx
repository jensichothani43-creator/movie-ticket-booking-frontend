import { Navigate } from "react-router-dom";
// Same pattern as AdminRoute.jsx, but only checks login state (no role check).
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }
  try {
    JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace />;
  }
  return children;
}
