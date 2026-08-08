import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/user/ActionMovies.css";

export default function ActionMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/moviesaction");

      // ✅ safe check
      if (Array.isArray(res.data)) {
        setMovies(res.data);
      } else {
        setMovies([]);
      }

    } catch (err) {
      console.log(err);
      setError("Failed to load movies 😢");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Action Movies...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={fetchMovies}>Retry</button>
      </div>
    );
  }

  return (
    <div className="action-container">
      <h1 className="title">🔥 Action Movies</h1>

      {movies.length === 0 ? (
        <div className="empty">No Action Movies Found 😢</div>
      ) : (
        <div className="grid">
          {movies.map((movie) => (
            <div className="card" key={movie.id}>
              <img src={movie.image} alt={movie.title} />

              <div className="overlay">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}