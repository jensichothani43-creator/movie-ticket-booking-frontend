import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {

    // JWT token delete
    localStorage.removeItem("token");

    // redirect login page
    navigate("/login");
  };


  return (
    <header className="top-header">

      <h2 className="logo">
        🎬 MovieHub
      </h2>


      <div className="profile">

        <button
          className="profile-btn"
          onClick={() => setOpen(!open)}
        >
          👤 Account ▾
        </button>


        {open && (
          <div className="profile-menu">



            {open && (
  <div className="profile-menu">

    <div
      className="menu-item"
      onClick={() => navigate("/profile")}
    >
      👤 My Profile
    </div>


    <div
      className="menu-item"
      onClick={() => navigate("/my-bookings")}
    >
      🎟 My Bookings
    </div>


    <div
      className="menu-item logout"
      onClick={logout}
    >
      🚪 Sign Out
    </div>

  </div>
)}
          </div>
        )}

      </div>

    </header>
  );
}