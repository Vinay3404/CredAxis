import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const token = localStorage.getItem("credaxis_token");

  const handleLogout = () => {
    localStorage.removeItem("credaxis_token");
    localStorage.removeItem("credaxis_user_id");
    navigate("/log-in");
  };

  return (
    <div className="page">
      <header className={isHome ? "hero-shell" : "hero-shell hero-shell-compact"}>
        <nav className="top-nav">
          <Link to="/" className="brand">
            <span className="brand-mark" />
            <span>CredAxis Pay</span>
          </Link>
          <div className="actions">
            {token ? (
              <>
                <NavLink to="/dashboard" className="btn btn-outline link-btn">
                  Dashboard
                </NavLink>
                <button type="button" className="btn btn-solid" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/sign-in" className="btn btn-outline link-btn">
                  Sign In
                </NavLink>
                <NavLink to="/log-in" className="btn btn-solid link-btn">
                  Log In
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <p>CredAxis Pay 2026. Built for secure digital payments.</p>
      </footer>
    </div>
  );
}

export default Layout;
