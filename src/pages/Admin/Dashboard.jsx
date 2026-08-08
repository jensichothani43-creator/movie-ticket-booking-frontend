import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      fetchMovies();
    }
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addMovie = async (e) => {
    e.preventDefault();

    try {
      await api.post("/movies", {
        name,
        duration: Number(duration),
      });

      setName("");
      setDuration("");
      fetchMovies();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await api.delete(`/movies${id}`);
      fetchMovies();
    } catch (err) {
      console.log(err);
    }
  };

  const editMovie = async (movie) => {
    const newName = prompt("Edit name", movie.name);
    if (!newName) return;

    try {
      await api.put(`/movies/${movie.id}`, {
        name: newName,
        duration: movie.duration,
      });

      fetchMovies();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1>🎬 Movie Dashboard</h1>

        <div style={styles.btnGroup}>
          <button style={styles.btn} onClick={logout}>Logout</button>
          <button style={styles.btn} onClick={() => navigate("/shows")}>Shows</button>
          <button style={styles.btn} onClick={() => navigate("/book-ticket")}>Book Ticket</button>
          <button style={styles.btn} onClick={() => navigate("/my-bookings")}>My Bookings</button>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={addMovie} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Movie Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button style={styles.addBtn} type="submit">
          ➕ Add Movie
        </button>
      </form>

      {/* MOVIES GRID */}
      <div style={styles.grid}>
        {movies.map((m) => (
          <div key={m.id} style={styles.card}>
            <h3>🎬 {m.name}</h3>
            <p>⏱ {m.duration} min</p>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => editMovie(m)}>
                Edit
              </button>

              <button style={styles.deleteBtn} onClick={() => deleteMovie(m.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const styles = {
  page: {
    padding: "30px",
    fontFamily: "Inter, Arial",
    background: "linear-gradient(135deg, #0b1220, #111827)",
    minHeight: "100vh",
    color: "#e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "25px",
    gap: "10px",
  },

  title: {
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },

  btnGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "9px 14px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    transition: "0.2s",
  },

  btnHover: {
    background: "rgba(255,255,255,0.12)",
  },

  form: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  input: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    minWidth: "180px",
  },

  addBtn: {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    transition: "0.2s",
  },

  cardHover: {
    transform: "translateY(-3px)",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
  },

  editBtn: {
    background: "#f59e0b",
    border: "none",
    padding: "7px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "black",
    fontWeight: "500",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "7px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
    fontWeight: "500",
  },
};