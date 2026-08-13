import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentResult() {

  const location = useLocation();
  const navigate = useNavigate();

  const isSuccess = location.pathname === "/payment-success";

const queryParams = new URLSearchParams(location.search);
const bookingId = queryParams.get("bookingId") || queryParams.get("booking_id");


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "radial-gradient(circle at 50% 0%, #1a2540 0%, #060912 55%, #030509 100%)",
        fontFamily: "'Segoe UI', Arial, sans-serif"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#0d1424",
          border: "1px solid #1e293b",
          padding: "44px 36px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,.55)"
        }}
      >

      {
        isSuccess ? (
          <>

            <div
              style={{
                width: "84px",
                height: "84px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                background: "rgba(34,197,94,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize:"42px",
                boxShadow: "0 0 0 1px rgba(34,197,94,.3)"
              }}
            >
              ✅
            </div>


            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#22c55e",
                fontWeight: 700,
                marginBottom: "10px"
              }}
            >
              Booking Confirmed
            </span>


            <h1
              style={{
                color:"#f8fafc",
                fontSize:"24px",
                fontWeight: 700,
                margin: "0 0 10px"
              }}
            >
              Payment Successful
            </h1>


            <p
              style={{
                color:"#a8b3cc",
                fontSize:"14px",
                lineHeight: 1.5,
                marginBottom:"30px"
              }}
            >
              Your movie ticket booking is confirmed.
            </p>


           <button
  onClick={() => {
    if (bookingId) {
      localStorage.setItem(
        "ticketData",
        JSON.stringify({ bookingId: bookingId })
      );
    }
    navigate("/final-ticket");
  }}
  style={{
                width:"100%",
                padding:"14px",
                border:"none",
                borderRadius:"10px",
                background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                color:"#fff",
                fontSize:"15px",
                cursor:"pointer",
                fontWeight:"700",
                letterSpacing: ".3px"
              }}
            >
              🎟 View Ticket
            </button>

          </>
        )
        :
        (
          <>

            <div
              style={{
                width: "84px",
                height: "84px",
                margin: "0 auto 22px",
                borderRadius: "50%",
                background: "rgba(239,68,68,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize:"42px",
                boxShadow: "0 0 0 1px rgba(239,68,68,.3)"
              }}
            >
              ❌
            </div>


            <span
              style={{
                display: "inline-block",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#ef4444",
                fontWeight: 700,
                marginBottom: "10px"
              }}
            >
              Payment Issue
            </span>


            <h1
              style={{
                color:"#f8fafc",
                fontSize:"24px",
                fontWeight: 700,
                margin: "0 0 10px"
              }}
            >
              Payment Failed
            </h1>


            <p
              style={{
                color:"#a8b3cc",
                fontSize:"14px",
                lineHeight: 1.5,
                marginBottom:"30px"
              }}
            >
              Payment cancelled or failed. Try again.
            </p>


            <button
              onClick={() => navigate("/payment")}
              style={{
                width:"100%",
                padding:"14px",
                border:"none",
                borderRadius:"10px",
                background:"linear-gradient(135deg,#dc2626,#b91c1c)",
                color:"#fff",
                fontSize:"15px",
                cursor:"pointer",
                fontWeight:"700",
                letterSpacing: ".3px"
              }}
            >
              💳 Retry Payment
            </button>

          </>
        )
      }

      </div>

    </div>
  );
}