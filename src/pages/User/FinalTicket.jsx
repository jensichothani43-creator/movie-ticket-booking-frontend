import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function FinalTicket() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyBooking();
  }, []);

  const verifyBooking = async () => {
    try {
      setLoading(true);
      setError("");

      // localStorage is ONLY used to find booking ID
    const storedData = localStorage.getItem("ticketData");

console.log("ticketData:", storedData);

if (!storedData) {
  setError("No booking information found. Booking ID is missing.");
  return;
}

const ticketData = JSON.parse(storedData);

console.log("ticketData parsed:", ticketData);
      const bookingId =
        ticketData.bookingId ||
        ticketData.booking_id ||
        ticketData.id;

      if (!bookingId) {
        setError("Booking ID not found.");
        return;
      }

      
      const response = await api.get(`/bookings/${bookingId}`);
      const serverBooking = response.data;
      console.log("BOOKING FROM BACKEND:", serverBooking);

      // IMPORTANT:
      // Never trust localStorage status.
      const status = String(serverBooking.status || "").toLowerCase();

      if (status !== "confirmed" && status !== "paid") {
        setError(
          "Payment has not been confirmed yet. Ticket is not available."
        );
        return;
      }

      // Only verified server booking is stored
      setBooking(serverBooking);

    } catch (err) {
      console.error("Booking verification error:", err);

      if (err.response?.status === 401) {
        setError("Please login again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to view this booking.");
      } else if (err.response?.status === 404) {
        setError("Booking not found.");
      } else {
        setError("Unable to verify booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={styles.noTicket}>
        <h2>⏳ Verifying Payment...</h2>
        <p>Please wait while we confirm your booking.</p>
      </div>
    );
  }

  // Error / unpaid / unauthorized
  if (error) {
    return (
      <div style={styles.noTicket}>
        <h2>❌ Ticket Not Available</h2>

        <p>{error}</p>

        <button
          style={styles.homeBtn}
          onClick={verifyBooking}
        >
          Retry
        </button>

        <button
          style={styles.homeBtn}
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  // Server data
  const bookingId = booking.id;
  const total = booking.total_amount;

  const screen =
    booking.screen_name ||
    booking.screen ||
    "Screen";

const date = booking.show_date;
const time = booking.show_time;

  const seats = booking.seats;

  const movieName =
    booking.movie_name ||
    booking.movie?.name ||
    "Movie";

  const posterImage =
    booking.image ||
    booking.movie_image ||
    booking.movieImage ||
    booking.movie?.image ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba";

  const handleDownload = () => {
    const ticket = {
      bookingId,
      movie: movieName,
      screen,
      date,
      time,
      seats,
      total,
      status: booking.status,
    };

    const blob = new Blob(
      [JSON.stringify(ticket, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${bookingId}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const text = `🎬 Movie Ticket

Movie: ${movieName}

Screen: ${screen}

Date: ${date}

Time: ${time}

Seats: ${seats}

Amount: ₹${total}

Booking ID: ${bookingId}

Status: ${booking.status}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Movie Ticket",
          text,
        });

        return;
      } catch (err) {
        console.log("Share cancelled");
      }
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `linear-gradient(
          rgba(0,0,0,.80),
          rgba(0,0,0,.95)
        ), url(${posterImage})`,
      }}
    >
      <div style={styles.card}>

        <h1 style={styles.title}>
          <span style={styles.icon}>✓</span>
          Booking Confirmed
        </h1>

        <p style={styles.subtitle}>
          Payment verified successfully
        </p>

        <div style={styles.ticketBox}>

          <h2 style={styles.movie}>
            {movieName}
          </h2>

          <div style={styles.row}>
            <strong>Booking ID</strong>
            <span>{bookingId}</span>
          </div>

          <div style={styles.row}>
            <strong>Screen</strong>
            <span>{screen?.name || screen}</span>
          </div>

          <div style={styles.row}>
            <strong>Date</strong>
            <span>{date}</span>
          </div>

          <div style={styles.row}>
            <strong>Time</strong>
            <span>{time}</span>
          </div>

          <div style={styles.row}>
            <strong>Seats</strong>
            <span>{seats}</span>
          </div>

          <div style={styles.row}>
            <strong>Amount</strong>
            <span>₹{total}</span>
          </div>

          <div style={styles.row}>
            <strong>Status</strong>
            <span>{booking.status}</span>
          </div>

        </div>

        <div style={styles.actions}>

          <button
            style={styles.download}
            onClick={handleDownload}
          >
            ⬇ Download
          </button>

          <button
            style={styles.share}
            onClick={handleShare}
          >
            🔗 Share
          </button>

          <button
            style={styles.myBooking}
            onClick={() => navigate("/my-bookings")}
          >
            📖 My Bookings
          </button>

          <button
            style={styles.home}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </button>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "30px",
    borderRadius: "25px",
    background: "rgba(15,23,42,.88)",
    backdropFilter: "blur(15px)",
    color: "white",
    boxShadow: "0 20px 50px rgba(0,0,0,.8)",
  },

  title: {
    textAlign: "center",
    fontSize: "32px",
  },

  icon: {
    color: "#22c55e",
    marginRight: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#cbd5e1",
  },

  ticketBox: {
    marginTop: "25px",
    background: "rgba(255,255,255,.08)",
    padding: "20px",
    borderRadius: "15px",
  },

  movie: {
    textAlign: "center",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,.15)",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "25px",
  },

  download: {
    padding: "13px",
    background: "#2563eb",
    color: "white",
    border: 0,
    borderRadius: "10px",
    cursor: "pointer",
  },

  share: {
    padding: "13px",
    background: "#16a34a",
    color: "white",
    border: 0,
    borderRadius: "10px",
    cursor: "pointer",
  },

  myBooking: {
    padding: "13px",
    background: "#7c3aed",
    color: "white",
    border: 0,
    borderRadius: "10px",
    cursor: "pointer",
  },

  home: {
    padding: "13px",
    background: "transparent",
    color: "white",
    border: "1px solid #64748b",
    borderRadius: "10px",
    cursor: "pointer",
  },

  noTicket: {
    height: "100vh",
    background: "#020617",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "15px",
  },

  homeBtn: {
    padding: "12px 30px",
    background: "#2563eb",
    color: "white",
    border: 0,
    borderRadius: "10px",
    cursor: "pointer",
  },
};