import React from "react";

export default function CinemaList({ cinemas = [], selectedCinema, onSelect }) {
  if (!Array.isArray(cinemas) || cinemas.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        No Cinemas Found
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      {cinemas.map((cinema) => (
        <div
          key={cinema.id}
          onClick={() => onSelect(cinema)}
          style={{
            border:
              selectedCinema?.id === cinema.id
                ? "2px solid #e50914"
                : "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "12px",
            cursor: "pointer",
            background:
              selectedCinema?.id === cinema.id ? "#fff5f5" : "#fff",
            transition: "0.2s",
          }}
        >
          <h3 style={{ margin: 0 }}>{cinema.name}</h3>

          <p style={{ color: "#666", margin: "6px 0" }}>
            📍 {cinema.location || "Surat"}
          </p>

          <p style={{ color: "#888", margin: 0 }}>
            {cinema.address || "Near City Center"}
          </p>
        </div>
      ))}
    </div>
  );
}