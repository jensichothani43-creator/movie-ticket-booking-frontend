import { useState, useEffect } from "react";
import api from "../../services/api";

import { useParams, useLocation } from "react-router-dom";

export default function Shows() {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState(1);

  const { id: movieId } = useParams();

  const [shows, setShows] = useState([]);
  const [screens, setScreens] = useState([]);

  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    movie_id: "",
    screen_id: "",
    show_date: "",
    show_time: "",
    price: ""
  });

  // ================= VALIDATION =================
  const validateForm = () => {
    let newErrors = {};

    if (!form.movie_id) newErrors.movie_id = "Movie required";
    if (!form.screen_id) newErrors.screen_id = "Screen required";
    if (!form.show_date) newErrors.show_date = "Date required";
    if (!form.show_time) newErrors.show_time = "Time required";
    if (!form.price) newErrors.price = "Price required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= FETCH SCREENS =================
  useEffect(() => {
    api.get("/screens")
      .then((res) => setScreens(res.data || []))
      .catch((err) => console.log("Screens Error:", err));
  }, []);

  // ================= FETCH SHOWS =================
  const fetchShows = async () => {
    try {
      const res = await api.get("/shows");

      const data = res.data || [];

      const filtered = data.filter(
        (s) => movieId ? s.movie_id === Number(movieId) : true
      );

      setShows(filtered);
    } catch (err) {
      console.log("Fetch Shows Error:", err);
      setShows([]);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [movieId]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= OPEN EDIT =================
  const openEdit = (show) => {
    setEditId(show.id);
    setForm({
      movie_id: show.movie_id,
      screen_id: show.screen_id,
      show_date: show.show_date,
      show_time: show.show_time,
      price: show.price
    });

    setOpen(true); // ✅ FIXED (was setIsOpen)
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({
      movie_id: "",
      screen_id: "",
      show_date: "",
      show_time: "",
      price: ""
    });
    setEditId(null);
    setErrors({});
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        movie_id: Number(form.movie_id),
        screen_id: Number(form.screen_id),
        show_date: form.show_date,
        show_time: form.show_time,
        price: Number(form.price)
      };

      if (editId) {
        await api.put(`/shows/${editId}`, payload);
      } else {
        await api.post("/shows", payload);
      }

      setOpen(false); // ✅ FIXED
      resetForm();
      fetchShows();

    } catch (err) {
      console.log("Save Error:", err);
      alert("Save Error");
    }
  };

  // ================= DELETE =================
  const deleteShow = async (id) => {
    try {
      await api.delete(`/shows/${id}`);
      fetchShows();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
    <div className="p-4">

      <button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        + Add Show
      </button>

      {open && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div className="modal-header">
              <h2>{editId ? "Edit Show" : "Add Show"}</h2>
            </div>

            <div className="modal-body">

              <input
                name="movie_id"
                value={form.movie_id}
                onChange={handleChange}
                placeholder="Movie ID"
              />

              <select
                name="screen_id"
                value={form.screen_id}
                onChange={handleChange}
              >
                <option value="">-- Select Screen --</option>
                {screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    🎬 {screen.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="show_date"
                value={form.show_date}
                onChange={handleChange}
              />

              <input
                type="time"
                name="show_time"
                value={form.show_time}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
              />

            </div>

            <div className="modal-footer">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={handleSubmit}>
                {editId ? "Update" : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3">

        {shows.length > 0 ? (
          shows.map((s) => (
            <div key={s.id} className="bg-gray-900 text-white p-3 rounded">

              <p>Movie: {s.movie_id}</p>
              <p>Screen: {s.screen_id}</p>
              <p>{s.show_date} | {s.show_time}</p>
              <p>₹{s.price}</p>

              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(s)}>Edit</button>
                <button onClick={() => deleteShow(s.id)}>Delete</button>
              </div>

            </div>
          ))
        ) : (
          <p>No shows found</p>
        )}

      </div>
    </div>
  );
}