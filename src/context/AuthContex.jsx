import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { user_id, email, role }
  const [loading, setLoading] = useState(true);

  // On app load, check if a token already exists (page refresh case)
  // and verify it's still valid by calling the backend.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/authorize")
      .then((res) => {
        setUser({
          user_id: res.data.user_id,
          email: res.data.email,
          role: res.data.role,
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const { access_token, role, user_id, email: userEmail } = res.data;

    localStorage.setItem("token", access_token);
    const userData = { user_id, email: userEmail, role };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (name, email, password) => {
    // Backend always forces role="user" here — no way for the frontend
    // to make itself an admin, even if someone tampers with this call.
    await api.post("/register", { name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}