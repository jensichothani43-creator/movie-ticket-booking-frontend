import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import MovieList from "../../components/MovieList";
import api from "../../services/api";
import "./admin.css";
import Offers from "../User/Offers";
import UserPage from "./UserPage";

import Shows from "./Shows";
import Screens from "./Screens";


function Admin() {
  const [active, setActive] = useState("dashboard");
const [offerTitle, setOfferTitle] = useState("");
const [offerDiscount, setOfferDiscount] = useState("");
const [offerCode, setOfferCode] = useState("");
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);

  const [movieTitle, setMovieTitle] = useState("");
  const [movieImage, setMovieImage] = useState("");

  const [editMovie, setEditMovie] = useState(null);

  const [offersState, setOffersState] = useState([]);
  const [shows, setShows] = useState([]);

  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [showPrice, setShowPrice] = useState("");

  // 🔥 NEW: popup state (UI only, no logic change)
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    loadMovies();
    loadOffers();
    loadUsers();
    loadShows();
    loadScreens();   // 🔥 FIX (screens count was always 0)
  }, []);

  // 🔥 NEW: auto-dismiss popup after 2.5s
  useEffect(() => {
    if (!popupMessage) return;
    const timer = setTimeout(() => setPopupMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [popupMessage]);

  // ================= MOVIES =================
  const loadMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addMovie = async () => {

  if (!movieTitle.trim() || !movieImage.trim()) {
    alert("Movie Title and Image URL are required!");
    return;
  }

  try {
    await api.post("/movies", {
      name: movieTitle,
      image: movieImage,
      category: "Action",
      description: "No description",
    });

    setMovieTitle("");
    setMovieImage("");
    loadMovies();
    setPopupMessage("Movie added successfully!"); // 🔥 NEW
  } catch (err) {
    console.log(err);
  }
};

  const deleteMovie = async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      loadMovies();
    } catch (err) {
      console.log(err);
    }
  };

  const updateMovie = async () => {
    if (!editMovie) return;

    try {
      await api.put(`/movies/${editMovie.id}`, {
        name: editMovie.name,
        image: editMovie.image,
        category: editMovie.category,
        description: editMovie.description,
      });

      setEditMovie(null);
      loadMovies();
      setPopupMessage("Movie updated successfully!"); // 🔥 NEW
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SCREENS =================
  const loadScreens = async () => {
    try {
      const res = await api.get("/screens");
      setScreens(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SHOWS =================
  const loadShows = async () => {
    try {
      const res = await api.get("/shows");
      setShows(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addShow = async () => {
    try {
      await api.post("/shows", {
        date: showDate,
        time: showTime,
        price: showPrice,
      });

      setShowDate("");
      setShowTime("");
      setShowPrice("");
      setPopupMessage("Show added successfully!"); // 🔥 NEW
    } catch (err) {
      console.log(err);
    }
  };

  // ================= OFFERS =================
  const loadOffers = async () => {
    try {
      const res = await api.get("/offers");
      setOffers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addOffer = async () => {
    try {
      await api.post("/offers", {
        title: offerTitle,
        code: offerCode,
        discount_value: Number(offerDiscount),
        discount_type: "percentage",
        status: "active",
      });

      setOfferTitle("");
      setOfferDiscount("");
      setOfferCode("");
      loadOffers();
      setPopupMessage("Offer added successfully!"); // 🔥 NEW
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOffer = async (id) => {
    try {
      await api.delete(`/offers/${id}`);
      loadOffers();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= USERS =================
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin" style={styles.admin}>
      <Sidebar active={active} setActive={setActive} />

      <main style={styles.main}>
        <Header />

        {/* 🔥 NEW: Success popup — pure UI, no logic touched */}
        {popupMessage && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupCard}>
              <span style={styles.popupIcon}>✅</span>
              <p style={styles.popupText}>{popupMessage}</p>
              <button
                onClick={() => setPopupMessage("")}
                style={styles.popupClose}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {active === "dashboard" && (
          <div className="cards" style={styles.cards}>
            <StatCard icon="🎬" title="Movies" value={movies.length} />
            <StatCard icon="🏢" title="Screens" value={screens.length} />
            <StatCard icon="💰" title="Offers" value={offers.length} />
          </div>
        )}

        {active === "movies" && (
          <div className="box" style={styles.box}>
            <h2 style={styles.boxTitle}>Movies</h2>

            <div style={styles.formRow}>
              <input
                placeholder="Movie Title"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Image URL"
                value={movieImage}
                onChange={(e) => setMovieImage(e.target.value)}
                style={styles.input}
              />

              <button onClick={addMovie} style={styles.primaryBtn}>Add Movie</button>
            </div>

            <MovieList
              movies={movies}
              onDelete={deleteMovie}
              onEdit={setEditMovie}
            />
          </div>
        )}

        {active === "movies" && editMovie && (
          <div className="box" style={styles.box}>
            <h3 style={styles.boxTitle}>Edit Movie</h3>

            <div style={styles.formColumn}>
              <input
                value={editMovie.name || ""}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, name: e.target.value })
                }
                style={styles.input}
                placeholder="Name"
              />

              <input
                value={editMovie.image || ""}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, image: e.target.value })
                }
                style={styles.input}
                placeholder="Image URL"
              />

              <input
                value={editMovie.category || ""}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, category: e.target.value })
                }
                style={styles.input}
                placeholder="Category"
              />

              <input
                value={editMovie.description || ""}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, description: e.target.value })
                }
                style={styles.input}
                placeholder="Description"
              />

              <div style={styles.formRow}>
                <button onClick={updateMovie} style={styles.primaryBtn}>Update</button>
                <button onClick={() => setEditMovie(null)} style={styles.secondaryBtn}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {active === "offers" && (
          <Offers
            offers={offers}
            addOffer={addOffer}
            deleteOffer={deleteOffer}
            setOfferTitle={setOfferTitle}
            setOfferDiscount={setOfferDiscount}
            setOfferCode={setOfferCode}
            offerTitle={offerTitle}
            offerDiscount={offerDiscount}
            offerCode={offerCode}
          />
        )}

        {active === "screens" && <Screens />}
        {active === "shows" && <Shows shows={shows} />}
        {active === "users" && <UserPage users={users} />}
        {active === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default Admin;

/* ================= STYLES ================= */
const styles = {
  admin: {
    display: "flex",
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% 0%, #1a2540 0%, #060912 55%, #030509 100%)",
    color: "#e5e9f2",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  main: {
    flex: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  cards: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
  },

  box: {
    background: "#0d1424",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 15px 35px rgba(0,0,0,.4)",
  },

  boxTitle: {
    margin: "0 0 18px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#f8fafc",
  },

  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "18px",
  },

  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "360px",
  },

  input: {
    flex: 1,
    minWidth: "160px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #2a3652",
    background: "#141e33",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
  },

  primaryBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #2a3652",
    background: "transparent",
    color: "#cbd5e1",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },

  // 🔥 NEW: popup styles
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(3, 5, 9, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  popupCard: {
    position: "relative",
    background: "#0d1424",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "28px 40px",
    boxShadow: "0 15px 35px rgba(0,0,0,.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    minWidth: "260px",
  },

  popupIcon: {
    fontSize: "28px",
  },

  popupText: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "center",
  },

  popupClose: {
    position: "absolute",
    top: "8px",
    right: "12px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1,
  },
};