import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
   try {
  const response = await api.post("/register", {
    name,
    email,
    password
  });

  // Save registered email for Stripe payment
 localStorage.setItem(
  "user",
  JSON.stringify({
    email: response.data.email || email,
    name: response.data.name || name
  })
);


  setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");

      // 👉 REGISTER SUCCESS → HOME PAGE
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.ticketNotch} aria-hidden="true" />

        <p style={styles.eyebrow}>Create account</p>
        <h1 style={styles.title}>Join the show</h1>
        <p style={styles.subtitle}>
          Register to book tickets, save favourites, and check out faster next time.
        </p>

        <form onSubmit={register} style={styles.form} noValidate>
          <label style={styles.label} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            style={styles.input}
            placeholder="Ramesh Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            style={styles.input}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && (
            <div style={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          {success && (
            <div style={styles.successBox} role="status">
              Account created. You can now sign in.
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#15131A",
    padding: "24px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "380px",
    background: "#1F1B26",
    borderRadius: "16px",
    padding: "40px 32px 32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    border: "1px solid #2E2836",
  },
  ticketNotch: {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#15131A",
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#E8A33D",
    fontWeight: 600,
  },
  title: {
    margin: "8px 0 6px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#F5F2EE",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    margin: "0 0 28px",
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#9A94A3",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#B8B2C0",
    marginTop: "14px",
    marginBottom: "2px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #362F40",
    background: "#141019",
    color: "#F5F2EE",
    fontSize: "14px",
    outline: "none",
  },
  errorBox: {
    marginTop: "16px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "rgba(226, 75, 74, 0.12)",
    border: "1px solid rgba(226, 75, 74, 0.35)",
    color: "#F0999A",
    fontSize: "13px",
  },
  successBox: {
    marginTop: "16px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "rgba(99, 153, 34, 0.12)",
    border: "1px solid rgba(99, 153, 34, 0.35)",
    color: "#97C459",
    fontSize: "13px",
  },
  button: {
    marginTop: "22px",
    padding: "13px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#E8A33D",
    color: "#1F1B26",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
  footerText: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "13px",
    color: "#9A94A3",
  },
  link: {
    color: "#E8A33D",
    textDecoration: "none",
    fontWeight: 600,
  },
};