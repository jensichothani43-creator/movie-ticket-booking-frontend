
import React from "react";

export default function Notifications({ list = [] }) {
  return (
    <div>
      <h3>Notifications</h3>
      {list.map((n, i) => (
        <p key={i}>🔔 {n}</p>
      ))}
    </div>
  );
}