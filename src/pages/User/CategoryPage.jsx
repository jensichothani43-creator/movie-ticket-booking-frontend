import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function CategoryPage() {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/movies");

      const filtered = res.data.filter((m) =>
        category === "All"
          ? true
          : m.category === category
      );

      setMovies(filtered);
    };

    fetchData();
  }, [category]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{category} Movies</h2>

      {movies.map((m) => (
        <div key={m.id}>
          {m.name}
        </div>
      ))}
    </div>
  );
}