import React from "react";

export default function TopMovies({ movies = [] }) {
  return (
    <div>
      <h3>Top Movies</h3>
      {movies.map((m, i) => (
        <div key={i}>⭐ {m}</div>
      ))}
    </div>
  );
}