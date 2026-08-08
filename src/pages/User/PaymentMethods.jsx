import React from "react";

export default function PaymentMethods({ method, setMethod }) {
  return (
    <div className="payment-methods">

      <h2 className="payment-title">
        💳 Select Payment Method
      </h2>

      <div className="method-list">

        {/* Card */}
        <label className={`method-card ${method === "card" ? "active" : ""}`}>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="method-content">
            <h4>💳 Credit / Debit Card</h4>
            <p>Visa, MasterCard, RuPay</p>
          </div>
        </label>

        {/* UPI */}
        <label className={`method-card ${method === "upi" ? "active" : ""}`}>
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={method === "upi"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="method-content">
            <h4>📱 UPI</h4>
            <p>Google Pay, PhonePe, Paytm</p>
          </div>
        </label>

        {/* Net Banking */}
        <label
          className={`method-card ${method === "netbanking" ? "active" : ""}`}
        >
          <input
            type="radio"
            name="payment"
            value="netbanking"
            checked={method === "netbanking"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="method-content">
            <h4>🏦 Net Banking</h4>
            <p>All Major Banks</p>
          </div>
        </label>

        {/* Wallet */}
        <label className={`method-card ${method === "wallet" ? "active" : ""}`}>
          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={method === "wallet"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="method-content">
            <h4>👛 Wallet</h4>
            <p>Amazon Pay, Mobikwik, Freecharge</p>
          </div>
        </label>

      </div>

      {/* Selected Payment UI */}
      <div className="payment-info">

        {method === "card" && (
          <div className="info-box">
            <h3>💳 Card Payment</h3>

            <input
              type="text"
              placeholder="Card Holder Name"
              className="payment-input"
            />

            <input
              type="text"
              placeholder="Card Number"
              className="payment-input"
            />

            <div className="payment-row">
              <input
                type="text"
                placeholder="MM/YY"
                className="payment-input"
              />

              <input
                type="password"
                placeholder="CVV"
                className="payment-input"
              />
            </div>
          </div>
        )}

        {method === "upi" && (
          <div className="info-box">
            <h3>📱 UPI Payment</h3>

            <input
              type="text"
              placeholder="Enter UPI ID (example@upi)"
              className="payment-input"
            />
          </div>
        )}

        {method === "netbanking" && (
          <div className="info-box">
            <h3>🏦 Net Banking</h3>

            <select className="payment-input">
              <option>Select Bank</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Bank of Baroda</option>
            </select>
          </div>
        )}

        {method === "wallet" && (
          <div className="info-box">
            <h3>👛 Wallet</h3>

            <select className="payment-input">
              <option>Select Wallet</option>
              <option>Amazon Pay</option>
              <option>Paytm Wallet</option>
              <option>Mobikwik</option>
              <option>Freecharge</option>
            </select>
          </div>
        )}

      </div>
    </div>
  );
}