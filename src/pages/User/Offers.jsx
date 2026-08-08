import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
  title: "",
  code: "",
  discount_value: "",
  discount_type: "percentage",
  status: "active",
});
const loadOffers = async () => {
  try {
    setLoading(true);

    const res = await api.get("/offers");

console.log(res.data);

setOffers(res.data);

  } catch (err) {
    console.log("Offer Error:", err);
    setOffers([]);
  } finally {
    setLoading(false);
  }
};
  // ✅ ADD
  const addOffer = async () => {
    try {
      if (!form.title || !form.code) return alert("Fill all fields");

      await api.post("/offers", form);

      setForm({
        title: "",
        code: "",
        discount_value: "",
        discount_type: "percentage",
        status: "Active",
      });

      setShowModal(false);
      loadOffers();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE
  const deleteOffer = async (id) => {
    try {
      await api.delete(`/offers/${id}`);
      loadOffers();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SEARCH FILTER
  const filteredOffers = offers.filter((o) =>
    o.title?.toLowerCase().includes(search.toLowerCase())
  );

  const total = offers.length;
  const active = offers.filter(o => o.status === "Active").length;
  const upcoming = offers.filter(o => o.status === "Upcoming").length;
  const expired = offers.filter(o => o.status === "Expired").length;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: "#fff" }}>🎟 Offers</h2>
          <p style={{ margin: 0, color: "#94a3b8" }}>Dashboard / Offers</p>
        </div>

        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          + Add New Offer
        </button>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        <Card title="Total" value={total} color="#8b5cf6" />
        <Card title="Active" value={active} color="#22c55e" />
        <Card title="Upcoming" value={upcoming} color="#f59e0b" />
        <Card title="Expired" value={expired} color="#ef4444" />
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search offers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <p style={{ color: "#fff" }}>Loading...</p>
        ) : (
          filteredOffers.map((o) => (
            <div key={o.id} style={styles.card}>

              <div>
                <h4 style={{ margin: 0, color: "#fff" }}>{o.title}</h4>
                <small style={{ color: "#94a3b8" }}>{o.code}</small>
              </div>

              <div style={{ color: "#cbd5e1" }}>
                {o.discount_value} {o.discount_type}
              </div>

              <span style={{
                ...styles.status,
                background:
                  o.status === "Active"
                    ? "#052e1b"
                    : o.status === "Upcoming"
                    ? "#3b2f05"
                    : "#3b0a0a",
                color:
                  o.status === "Active"
                    ? "#22c55e"
                    : o.status === "Upcoming"
                    ? "#f59e0b"
                    : "#ef4444"
              }}>
                {o.status}
              </span>

              <button
                onClick={() => deleteOffer(o.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>

            <h3 style={{ color: "#fff" }}>Add Offer</h3>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Discount Value"
              value={form.discount_value}
              onChange={(e) =>
                setForm({ ...form, discount_value: e.target.value })
              }
              style={styles.input}
            />

            <select
              value={form.discount_type}
              onChange={(e) =>
                setForm({ ...form, discount_type: e.target.value })
              }
              style={styles.input}
            >
              <option value="percent">Percent</option>
              <option value="flat">Flat</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              style={styles.input}
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Expired">Expired</option>
            </select>

            <div style={styles.modalActions}>
              <button style={styles.saveBtn} onClick={addOffer}>
                Save
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* CARD */
const Card = ({ title, value, color }) => (
  <div style={{
    flex: 1,
    background: "#0f172a",
    padding: 15,
    borderRadius: 12,
    borderLeft: `4px solid ${color}`,
    color: "#fff"
  }}>
    <h2 style={{ margin: 0 }}>{value}</h2>
    <p style={{ margin: 0, color: "#94a3b8" }}>{title}</p>
  </div>
);

/* STYLES */
const styles = {
  page: {
    padding: 20,
    minHeight: "100vh",
    background: "#0b1220",
    fontFamily: "sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  addBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  },
  statsRow: {
    display: "flex",
    gap: 12,
    marginTop: 20
  },
  search: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "#0f172a",
    color: "#fff"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    background: "#0f172a",
    borderRadius: 12,
    marginBottom: 10,
    border: "1px solid #1f2937"
  },
  status: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer"
  },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: 320,
    background: "#111827",
    padding: 20,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #1f2937",
    background: "#0f172a",
    color: "#fff"
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10
  },
  saveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer"
  },
  cancelBtn: {
    background: "#6b7280",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer"
  }
};

export default Offers;