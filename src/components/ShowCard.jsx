import React from "react";

export default function ShowCard({ title, image }) {
  return (
    <div style={{ width: "150px", margin: "10px" }}>
      <img src={image} alt={title} style={{ width: "100%", borderRadius: "8px" }} />
      <p>{title}</p>
    </div>
  );
}