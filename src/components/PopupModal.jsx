import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  // ESC key થી close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>

        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "400px",
    background: "#fff",
    borderRadius: "10px",
    padding: "15px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
  body: {
    marginTop: "10px",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },
};