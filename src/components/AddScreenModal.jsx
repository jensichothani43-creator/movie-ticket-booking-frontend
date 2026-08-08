export default function AddScreenModal({
  isOpen,
  onClose,
  onSave,
  value,
  setValue,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "300px",
        }}
      >
        <h2>Add Screen</h2>

        <input
          type="text"
          placeholder="Enter screen name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "10px",
          }}
        />

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => {
              if (!value.trim()) return;

              onSave(value);
              setValue("");
              onClose();
            }}
            style={{
              background: "purple",
              color: "#fff",
              padding: "6px 12px",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}