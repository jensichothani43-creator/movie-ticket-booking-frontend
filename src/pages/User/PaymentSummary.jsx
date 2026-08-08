import React from "react";

export default function PaymentSummary({
  booking,
  subTotal,
  convenienceFee,
  gst,
  discount,
  total,
}) {
  return (
    <div className="payment-summary">

      <h2 className="summary-title">🎟 Booking Summary</h2>

      <div className="summary-card">

        <div className="summary-row">
          <span>🎬 Movie</span>
          <strong>{booking.movie}</strong>
        </div>

        <div className="summary-row">
          <span>🏢 Theatre</span>
          <strong>{booking.theatre}</strong>
        </div>

        <div className="summary-row">
          <span>🎥 Screen</span>
          <strong>{booking.screen}</strong>
        </div>

        <div className="summary-row">
          <span>📅 Date</span>
          <strong>{booking.date}</strong>
        </div>

        <div className="summary-row">
          <span>⏰ Time</span>
          <strong>{booking.time}</strong>
        </div>

        <div className="summary-row">
          <span>💺 Seats</span>
          <strong>{booking.seats.join(", ")}</strong>
        </div>

        <hr />

        <div className="summary-row">
          <span>Ticket Price</span>
          <strong>₹ {subTotal}</strong>
        </div>

        <div className="summary-row">
          <span>Convenience Fee</span>
          <strong>₹ {convenienceFee}</strong>
        </div>

        <div className="summary-row">
          <span>GST (18%)</span>
          <strong>₹ {gst}</strong>
        </div>

        {discount > 0 && (
          <div className="summary-row discount">
            <span>Coupon Discount</span>
            <strong>- ₹ {discount}</strong>
          </div>
        )}

        <hr />

        <div className="summary-total">
          <span>Total Payable</span>
          <strong>₹ {total}</strong>
        </div>

      </div>
    </div>
  );
}