
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
    <header className="header">

      <div className="logo" onClick={() => navigate("/home")}>

        {open && (
          <div className="profile-menu">

            {/* Profile */}
            <div
              className="menu-item"
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              👤 Profile
            </div>

            {/* Sign Out */}
            <div
              className="menu-item logout"
              onClick={logout}
            >
              🚪 Sign Out
            </div>

          </div>
        )}
      </div>
    </header>
  );
}

