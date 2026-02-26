import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <section className="hero content premium-hero">
        <div className="hero-badge">Enterprise Withdrawals Platform</div>
        <h1 className="hero-title">
          Withdraw From Credit Cards, Fund Wallets, and Payout to Bank Accounts
        </h1>
        <p className="subtitle">
          CredAxis helps operations teams move funds in a controlled flow:
          Card to Wallet, then Wallet to Beneficiary Bank Account, with complete
          visibility and traceability.
        </p>
        <div className="hero-buttons">
          <Link to="/log-in" className="btn btn-solid link-btn">
            Open Operations Console
          </Link>
          <a href="#flow" className="btn btn-outline-light link-btn">
            View Transaction Flow
          </a>
        </div>
      </section>

      <main id="features" className="content content-main premium-main">
        <section id="flow" className="flow-strip card">
          <div className="flow-step">
            <h3>1. Card Withdrawal</h3>
            <p>Capture approved withdrawal amount from customer credit card.</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <h3>2. Wallet Credit</h3>
            <p>Instantly reflect collected funds in your platform wallet.</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <h3>3. Bank Pay Out</h3>
            <p>Transfer wallet balance to beneficiary bank account securely.</p>
          </div>
        </section>

        <section className="card-grid premium-grid">
          <article className="card premium-card">
            <h3>Operational Wallet Ledger</h3>
            <p>
              Track available wallet balance in real-time with clear loaded and
              paid-out totals.
            </p>
          </article>
          <article className="card premium-card">
            <h3>Banking-Grade Data Capture</h3>
            <p>
              Structured forms for payout operations including IFSC, bank, and
              beneficiary details.
            </p>
          </article>
          <article className="card premium-card">
            <h3>Role-Ready Foundation</h3>
            <p>
              Built to extend into admin approvals, role-based access control,
              and audit workflows.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}

export default HomePage;
