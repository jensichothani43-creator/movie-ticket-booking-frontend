import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Screens() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    total_seats: "",
    screen_type: "",
    status: "",
  });

  // ================= FETCH =================
  const fetchScreens = async () => {
    try {
      const res = await api.get("/screens");

      // 🔥 FIX: safe response handling
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data
        ? res.data.data
        : res.data?.screens
        ? res.data.screens
        : [];

      setScreens(data);
      setLoading(false);

    } catch (err) {
      console.log("Fetch Screens Error:", err);
      setScreens([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= OPEN ADD =================
  const openAddPopup = () => {
    setEditMode(false);
    setForm({
      id: null,
      name: "",
      total_seats: "",
      screen_type: "",
      status: "",
    });
    setIsOpen(true);
  };

  // ================= OPEN EDIT =================
  const openEditPopup = (screen) => {
    setEditMode(true);
    setForm({
      id: screen.id,
      name: screen.name,
      total_seats: screen.total_seats,
      screen_type: screen.screen_type,
      status: screen.status,
    });
    setIsOpen(true);
  };

  // ================= SAVE =================
  const saveScreen = async () => {
    if (
      !form.name ||
      !form.total_seats ||
      !form.screen_type ||
      !form.status
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        ...form,
        total_seats: Number(form.total_seats),
      };

      if (editMode) {
        await api.put(`/screens/${form.id}`, payload);
        alert("Screen Updated Successfully");
      } else {
        await api.post("/screens", payload);
        alert("Screen Added Successfully");
      }

      setIsOpen(false);
      fetchScreens();

    } catch (err) {
      console.log("Save Error:", err);
      alert("Operation Failed");
    }
  };

  // ================= DELETE =================
  const deleteScreen = async (id) => {
    if (!window.confirm("Delete this screen?")) return;

    try {
      await api.delete(`/screens/${id}`);
      fetchScreens();
    } catch (err) {
      console.log("Delete Error:", err);
      alert("Delete Failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🎬 Screens</h2>

        <button
          onClick={openAddPopup}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          + Add Screen
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Seats</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {screens.length > 0 ? (
              screens.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.total_seats}</td>
                  <td>{s.screen_type}</td>
                  <td>{s.status}</td>

                  <td>
                    <button onClick={() => openEditPopup(s)}>
                      Edit
                    </button>

                    <button
                      onClick={() => deleteScreen(s.id)}
                      style={{ marginLeft: 10, color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Screens Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* POPUP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 400,
              background: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h2>{editMode ? "Edit Screen" : "Add Screen"}</h2>

            <input
              name="name"
              placeholder="Screen Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="total_seats"
              type="number"
              placeholder="Total Seats"
              value={form.total_seats}
              onChange={handleChange}
            />

            <input
              name="screen_type"
              placeholder="Screen Type"
              value={form.screen_type}
              onChange={handleChange}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <div style={{ marginTop: 15 }}>
              <button onClick={saveScreen}>
                {editMode ? "Update" : "Save"}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}