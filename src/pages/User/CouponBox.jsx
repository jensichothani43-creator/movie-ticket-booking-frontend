import { useState } from "react";

export default function CouponBox({ total, onDiscount }) {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  const coupons = {
    MOVIE100: 100,
    BOOK50: 50,
    CINEMA25: 25,
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setMessage("Please enter a coupon code.");
      onDiscount(0);
      return;
    }

    if (applied) {
      setMessage("Coupon already applied.");
      return;
    }

    if (coupons[code]) {
      let discount = coupons[code];

      // Discount cannot exceed total
      if (discount > total) {
        discount = total;
      }

      onDiscount(discount);
      setApplied(true);
      setMessage(`🎉 Coupon Applied! You saved ₹${discount}`);
    } else {
      onDiscount(0);
      setMessage("❌ Invalid Coupon Code");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setApplied(false);
    onDiscount(0);
    setMessage("Coupon removed.");
  };

  return (
    <div className="coupon-box">
      <h3>🏷 Apply Coupon</h3>

      <div className="coupon-input-group">
        <input
          type="text"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={applied}
        />

        {!applied ? (
          <button onClick={applyCoupon}>
            Apply
          </button>
        ) : (
          <button
            className="remove-btn"
            onClick={removeCoupon}
          >
            Remove
          </button>
        )}
      </div>

      {message && (
        <p
          className={
            message.includes("saved")
              ? "coupon-success"
              : "coupon-error"
          }
        >
          {message}
        </p>
      )}

      <div className="available-coupons">
        <h4>Available Coupons</h4>

        <ul>
          <li>
            <strong>MOVIE100</strong> - Flat ₹100 OFF
          </li>

          <li>
            <strong>BOOK50</strong> - Flat ₹50 OFF
          </li>

          <li>
            <strong>CINEMA25</strong> - Flat ₹25 OFF
          </li>
        </ul>
      </div>
    </div>
  );
}