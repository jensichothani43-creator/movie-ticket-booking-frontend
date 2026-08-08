import { useState } from "react";
import api from "../services/api";

export default function MovieUpdate({ movie, onClose, onUpdated }) {
  const [name, setName] = useState(movie.name || "");
  const [category, setCategory] = useState(movie.category || "");
  const [image, setImage] = useState(movie.image || "");
  const [description, setDescription] = useState(movie.description || "");

  const handleUpdate = async () => {
    try {
      await api.put(`/movies/${movie.id}`, {
        name,
        category,
        image,
        description,
      });

      onUpdated();   // refresh list
      onClose();     // close modal
    } catch (err) {
      alert("Error updating movie");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Update Movie</h2>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Movie Name"
          style={styles.input}
        />

        {/* CATEGORY */}
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          style={styles.input}
        />

        {/* IMAGE + PREVIEW */}
        <div style={styles.imageRow}>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
            style={styles.input}
          />

          {/* LIVE PREVIEW */}
          {image && (
            <img
              src={image}
              alt="preview"
              style={styles.preview}
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={styles.textarea}
        />

        {/* BUTTONS */}
        <div style={styles.btnRow}>
          <button onClick={onClose}>Cancel</button>

          <button onClick={handleUpdate} style={styles.updateBtn}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "420px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    height: "80px",
  },

  imageRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  preview: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  btnRow: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  updateBtn: {
    background: "purple",
    color: "white",
    padding: "6px 12px",
  },
};