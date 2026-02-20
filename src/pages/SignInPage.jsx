import React from "react";
import { Link } from "react-router-dom";

function SignInPage() {
  return (
    <main className="content auth-content">
      <section className="auth-card admin-notice-card">
        <h1 className="auth-title">Sign In Disabled</h1>
        <p className="auth-subtitle">
          Account access is enabled only through your platform administrator.
        </p>
        <p className="error-text auth-error">pls contact administrator</p>
        <Link to="/contact-admin" className="btn btn-solid link-btn">
          Contact Admin
        </Link>
      </section>
    </main>
  );
}

export default SignInPage;
