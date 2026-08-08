import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/sidebar.css";

function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const go = (key, path) => {
    setActive(key);
    navigate(path);
  };

  return (
    <aside className="sidebar">

      <div className="menu-group">
      
        <button className={active === "dashboard" ? "active" : ""} onClick={() => go("dashboard", "/admin")}>
          Dashboard
        </button>
      </div>

      <div className="menu-group">
        
        <button className={active === "movies" ? "active" : ""} onClick={() => go("movies", "/admin/movies")}>
          Movies
        </button>

        <button className={active === "screens" ? "active" : ""} onClick={() => go("screens", "/admin/screens")}>
          Screens
        </button>

        <button className={active === "shows" ? "active" : ""} onClick={() => go("shows", "/admin/shows")}>
          Shows
        </button>
      </div>

      <div className="menu-group">
        
        <button className={active === "offers" ? "active" : ""} onClick={() => go("offers", "/admin/offers")}>
          Offers
        </button>

        <button className={active === "users" ? "active" : ""} onClick={() => go("users", "/admin/users")}>
          Users
        </button>
      </div>

      

    </aside>
  );
}

export default Sidebar;
