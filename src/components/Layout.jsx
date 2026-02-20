import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="page">
      <header className={isHome ? "hero-shell" : "hero-shell hero-shell-compact"}>
        <nav className="top-nav">
          <Link to="/" className="brand">
            <span className="brand-mark" />
            <span>CredAxis Pay</span>
          </Link>
          <div className="actions">
            <NavLink to="/sign-in" className="btn btn-outline link-btn">
              Sign In
            </NavLink>
            <NavLink to="/log-in" className="btn btn-solid link-btn">
              Log In
            </NavLink>
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
