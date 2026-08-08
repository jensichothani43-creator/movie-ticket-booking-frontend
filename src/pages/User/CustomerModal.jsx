import { useState } from "react";
import "../../css/modal.css";

export default function CustomerModal({ open, onClose, onContinue }) {
  const [count, setCount] = useState(1);

  if (!open) return null;

  const increase = () => {
    if (count < 10) setCount(count + 1);
  };

  const decrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleContinue = () => {
    onContinue(count);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>How many customers?</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <p>Select number of seats (1 - 10)</p>

        <div className="counter">
          <button onClick={decrease}>−</button>
          <span>{count}</span>
          <button onClick={increase}>+</button>
        </div>

        <small>You can book maximum 10 seats</small>

        <div className="actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}