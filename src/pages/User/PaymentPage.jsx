import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";


//const stripePromise = loadStripe(
//"pk_test_51Tu8B0HsVVPXynTItBmrH4pm5GmoSWlPp7DYVNHO3qaF7ll8veJouoLB0uMkLnmSI89AwKDNVLKTe7Rc6p1k0tDm00dAShrIQ8"
//);

export default function PaymentPage() {

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

const {
 bookingId,
 total,
 screen,
 date,
 time,
 seats,
 movie
} = location.state || {};
  // FIX: offers define
  const [offers, setOffers] = useState([]);
  useEffect(() => {

  const fetchOffers = async () => {

    try {

      if (!movie?.id) return;


      const res = await api.get(
        `/offers/movie/${movie.id}`
      );


      console.log(
        "MOVIE OFFERS:",
        res.data
      );


      const activeOffers = res.data.filter(
  (offer) => offer.status?.toLowerCase() === "active"
);

setOffers(activeOffers);


    } catch(error) {

      console.log(
        "Offer Fetch Error:",
        error
      );

    }

  };


  fetchOffers();


}, [movie]);


  console.log(
    "OFFERS FROM BACKEND:",
    offers
  );

console.log("PAYMENT MOVIE:", movie);

const payNow = async () => {

  try {

    setLoading(true);

    const email = localStorage.getItem("email");

    console.log("LOGIN EMAIL:", email);

    if (!email) {
      alert("User email not found. Please login again.");
      return;
    }


    const response = await api.post(
      "/create-checkout-session",
      {
        booking_id: bookingId,
        amount: finalAmount,
        name: movie?.name || "Movie Ticket",
        email: email
      }
    );


    console.log(
      "STRIPE RESPONSE:",
      response.data
    );


    const ticketData = {

      bookingId,
      total,
      discount,
      finalAmount,
      screen,
      date,
      time,
      seats,

      movie_name: movie?.name || "Movie",

      image: movie?.image || ""

    };


    localStorage.setItem(
      "ticketData",
      JSON.stringify(ticketData)
    );


    // Stripe Checkout open
    window.location.href = response.data.url;


  } catch(error) {

    console.log(
      "PAYMENT ERROR:",
      error.response?.data || error.message
    );

    navigate("/payment-failed");

  } finally {

    setLoading(false);

  }

};
  
  // ================= AUTO BEST OFFER =================
  useEffect(() => {
  if (!offers.length || !total) return;

  let bestOffer = null;
  let maxDiscount = 0;

  offers.forEach((o) => {
    let d = 0;

    if (o.discount_type === "flat") {
      d = Number(o.discount_value || 0);
    } else if (
      o.discount_type === "percent" ||
      o.discount_type === "percentage"
    ) {
      d = (Number(total) * Number(o.discount_value || 0)) / 100;
    }

    if (d > maxDiscount) {
      maxDiscount = d;
      bestOffer = o;
    }
  });

  if (bestOffer) {
    setCoupon(bestOffer.code);
    setDiscount(maxDiscount);
  }
}, [offers, total]);

  // ================= FINAL AMOUNT =================
  const finalAmount = Math.max((Number(total) || 0) - (discount || 0), 0);

  // ================= APPLY COUPON =================
 const applyCoupon = () => {
  const code = coupon.trim().toUpperCase().replace(/\s/g, "");

  const offer = offers.find((o) =>
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
const type = offer.discount_type;

if (type === "flat") {
  setDiscount(value);
} else if (type === "percent" || type === "percentage") {
  setDiscount((Number(total) * value) / 100);
}
};
  // ================= PAYMENT =================


  if (!bookingId) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <span style={styles.emptyIcon}>⚠️</span>
          <h2 style={styles.emptyTitle}>No Booking Data Found</h2>
          <p style={styles.emptyText}>Please go back and select seats again.</p>
        </div>
      </div>
    );
  }

  const sortedSeats = [...(seats || [])].sort((a, b) => {
    const rowA = a.charCodeAt(0);
    const rowB = b.charCodeAt(0);
    if (rowA !== rowB) return rowA - rowB;
    return Number(a.slice(1)) - Number(b.slice(1));
  });

  return (
    <div style={styles.page}>

      <div style={styles.wrap}>

        <div style={styles.header}>
          <span style={styles.kicker}>Checkout</span>
          <h1 style={styles.headerTitle}>Confirm &amp; Pay</h1>
          <div style={styles.progressBar}>
            <div style={styles.progressStepDone}>✓ Seats</div>
            <div style={styles.progressLine} />
            <div style={styles.progressStepActive}>Payment</div>
            <div style={styles.progressLine} />
            <div style={styles.progressStep}>Ticket</div>
          </div>
        </div>

        {/* BOOKING SUMMARY — poster strip like BookMyShow */}
        <div style={styles.card}>

          <div style={styles.summaryTop}>

            {movie?.image && (
              <img
                src={movie.image}
                alt={movie?.name}
                style={styles.posterThumb}
              />
            )}

            <div style={styles.summaryTopInfo}>
              <h2 style={styles.movieName}>{movie?.name}</h2>
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
            <span style={styles.rowLabel}>Booking ID</span>
            <b style={styles.rowValue}>#{bookingId}</b>
          </div>

          <div style={styles.seatsBox}>
            <span style={styles.rowLabel}>Seats ({sortedSeats.length})</span>
            <div style={styles.seatTags}>
              {sortedSeats.map((seat, index) => (
                <span key={index} style={styles.seatTag}>
                  {seat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COUPON */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🎁 Apply Offer Code</h3>

          <div style={styles.couponRow}>

            <select
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={styles.couponSelect}
            >
              <option value="">Select Offer</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.code}>
                  {offer.code} -{" "}
                  {offer.discount_type === "percent" ||
                  offer.discount_type === "percentage"
                    ? `${offer.discount_value}% OFF`
                    : `₹${offer.discount_value} OFF`}
                </option>
              ))}
            </select>

            <button onClick={applyCoupon} style={styles.applyBtn}>
              Apply
            </button>
          </div>

          {discount > 0 && (
            <div style={styles.couponAppliedChip}>
              ✓ "{coupon}" applied — you saved ₹{discount.toFixed(0)}
            </div>
          )}
        </div>

        {/* PRICE BREAKDOWN */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Price Details</h3>

          <div style={styles.row}>
            <span style={styles.rowLabel}>
              Sub Total ({sortedSeats.length} {sortedSeats.length === 1 ? "ticket" : "tickets"})
            </span>
            <span style={styles.rowValue}>₹{total}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.rowLabel}>Offer Discount</span>
            <span style={styles.discountValue}>
              {discount > 0 ? `-₹${discount.toFixed(0)}` : "₹0"}
            </span>
          </div>

          <div style={styles.payableRow}>
            <span style={styles.payableLabel}>Amount Payable</span>
            <span style={styles.payableValue}>₹{finalAmount}</span>
          </div>
        </div>

        {/* spacer so sticky bar doesn't cover content */}
        <div style={{ height: "90px" }} />

      </div>

      {/* STICKY PAY BAR */}
      <div style={styles.payBar}>
        <div style={styles.payBarInner}>

         
          <button
            style={{
              ...styles.payBtn,
              ...(loading ? styles.payBtnDisabled : {}),
            }}
            onClick={payNow}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>

        </div>
        <p style={styles.secureNote}>🔒 100% Secure Payments powered by Stripe</p>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% 0%, #0a241f 0%, #071815 55%, #020a08 100%)",
    color: "#f1f0f3",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  wrap: {
    padding: "48px 20px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
  },

  header: {
    textAlign: "center",
    marginBottom: "6px",
    width: "100%",
    maxWidth: "420px",
  },

  kicker: {
    display: "inline-block",
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#2dd4bf",
    fontWeight: 700,
    marginBottom: "8px",
  },

  headerTitle: {
    fontSize: "28px",
    fontWeight: 800,
    margin: 0,
    color: "#fff",
  },

  progressBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "18px",
  },

  progressStepDone: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#f5b942",
    padding: "4px 10px",
    borderRadius: "20px",
   // border: "1px solid #f5b942",
  },

  progressStepActive: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#071815",
    background: "#f5b942",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  progressStep: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#8a7a80",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid #3a2530",
  },

  progressLine: {
    width: "18px",
    height: "1px",
    background: "#3a2530",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#0e1f1c",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #1e3330",
    boxShadow: "0 15px 35px rgba(0,0,0,.45)",
  },

  summaryTop: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  posterThumb: {
    width: "72px",
    height: "96px",
    objectFit: "cover",
    borderRadius: "10px",
    flexShrink: 0,
  },

  summaryTopInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingTop: "2px",
  },

  metaLine: {
    fontSize: "13px",
    color: "#7fa89f",
  },

  movieName: {
    margin: "0 0 2px",
    fontSize: "19px",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.2,
  },

  divider: {
    height: "1px",
    background: "#1e3330",
    margin: "14px 0",
  },

  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#fff",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  rowLabel: {
    fontSize: "13px",
    color: "#7fa89f",
  },

  rowValue: {
    fontSize: "14px",
    color: "#f1f0f3",
  },

  discountValue: {
    fontSize: "14px",
    color: "#2ecc71",
    fontWeight: 700,
  },

  payableRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #1e3330",
  },

  payableLabel: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#f1f0f3",
  },

  payableValue: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#f5b942",
  },

  seatsBox: {
    marginTop: "10px",
  },

  seatTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },

  seatTag: {
    background: "#f5b942",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: "20px",
  },

  couponRow: {
    display: "flex",
    gap: "10px",
  },

  couponSelect: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #3a2530",
    background: "#12231f",
    color: "#f1f0f3",
    fontSize: "13px",
  },

  applyBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#f5b942",
    color: "#fff",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },

  couponAppliedChip: {
    marginTop: "12px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#2ecc71",
    background: "rgba(46,204,113,0.1)",
    border: "1px solid rgba(46,204,113,0.3)",
    padding: "8px 12px",
    borderRadius: "10px",
  },

  // ---- sticky bottom pay bar ----
  payBar: {
    position: "sticky",
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, #071815 60%, rgba(18,6,11,0))",
    paddingTop: "24px",
    paddingBottom: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },

  payBarInner: {
    width: "100%",
    maxWidth: "420px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  payBarAmount: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },

  payBarLabel: {
    fontSize: "11px",
    color: "#7fa89f",
  },

  payBarValue: {
    fontSize: "20px",
    fontWeight: 800,
    color: "#fff",
  },

  payBtn: {
    flex: 1,
    padding: "16px",
    background: "linear-gradient(135deg,#f5b942,#c17f0a)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "15px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    letterSpacing: ".3px",
    boxShadow: "0 10px 25px rgba(245,185,66,.35)",
  },

  payBtnDisabled: {
    opacity: .6,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  secureNote: {
    fontSize: "11px",
    color: "#8a7a80",
    textAlign: "center",
  },

  emptyCard: {
    maxWidth: "420px",
    textAlign: "center",
    background: "#0e1f1c",
    padding: "40px 24px",
    borderRadius: "16px",
    border: "1px solid #1e3330",
  },

  emptyIcon: {
    fontSize: "34px",
  },

  emptyTitle: {
    margin: "12px 0 6px",
    color: "#fff",
  },

  emptyText: {
    color: "#7fa89f",
    fontSize: "14px",
  },
};