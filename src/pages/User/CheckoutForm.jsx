import { useState } from "react";

export default function CheckoutForm({
  amount,
  paymentMethod,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    // Demo Payment
    setTimeout(() => {
      setLoading(false);

      alert("✅ Payment Successful!");

      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <div className="checkout-form">

      <h2>💳 Payment Details</h2>

      <div className="payment-summary-box">

        <div className="payment-row">
          <span>Payment Method</span>
          <strong>{paymentMethod.toUpperCase()}</strong>
        </div>

        <div className="payment-row">
          <span>Total Amount</span>
          <strong>₹ {amount}</strong>
        </div>

      </div>

      <button
        className="pay-btn"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing Payment..." : `Pay ₹${amount}`}
      </button>

      <p className="secure-text">
        🔒 Your payment is secured with SSL Encryption.
      </p>

    </div>
  );
}