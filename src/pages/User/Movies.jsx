import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Movies() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  // ================= FETCH MOVIES =================
  useEffect(() => {

    const fetchMovies = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          "http://127.0.0.1:8000/movies"
        );

        console.log("MOVIES API:", res.data);

        setMovies(Array.isArray(res.data) ? res.data : []);

      } catch(err){

        console.log("Movie Fetch Error:",err);

        setMovies([]);

      }
      finally{

        setLoading(false);

      }

    };


    fetchMovies();

  }, []);



  // ================= BOOK NOW =================
  const bookMovie = (movie)=>{

    navigate(`/shows/${movie.id}`,{

      state:{
        movie
      }

    });

  };



  return (

    <div style={styles.page}>

      {/* ================= SECTION HEADER ================= */}
      <div style={styles.sectionHeader}>
        <h1 style={styles.sectionTitle}>Now Showing</h1>
        <p style={styles.sectionSubtitle}>
          Book tickets for the latest movies in town
        </p>
      </div>

      {
        loading ?

        (
          <div style={styles.stateWrap}>
            <div style={styles.spinner} />
            <p style={styles.stateText}>Loading movies…</p>
          </div>
        )

        :

        movies.length === 0 ?

        (
          <div style={styles.stateWrap}>
            <p style={styles.stateEmoji}>🎬</p>
            <p style={styles.stateText}>No movies found</p>
          </div>
        )

        :

        (

          <div style={styles.grid}>

            {

              movies.map((movie) => (

                <div
                  key={movie.id}
                  className="bms-card"
                  style={styles.card}
                  onClick={() => bookMovie(movie)}
                >

                  {/* ---------- POSTER ---------- */}
                  <div style={styles.posterWrap}>

                    <img
                      src={movie.image || "/ticket-bg.jpg"}
                      alt={movie.name}
                      style={styles.poster}
                    />

                    {/* rating chip, top-left on poster */}
                    <div style={styles.ratingChip}>
                      <span style={styles.star}>★</span>
                      <span>{movie.rating || "4.5"}/5</span>
                    </div>

                    {/* hover overlay with quick book action */}
                    <div className="bms-overlay" style={styles.overlay}>
                      <button
                        style={styles.overlayBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          bookMovie(movie);
                        }}
                      >
                        🎟 Book Now
                      </button>
                    </div>

                  </div>

                  {/* ---------- INFO ---------- */}
                  <div style={styles.info}>

                    <h3 style={styles.title}>{movie.name}</h3>

                    <span style={styles.categoryTag}>
                      {movie.category || "Movie"}
                    </span>

                    <button
                      style={styles.bookBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        bookMovie(movie);
                      }}
                    >
                      Book Tickets
                    </button>

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

      {/* hover styles (kept scoped here since component uses inline styles) */}
      <style>{`
        .bms-card { transition: transform .25s ease, box-shadow .25s ease; }
        .bms-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(0,0,0,.55); }
        .bms-card:hover .bms-overlay { opacity: 1; }
      `}</style>

    </div>

  );

}

/* ================= STYLES ================= */
const styles = {
  page: {
    background: "#0b0f1a",
    minHeight: "100vh",
    color: "white",
    padding: "40px 32px 60px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  sectionHeader: {
    marginBottom: "32px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#8b93a7",
  },

  stateWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    gap: "12px",
  },

  stateEmoji: {
    fontSize: "34px",
    margin: 0,
  },

  stateText: {
    color: "#8b93a7",
    fontSize: "15px",
    margin: 0,
  },

  spinner: {
    width: "34px",
    height: "34px",
    border: "3px solid #1f2740",
    borderTopColor: "#e2264d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
    gap: "26px",
  },

  card: {
    background: "#131a2b",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,.4)",
    border: "1px solid #1f2740",
  },

  posterWrap: {
    position: "relative",
    width: "100%",
    height: "280px",
  },

  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  ratingChip: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(0,0,0,.65)",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#f1f5f9",
  },

  star: {
    color: "#f5c518",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(11,15,26,0) 40%, rgba(11,15,26,.92) 100%)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: "16px",
    opacity: 0,
    transition: "opacity .25s ease",
  },

  overlayBtn: {
    width: "100%",
    padding: "10px",
    background: "#e2264d",
    color: "white",
    fontWeight: 700,
    fontSize: "13px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  info: {
    padding: "14px 14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  categoryTag: {
    alignSelf: "flex-start",
    fontSize: "11px",
    fontWeight: 600,
    color: "#8b93a7",
    background: "#1a2338",
    padding: "3px 10px",
    borderRadius: "999px",
  },

  bookBtn: {
    marginTop: "4px",
    width: "100%",
    padding: "10px",
    background: "#22c55e",
    color: "#06210f",
    fontWeight: 700,
    fontSize: "13px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
