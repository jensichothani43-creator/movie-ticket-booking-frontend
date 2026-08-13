
export default function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "#f87171",
      }}
    >
      <p>{message || "Something went wrong."}</p>

      <button
        onClick={onRetry}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </div>
  );
}

