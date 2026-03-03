import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const isAuthPage = pathname === "/sign-in" || pathname === "/log-in";
  const token = localStorage.getItem("credaxis_token");
  const role = localStorage.getItem("credaxis_role");
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("credaxis_token");
    localStorage.removeItem("credaxis_user_id");
    localStorage.removeItem("credaxis_role");
    localStorage.removeItem("credaxis_kyc_status");
    localStorage.removeItem("credaxis_login_ip");
    navigate("/log-in");
  };

  return (
    <div className="page">
      <header className={isHome ? "hero-shell" : "hero-shell hero-shell-compact"}>
        <nav className="top-nav">
          <Link to="/" className="brand">
            <img src="/credaxis-logo.svg" className="brand-logo" alt="CredAxis logo" />
            <span>CredAxis Gateway</span>
          </Link>
          <div className="actions">
            {token ? (
              <>
                <NavLink to="/dashboard" className="btn btn-outline link-btn">
                  Dashboard
                </NavLink>
                <NavLink to="/reports" className="btn btn-outline link-btn">
                  Reports
                </NavLink>
                {isAdmin ? (
                  <NavLink to="/admin/users" className="btn btn-outline link-btn">
                    Admin
                  </NavLink>
                ) : null}
                <button type="button" className="btn btn-solid" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : isAuthPage ? (
              <NavLink to="/" className="btn btn-solid link-btn">
                Home
              </NavLink>
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
        <div className="footer-brand">
          <img src="/credaxis-logo.svg" className="footer-logo" alt="CredAxis logo" />
          <p>CredAxis 2026. Built for secure digital payments.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
