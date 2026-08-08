import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import QRCode from "react-qr-code";

export default function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKING =================
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/book/${id}`);

        // SAFE CHECK (important fix)
        setBooking(res.data || null);
      } catch (err) {
        console.log("API Error:", err);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div style={styles.loading}>
        🎟️ Loading Ticket...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!booking) {
    return (
      <div style={styles.loading}>
        ❌ Booking Not Found
      </div>
    );
  }

  // ================= UI =================
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>🎬 Movie Ticket</h1>
        <p style={styles.subtitle}>Booking Confirmed ✅</p>

        <div style={styles.divider}></div>

        <div style={styles.row}>
          <span>🎫 Booking ID</span>
          <b>#{id}</b>
        </div>

        <div style={styles.row}>
          <span>🎬 Movie</span>
          <b>{booking.movie_name || "N/A"}</b>
        </div>

        <div style={styles.row}>
          <span>💺 Seats</span>
          <b>{booking.seats || "N/A"}</b>
        </div>

        <div style={styles.row}>
          <span>Show Time</span>
          <b>{booking.show_time || "N/A"}</b>
        </div>

        <div style={styles.row}>
          <span>Screen</span>
          <b>{booking.screen_name || "N/A"}</b>
        </div>

        <div style={styles.row}>
          <span>Name</span>
          <b>{booking.customer_name || booking.name || "Guest"}</b>
        </div>

        <div style={styles.row}>
          <span>💰 Amount</span>
          <b>₹{booking.total_amount || 0}</b>
        </div>

        {/* QR CODE */}
        <div style={styles.qrBox}>
          <QRCode value={`BOOKING-${id}`} />
        </div>

        <p style={styles.note}>
          Show this QR at cinema entry 🎟️
        </p>

        <button
          style={styles.finalBtn}
          onClick={() => navigate("/final-ticket")}
        >
          🎟️ Open Final Ticket
        </button>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/my-bookings")}
        >
          ⬅ Back to Bookings
        </button>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Arial",
    color: "white",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "25px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  },

  title: { margin: 0, fontSize: "24px" },

  subtitle: {
    color: "#22c55e",
    marginBottom: "15px",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.2)",
    margin: "15px 0",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
    fontSize: "15px",
  },

  qrBox: {
    marginTop: "20px",
    background: "white",
    padding: "12px",
    borderRadius: "12px",
    display: "inline-block",
  },

  note: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#cbd5e1",
  },

  finalBtn: {
    marginTop: "15px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#22c55e",
    color: "white",
  },

  backBtn: {
    marginTop: "10px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#334155",
    color: "white",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },
};