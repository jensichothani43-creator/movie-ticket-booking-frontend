import React from "react";

export default function MovieList({ movies = [], onDelete, onEdit }) {
  return (
    <div>
      <h3>Movies List</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {movies && movies.length > 0 ? (
          movies.map((m) => (
            <div
              key={m.id}
              style={{
                width: "200px",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {/* IMAGE SAFE FIX */}
              <img
                src={
                  m.image && m.image.trim()
                    ? m.image
                    : "https://via.placeholder.com/150"
                }
                alt={m.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <h4>{m.name}</h4>
              <p>{m.category}</p>

              <p style={{ fontSize: "12px" }}>
                {m.description ? m.description : "No description"}
              </p>

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => onEdit && onEdit(m)}
                  style={{
                    background: "blue",
                    color: "white",
                    border: "none",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete && onDelete(m.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
}