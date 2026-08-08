import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div style={{ padding: "15px", margin: "10px", borderRadius: "8px" }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}