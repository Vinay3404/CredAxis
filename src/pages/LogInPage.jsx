import React from "react";

function LogInPage() {
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("pls contact administrator");
  };

  return (
    <main className="content auth-content">
      <section className="auth-card">
        <h1 className="auth-title">Log In</h1>
        <p className="auth-subtitle">
          Enter your credentials to access your payments dashboard.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-userid">User ID</label>
          <input
            id="login-userid"
            type="text"
            placeholder="Enter user ID"
            autoComplete="username"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-solid">
            Log In
          </button>
        </form>
        {errorMessage ? <p className="error-text auth-error">{errorMessage}</p> : null}
      </section>
    </main>
  );
}

export default LogInPage;
