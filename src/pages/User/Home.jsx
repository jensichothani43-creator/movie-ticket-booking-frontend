import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "../../css/home.css";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Header from "../../components/Header";

export default function Home() {

  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const limit = 100;

  const categories = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Thriller"];

  // reset page on category change
  useEffect(() => {
    setPage(1);
  }, [category]);



  // fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const res = await api.get("/movies", {
  params: {
    category: category === "All" ? undefined : category,
    page,
    limit
  }
});


        console.log("API DATA:", res.data);

        // ✅ FIXED RESPONSE HANDLING
const moviesData =
  res.data?.movies ||
  res.data?.data ||
  res.data ||
  [];

console.log("MOVIES ARRAY:", moviesData);

        setMovies(Array.isArray(moviesData) ? moviesData : []);

      } catch (err) {
        console.log("❌ API Error:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, category]);
  // 🔥 Fetch Trending Movies
useEffect(() => {

  const fetchTrending = async () => {

    try {

      const res = await api.get("/movies/trending");

      console.log("TRENDING:", res.data);

      setTrendingMovies(res.data);

    } catch(err) {

      console.log("Trending Error:", err);

    }

  };


  fetchTrending();

}, []);


  


// FILTER MOVIES
const filteredMovies = useMemo(() => {

  return movies.filter((m) => {

    const searchLower = search.toLowerCase();

    // search movie name OR category
    const matchSearch =
      (m?.name || m?.title || "")
        .toLowerCase()
        .includes(searchLower) ||
      (m?.category || "")
        .toLowerCase()
        .includes(searchLower);


    const matchCategory =
      category === "All"
        ? true
        : (m?.category || "").toLowerCase() === category.toLowerCase();


    return matchSearch && matchCategory;

  });

}, [movies, search, category]);
const bannerMovie = filteredMovies[0];

  // CLICK HANDLER
  const toggleLike = (id) => {
  setLikedMovies((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};


  const handleClick = (movie) => {

  const token = localStorage.getItem("token");

  // 🔒 authentication check
  if (!token) {
    navigate("/login");
    return;
  }


  const id = movie?.id;

  if (!id) {
    alert("Movie ID missing ❌");
    return;
  }


  navigate(`/shows/${id}`, {
    state: {
      movie,
      category: movie?.category || category,
    },
  });
};

  // 🌟 RATING HELPER (display only — no logic/data change, just formats existing/fallback value)
  const getRating = (movie) => {
  const r = movie?.rating || 0;
  return Number(r).toFixed(1);
};

  return (
    <div className="app" style={styles.app}>
       
<header className="hero-header" style={styles.heroHeader}>

  <h1 className="logo" style={styles.logo}>
    🎬 MovieHub
  </h1>


  <input
    className="search"
    placeholder="Search movies or categories..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
    style={styles.search}
  />


  <button
    className="logout-btn"
    onClick={()=>{
      localStorage.removeItem("token");
      navigate("/login");
    }}
    style={styles.logoutBtn}
  >
    🚪 Sign Out
  </button>


</header>
 <div className="category-wrap" style={styles.categoryWrap}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
            style={{
              ...styles.chip,
              ...(category === cat ? styles.chipActive : {})
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    



{/* ================= HERO BANNER ================= */}

{bannerMovie && (
  <div className="hero-banner" style={styles.heroBanner}>

    <img
      src={bannerMovie.image}
      alt={bannerMovie.name}
      className="hero-banner-img"
      style={styles.heroBannerImg}
    />

    <div className="hero-overlay" style={styles.heroOverlay}>

      <div className="hero-content" style={styles.heroContent}>

       

        <h1 style={styles.heroHeading}>{bannerMovie.name}</h1>

        <p style={styles.heroDesc}>
          {bannerMovie.description ||
          "Experience the biggest blockbuster on the big screen."}
        </p>

        <div className="hero-info" style={styles.heroInfo}>
          ⭐ {getRating(bannerMovie)}
          {" • "}
          {bannerMovie.category}
          {" • "}
          2D
        </div>


        <div className="hero-buttons" style={styles.heroButtons}>

          <button
            className="hero-book"
            onClick={() => handleClick(bannerMovie)}
            style={styles.heroBookBtn}
          >
            🎟 Book Tickets
          </button>


          <button className="hero-trailer" style={styles.heroTrailerBtn}>
            ▶ Watch Trailer
          </button>

        </div>

      </div>

    </div>

  </div>
)}
<div style={styles.sectionHeader}>

  <h2>
    Recommended Movies
  </h2>

  <button
    onClick={() => navigate("/movies")}
    style={styles.seeAllBtn}
  >
    See All →
  </button>

</div>

<div className="grid" style={styles.grid}>
{
trendingMovies.map((movie)=>(

<div
 key={movie.id}
 className="card"
 onClick={() => handleClick(movie)}
 style={styles.card}
>


<img
 src={movie.image || "/ticket-bg.jpg"}
 alt={movie.name}
 style={styles.cardImg}
/>


<div className="card-info" style={styles.cardInfo}>

<h3 style={styles.cardTitle}>
{movie.name}
</h3>


<div className="card-meta" style={styles.cardMeta}>

<span style={styles.cardRating}>
⭐ {getRating(movie)}
</span>


<span style={styles.cardCategory}>
{movie.category || "Movie"}
</span>

</div>

</div>


<button
 className="book-btn"
 onClick={(e)=>{
   e.stopPropagation();
   handleClick(movie);
 }}
 style={styles.bookBtn}
>
🎟 Book Now
</button>


</div>

))
}
</div>
     
      {loading ? (
        <div className="loading" style={styles.loading}>Loading movies... 🎥</div>
      ) : (
        <div className="grid" style={styles.grid}>
{filteredMovies.length > 0 ? (
  filteredMovies.map((movie)=>(
              <div
  key={movie.id}
  className="card"
  onClick={() => handleClick(movie)}   // 👈 aa add kar
  style={styles.card}
>
  <div
  className="heart"
  onClick={(e) => {
    e.stopPropagation();
    toggleLike(movie.id);
  }}
  style={styles.heart}
>
  {likedMovies.includes(movie.id) ? (
    <FaHeart color="#e9e9e9" size={20} />
  ) : (
    <FaRegHeart color="white" size={20} />
  )}
</div>

                <img
                  src={movie?.image || "/ticket-bg.jpg"}
                  alt={movie?.name}
                  style={styles.cardImg}
                />

                <div className="card-info" style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{movie?.name || movie?.title}</h3>
                  <div className="card-meta" style={styles.cardMeta}>
                    <span className="card-rating" style={styles.cardRating}>
                      <FaStar color="#f59e0b" size={11} />
                      {getRating(movie)}
                    </span>
                    <span style={styles.cardCategory}>{movie?.category || "Movie"}</span>
                  </div>
                </div>

              <button
  className="book-btn"
  onClick={(e) => {
    e.stopPropagation();  
    handleClick(movie);
  }}
  style={styles.bookBtn}
>
  🎟 Book Now
</button>

              </div>
            ))
          ) : (
            <div className="empty" style={styles.empty}> No movies found</div>
          )}

        </div>
      )}

      <div className="pagination" style={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} style={styles.pageBtn}>
          ← Prev
        </button>

        <span style={styles.pageLabel}>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)} style={styles.pageBtn}>
          Next →
        </button>
        
      </div>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  app: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% 0%, #1a2540 0%, #060912 55%, #030509 100%)",
    color: "#e5e9f2",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    paddingBottom: "48px",
  },

  // 👇 ADD HERE
  sectionHeader: {
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"0 32px",
    marginTop:"20px",
  },


  seeAllBtn:{
    background:"transparent",
    border:"none",
    color:"#2563eb",
    fontSize:"14px",
    fontWeight:"700",
    cursor:"pointer",
  },

  heroHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "20px 32px",
    flexWrap: "wrap",
  },

  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
    color: "#f8fafc",
  },

  search: {
    flex: 1,
    minWidth: "220px",
    maxWidth: "420px",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #2a3652",
    background: "#141e33",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
  },

  logoutBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #2a3652",
    background: "transparent",
    color: "#cbd5e1",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },

  categoryWrap: {
    display: "flex",
    gap: "10px",
    padding: "0 32px 24px",
    flexWrap: "wrap",
  },

  chip: {
    padding: "8px 18px",
    borderRadius: "999px",
    border: "1px solid #2a3652",
    background: "#141e33",
    color: "#a8b3cc",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  chipActive: {
    background: "#2563eb",
    borderColor: "#2563eb",
    color: "white",
  },

  heroBanner: {
    position: "relative",
    width: "calc(100% - 64px)",
    margin: "0 32px 32px",
    height: "360px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,.5)",
  },

  heroBannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(6,9,18,.1) 0%, rgba(6,9,18,.85) 85%)",
    display: "flex",
    alignItems: "flex-end",
    padding: "32px",
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "560px",
  },

  heroTag: {
    display: "inline-block",
    fontSize: "11px",
    letterSpacing: "2px",
    fontWeight: 700,
    color: "#f59e0b",
    textTransform: "uppercase",
  },

  heroHeading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    color: "#f8fafc",
  },

  heroDesc: {
    margin: 0,
    fontSize: "14px",
    color: "#cbd5e1",
    lineHeight: 1.5,
  },

  heroInfo: {
    fontSize: "13px",
    color: "#a8b3cc",
    fontWeight: 600,
  },

  heroButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },

  heroBookBtn: {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "white",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },

  heroTrailerBtn: {
    padding: "12px 22px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,.3)",
    background: "rgba(255,255,255,.08)",
    color: "white",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },

  loading: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#a8b3cc",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
    padding: "0 32px",
  },

  card: {
    position: "relative",
    background: "#0d1424",
    border: "1px solid #1e293b",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 12px 28px rgba(0,0,0,.4)",
  },

  heart: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 2,
    background: "rgba(0,0,0,.5)",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  cardRating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#f59e0b",
  },

  cardImg: {
    width: "100%",
    height: "230px",
    objectFit: "cover",
  },

  cardInfo: {
    padding: "12px 14px 4px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  cardCategory: {
    fontSize: "12px",
    color: "#7c8aad",
  },

  bookBtn: {
    margin: "10px 14px 14px",
    padding: "9px",
    borderRadius: "8px",
    border: "none",
    background: "#ee3939",
    color: "#06210f",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
  },

  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 20px",
    color: "#7c8aad",
    fontSize: "15px",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    marginTop: "36px",
  },

  pageBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #2a3652",
    background: "#141e33",
    color: "#f1f5f9",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },

  pageLabel: {
    fontSize: "13px",
    color: "#a8b3cc",
    fontWeight: 600,
  },
};