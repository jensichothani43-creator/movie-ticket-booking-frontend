
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api"; 

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    paddingBottom: "140px",
  },

  wrap: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  header: {
    marginBottom: "25px",
  },

  kicker: {
    fontSize: "14px",
    color: "#777",
  },

  headerTitle: {
    margin: "5px 0 20px",
    fontSize: "32px",
  },

  progressBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  progressStepDone: {
    color: "green",
    fontWeight: "600",
  },

  progressStepActive: {
    color: "#e53935",
    fontWeight: "700",
  },

  progressStep: {
    color: "#999",
  },

  progressLine: {
    flex: 1,
    height: "1px",
    background: "#ddd",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  summaryTop: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  posterThumb: {
    width: "70px",
    height: "95px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  summaryTopInfo: {
    flex: 1,
  },

  movieName: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  metaLine: {
    color: "#666",
    marginBottom: "5px",
  },

  divider: {
    height: "1px",
    background: "#eee",
    margin: "20px 0",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  rowLabel: {
    color: "#666",
  },

  rowValue: {
    color: "#222",
  },

  seatsBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  seatTags: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  seatTag: {
    background: "#f1f3f5",
    padding: "6px 10px",
    borderRadius: "6px",
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "15px",
  },

  couponRow: {
    display: "flex",
    gap: "10px",
  },

  couponSelect: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  applyBtn: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#e53935",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  couponAppliedChip: {
    marginTop: "12px",
    padding: "10px",
    background: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "8px",
  },

  discountValue: {
    color: "#2e7d32",
    fontWeight: "600",
  },

  payableRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    paddingTop: "18px",
  },

  payableLabel: {
    fontSize: "18px",
    fontWeight: "700",
  },

  payableValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#e53935",
  },

  emptyCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  emptyTitle: {
    marginBottom: "10px",
  },

  emptyText: {
    color: "#666",
    marginBottom: "25px",
  },

  payBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    padding: "15px 20px",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  },

  payBarInner: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  payBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#e53935",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
  },

  payBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  secureNote: {
    textAlign: "center",
    fontSize: "13px",
    color: "#777",
  },
};




export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [offers, setOffers] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    bookingId,
    total,
    screen,
    date,
    time,
    seats,
    movie,
  } = location.state || {};

  // ================= FETCH OFFERS =================
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        if (!movie?.id) return;

        const res = await api.get(`/offers/movie/${movie.id}`);

        console.log("MOVIE OFFERS:", res.data);

        const offerData = Array.isArray(res.data)
          ? res.data
          : res.data?.offers || [];

        const activeOffers = offerData.filter(
          (offer) => offer.status?.toLowerCase() === "active"
        );

        setOffers(activeOffers);
      } catch (error) {
        console.error("Offer Fetch Error:", error);
        setOffers([]);
      }
    };

    fetchOffers();
  }, [movie]);

  // ================= AUTO BEST OFFER =================
  useEffect(() => {
    if (!offers.length || !total) return;

    let bestOffer = null;
    let maxDiscount = 0;

    offers.forEach((offer) => {
      let currentDiscount = 0;

      if (offer.discount_type === "flat") {
        currentDiscount = Number(offer.discount_value || 0);
      } else if (
        offer.discount_type === "percent" ||
        offer.discount_type === "percentage"
      ) {
        currentDiscount =
          (Number(total) * Number(offer.discount_value || 0)) / 100;
      }

      // Discount cannot be greater than total
      currentDiscount = Math.min(
        currentDiscount,
        Number(total) || 0
      );

      if (currentDiscount > maxDiscount) {
        maxDiscount = currentDiscount;
        bestOffer = offer;
      }
    });

    if (bestOffer) {
      setCoupon(bestOffer.code || "");
      setDiscount(maxDiscount);
    }
  }, [offers, total]);

  // ================= FINAL AMOUNT =================
  const finalAmount = Math.max(
    (Number(total) || 0) - (Number(discount) || 0),
    0
  );

  // ================= APPLY COUPON =================
  const applyCoupon = () => {
    const code = coupon
      .trim()
      .toUpperCase()
      .replace(/\s/g, "");

    const offer = offers.find(
      (o) =>
        (o.code || o.offerCode || "")
          .toUpperCase()
          .replace(/\s/g, "") === code
    );

    if (!offer || offer.status?.toLowerCase() !== "active") {
      setDiscount(0);
      alert("Coupon expired or invalid");
      return;
    }

    const value = Number(offer.discount_value || 0);
    const type = offer.discount_type?.toLowerCase();

    let calculatedDiscount = 0;

    if (type === "flat") {
      calculatedDiscount = value;
    } else if (
      type === "percent" ||
      type === "percentage"
    ) {
      calculatedDiscount =
        (Number(total) * value) / 100;
    }

    calculatedDiscount = Math.min(
      calculatedDiscount,
      Number(total) || 0
    );

    setDiscount(calculatedDiscount);
  };

  // ================= PAYMENT =================
  const payNow = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const email = localStorage.getItem("email");

      console.log("LOGIN EMAIL:", email);
      console.log("BOOKING ID:", bookingId);
      console.log("TOTAL:", total);
      console.log("FINAL AMOUNT:", finalAmount);
      console.log("COUPON:", coupon);

      if (!email) {
        alert("User email not found. Please login again.");
        setLoading(false);
        return;
      }

      if (!bookingId) {
        alert("Booking information is missing.");
        setLoading(false);
        return;
      }

      if (finalAmount <= 0) {
        alert("Invalid payment amount.");
        setLoading(false);
        return;
      }

      // Stripe checkout session
      const response = await api.post(
        "/create-checkout-session",
        {
          booking_id: bookingId,
          amount: finalAmount,
          email: email,
          coupon: coupon || null,
          discount: discount || 0,
        }
      );

      console.log("STRIPE RESPONSE:", response.data);

      // Backend should return Stripe checkout URL
      const checkoutUrl =
        response.data?.url ||
        response.data?.checkout_url;

      if (!checkoutUrl) {
        console.error(
          "Stripe checkout URL missing:",
          response.data
        );

        alert("Unable to start Stripe payment.");
        setLoading(false);
        return;
      }
    
     localStorage.setItem(
        "ticketData",
        JSON.stringify({ bookingId: bookingId })
      );
      console.log("BOOKING ID SAVED:", bookingId);

      // Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Payment could not be started.";

      alert(message);
      setLoading(false);
    }
  };

  console.log("OFFERS FROM BACKEND:", offers);
  console.log("PAYMENT MOVIE:", movie);

  // ================= NO BOOKING =================
  if (!bookingId) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>⚠️</div>

          <h2 style={styles.emptyTitle}>
            No Booking Data Found
          </h2>

          <p style={styles.emptyText}>
            Please go back and select seats again.
          </p>

          <button
            onClick={() => navigate(-1)}
            style={styles.applyBtn}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ================= SORT SEATS =================
  const sortedSeats = [...(seats || [])].sort((a, b) => {
    const rowA = a.charCodeAt(0);
    const rowB = b.charCodeAt(0);

    if (rowA !== rowB) {
      return rowA - rowB;
    }

    return Number(a.slice(1)) - Number(b.slice(1));
  });

  // ================= UI =================
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>

        {/* HEADER */}
        <div style={styles.header}>
          <span style={styles.kicker}>
            Checkout
          </span>

          <h1 style={styles.headerTitle}>
            Confirm &amp; Pay
          </h1>

          <div style={styles.progressBar}>
            <div style={styles.progressStepDone}>
              ✓ Seats
            </div>

            <div style={styles.progressLine} />

            <div style={styles.progressStepActive}>
              Payment
            </div>

            <div style={styles.progressLine} />

            <div style={styles.progressStep}>
              Ticket
            </div>
          </div>
        </div>

        {/* BOOKING SUMMARY */}
        <div style={styles.card}>
          <div style={styles.summaryTop}>

            {movie?.image && (
              <img
                src={movie.image}
                alt={movie?.name || "Movie"}
                style={styles.posterThumb}
              />
            )}

            <div style={styles.summaryTopInfo}>
              <h2 style={styles.movieName}>
                {movie?.name || "Movie"}
              </h2>

              <div style={styles.metaLine}>
                {screen?.location || "PVR Cinemas"}
              </div>

              <div style={styles.metaLine}>
                {date} &nbsp;·&nbsp; {time}
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.rowLabel}>
              Booking ID
            </span>

            <b style={styles.rowValue}>
              #{bookingId}
            </b>
          </div>

          <div style={styles.seatsBox}>
            <span style={styles.rowLabel}>
              Seats ({sortedSeats.length})
            </span>

            <div style={styles.seatTags}>
              {sortedSeats.map((seat, index) => (
                <span
                  key={index}
                  style={styles.seatTag}
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COUPON */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>
            🎁 Apply Offer Code
          </h3>

          <div style={styles.couponRow}>
            <select
              value={coupon}
              onChange={(e) =>
                setCoupon(e.target.value)
              }
              style={styles.couponSelect}
            >
              <option value="">
                Select Offer
              </option>

              {offers.map((offer) => (
                <option
                  key={offer.id}
                  value={offer.code}
                >
                  {offer.code} -{" "}
                  {offer.discount_type === "percent" ||
                  offer.discount_type === "percentage"
                    ? `${offer.discount_value}% OFF`
                    : `₹${offer.discount_value} OFF`}
                </option>
              ))}
            </select>

            <button
              onClick={applyCoupon}
              style={styles.applyBtn}
            >
              Apply
            </button>
          </div>

          {discount > 0 && (
            <div style={styles.couponAppliedChip}>
              ✓ "{coupon}" applied — you saved ₹
              {discount.toFixed(0)}
            </div>
          )}
        </div>

        {/* PRICE DETAILS */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>
            Price Details
          </h3>

          <div style={styles.row}>
            <span style={styles.rowLabel}>
              Sub Total ({sortedSeats.length}{" "}
              {sortedSeats.length === 1
                ? "ticket"
                : "tickets"})
            </span>

            <span style={styles.rowValue}>
              ₹{Number(total) || 0}
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.rowLabel}>
              Offer Discount
            </span>

            <span style={styles.discountValue}>
              {discount > 0
                ? `-₹${discount.toFixed(0)}`
                : "₹0"}
            </span>
          </div>

          <div style={styles.payableRow}>
            <span style={styles.payableLabel}>
              Amount Payable
            </span>

            <span style={styles.payableValue}>
              ₹{finalAmount}
            </span>
          </div>
        </div>

        <div style={{ height: "90px" }} />
      </div>

      {/* STICKY PAY BAR */}
      <div style={styles.payBar}>
        <div style={styles.payBarInner}>
          <button
            style={{
              ...styles.payBtn,
              ...(loading
                ? styles.payBtnDisabled
                : {}),
            }}
            onClick={payNow}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Proceed to Pay ₹${finalAmount}`}
          </button>
        </div>

        <p style={styles.secureNote}>
          🔒 100% Secure Payments powered by Stripe
        </p>
      </div>
    </div>
  );
}
