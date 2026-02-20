import React from "react";
import { Link } from "react-router-dom";

function ContactAdminPage() {
  return (
    <main className="content auth-content">
      <section className="auth-card admin-notice-card">
        <h1 className="auth-title">Access Restricted</h1>
        <p className="auth-subtitle">
          Payments onboarding is currently managed by administrators.
        </p>
        <p className="error-text auth-error">pls contact administrator</p>
        <Link to="/" className="btn btn-solid link-btn">
          Back To Home
        </Link>
      </section>
    </main>
  );
}

export default ContactAdminPage;
