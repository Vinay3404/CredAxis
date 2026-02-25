import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <section className="hero content">
        <p className="eyebrow">Digital Payments Platform</p>
        <h1 className="hero-title">Fast, Secure, and Scalable Payment Experiences</h1>
        <p className="subtitle">
          Build reliable checkout flows, automate settlements, and monitor
          every transaction in real time.
        </p>
        <div className="hero-buttons">
          <Link to="/log-in" className="btn btn-solid link-btn">
            Start Payments
          </Link>
          <a href="#features" className="btn btn-outline-light link-btn">
            See Features
          </a>
        </div>
      </section>

      <main id="features" className="content content-main">
        <section className="card">
          <h2>Why Payment Teams Choose CredAxis</h2>
          <p>
            Unified APIs for cards, wallets, bank transfers, and fast
            settlements with built-in controls.
          </p>
        </section>
        <section className="card-grid">
          <article className="card">
            <h3>Smart Checkout</h3>
            <p>Optimize conversion with low-latency, mobile-first payment UI.</p>
          </article>
          <article className="card">
            <h3>Secure Processing</h3>
            <p>
              Built-in tokenization and adaptive risk checks for safer payments.
            </p>
          </article>
          <article className="card">
            <h3>Live Insights</h3>
            <p>
              Track transaction health, success rates, and payout status in one
              dashboard.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}

export default HomePage;
