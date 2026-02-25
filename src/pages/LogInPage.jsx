import React from "react";
import { logIn } from "../services/authService";

function LogInPage() {
  const [formValues, setFormValues] = React.useState({
    userId: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await logIn(formValues);
      localStorage.setItem("credaxis_token", response.token);
      localStorage.setItem("credaxis_user_id", response.userId);
      setSuccessMessage("Login successful");
    } catch (error) {
      setErrorMessage(error.message || "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
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
            name="userId"
            type="text"
            placeholder="Enter user ID"
            autoComplete="username"
            value={formValues.userId}
            onChange={handleChange}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={formValues.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>
        {successMessage ? <p className="success-text auth-error">{successMessage}</p> : null}
        {errorMessage ? <p className="error-text auth-error">{errorMessage}</p> : null}
      </section>
    </main>
  );
}

export default LogInPage;
