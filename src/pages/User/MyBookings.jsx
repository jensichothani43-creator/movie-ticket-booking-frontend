import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  // ================= FETCH BOOKINGS ================= (unchanged)

  const fetchBookings = async () => {

  try {

    setLoading(true);
    setError("");

    const res = await api.get(
  "/my-bookings",
  {
    headers:{
      Authorization:
      `Bearer ${localStorage.getItem("token")}`
    }
  }
);

console.log("MY BOOKINGS:", res.data);

    setBookings(res.data?.data || res.data || []);

  } catch (err) {

    console.log(err);
    setError("Failed to load bookings ❌");

  } finally {

    setLoading(false);

  }

};

useEffect(() => {
  fetchBookings();
}, []);

  // ================= CANCEL BOOKING ================= (unchanged)
const handleCancel = async (id) => {

  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this ticket?"
  );

  if (!confirmCancel) return;

  try {

   await api.put(
  `/bookings/${id}/cancel`,
  {},
  {
    headers:{
      Authorization:
      `Bearer ${localStorage.getItem("token")}`
    }
  }
);

    alert("Booking Cancelled ❌");

    fetchBookings();

  } catch (err) {

  console.log("Cancel error:", err);

  console.log(
    "Backend message:",
    err.response?.data
  );

  alert(
    err.response?.data?.detail || "Cancel failed"
  );

}


};

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loaderTicket}>🎟️</div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.subtitle}>All your movie tickets, in one place</p>
      </div>

      {
        bookings.length === 0 ? (

          <div style={styles.empty}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎬</div>
            <h2 style={{ margin: 0 }}>No bookings yet</h2>
            <p style={{ color: "#8b93a7" }}>
              Your booked tickets will show up here.
            </p>
          </div>

        ) : (

        <div style={styles.list}>

        
{bookings.map((b) => {
  const status = (b.status || "pending").toLowerCase();

  const isCancelled = status === "cancelled";
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";



            return (
              <div key={b.id} style={styles.ticket}>

                {/* ---- Poster side ---- */}
                <div
                  style={{
                    ...styles.poster,
                    backgroundImage: `url(${b.image || b.movie_image})`,
                  }}
                >
                  <div style={styles.posterShade} />
                </div>

                {/* ---- Perforation ---- */}
                <div style={styles.perforation}>
                  <div style={styles.notchTop} />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} style={styles.dot} />
                  ))}
                  <div style={styles.notchBottom} />
                </div>

                {/* ---- Details side ---- */}
                <div style={styles.details}>

                  <div style={styles.detailsTop}>
                   
                   <span
  style={{
    ...styles.badge,
    background: isCancelled
      ? "#3a1f24"
      : isPending
      ? "#332b16"
      : "#12321f",

    color: isCancelled
      ? "#f87171"
      : isPending
      ? "#facc15"
      : "#4ade80",

    borderColor: isCancelled
      ? "#5c2530"
      : isPending
      ? "#66551d"
      : "#1f4d31",
  }}
>
  {isCancelled
    ? "● Cancelled"
    : isPending
    ? "● Pending"
    : "● Confirmed"}
</span>
                  </div>

                  <h2 style={styles.movieName}>
                    {b.movie_name || b.movie}
                  </h2>

                  <div style={styles.infoRow}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>SEATS</span>
                      <span style={styles.infoValue}>{b.seats}</span>
                    </div>
                    <div style={styles.infoDivider} />
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>AMOUNT</span>
                      <span style={styles.infoValue}>
                        ₹{b.total_amount || 0}
                      </span>
                    </div>
                  </div>

                  <div style={styles.btnGroup}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => navigate("/final-ticket")}
                    >
                      View Ticket
                    </button>

                    <button
                      style={{
                        ...styles.cancelBtn,
                        opacity: isCancelled ? 0.4 : 1,
                        cursor: isCancelled ? "not-allowed" : "pointer",
                      }}
                      disabled={isCancelled}
                      onClick={() => handleCancel(b.id)}
                    >
                      {isCancelled ? "Cancelled" : "Cancel"}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
        )
      }

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    padding: "48px 24px 80px",
    background: "#0b0d12",
    color: "#f4f5f7",
    fontFamily:
      "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "34px",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    color: "#8b93a7",
    marginTop: "6px",
    fontSize: "15px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    maxWidth: "720px",
    margin: "0 auto",
  },

  // ---- ticket stub layout ----
  ticket: {
    display: "flex",
    background: "#14161c",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(0,0,0,.45)",
    border: "1px solid #22252e",
  },

  poster: {
    width: "150px",
    minWidth: "150px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },

  posterShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(0,0,0,0), rgba(20,22,28,0.15))",
  },

  perforation: {
    width: "1px",
    background:
      "repeating-linear-gradient(to bottom, #2c2f39 0 8px, transparent 8px 16px)",
    position: "relative",
  },

  notchTop: {
    position: "absolute",
    top: "-10px",
    left: "-9px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#0b0d12",
  },

  notchBottom: {
    position: "absolute",
    bottom: "-10px",
    left: "-9px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#0b0d12",
  },

  dot: { display: "none" },

  details: {
    flex: 1,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  detailsTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid",
    width: "fit-content",
  },

  bookingId: {
    fontSize: "12px",
    color: "#5f6675",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },

  movieName: {
    fontSize: "22px",
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.2,
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  infoLabel: {
    fontSize: "11px",
    color: "#5f6675",
    letterSpacing: "0.8px",
    fontWeight: 700,
  },

  infoValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#f4f5f7",
  },

  infoDivider: {
    width: "1px",
    height: "28px",
    background: "#262a35",
  },

  btnGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },

  viewBtn: {
    flex: 1,
    padding: "11px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#f84464",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  cancelBtn: {
    flex: 1,
    padding: "11px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #3a3d47",
    background: "transparent",
    color: "#c7cbd4",
    fontWeight: 700,
  },

  empty: {
    textAlign: "center",
    marginTop: "100px",
    color: "#c7cbd4",
  },

  loaderTicket: {
    fontSize: "40px",
    marginBottom: "8px",
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b0d12",
    color: "white",
    fontSize: "18px",
    gap: "6px",
  },
};