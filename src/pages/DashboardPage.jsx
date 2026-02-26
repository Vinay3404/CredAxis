import React from "react";
import {
  fetchWalletSummary,
  submitLoadMoney,
  submitPayOut,
} from "../services/paymentService";

function DashboardPage() {
  const userId = localStorage.getItem("credaxis_user_id") || "User";
  const [activeForm, setActiveForm] = React.useState("load-money");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(false);
  const [walletSummary, setWalletSummary] = React.useState({
    totalLoadedAmount: 0,
    totalPayOutAmount: 0,
    availableWalletBalance: 0,
  });

  const [loadMoneyForm, setLoadMoneyForm] = React.useState({
    phoneNumber: "",
    name: "",
    amount: "",
  });

  const [payOutForm, setPayOutForm] = React.useState({
    phoneNumber: "",
    bankName: "",
    ifscCode: "",
    beneficiaryName: "",
    amount: "",
  });

  const loadWalletSummary = React.useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const response = await fetchWalletSummary();
      setWalletSummary(response);
    } catch (error) {
      setErrorMessage(error.message || "Unable to fetch wallet balance.");
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadWalletSummary();
  }, [loadWalletSummary]);

  const handleLoadMoneyChange = (event) => {
    const { name, value } = event.target;
    setLoadMoneyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayOutChange = (event) => {
    const { name, value } = event.target;
    setPayOutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadMoneySubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await submitLoadMoney({
        ...loadMoneyForm,
        amount: Number(loadMoneyForm.amount),
      });
      setSuccessMessage(response.message || "Load money request submitted successfully.");
      setLoadMoneyForm({
        phoneNumber: "",
        name: "",
        amount: "",
      });
      await loadWalletSummary();
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit load money request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOutSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await submitPayOut({
        ...payOutForm,
        amount: Number(payOutForm.amount),
      });
      setSuccessMessage(response.message || "Pay out request submitted successfully.");
      setPayOutForm({
        phoneNumber: "",
        bankName: "",
        ifscCode: "",
        beneficiaryName: "",
        amount: "",
      });
      await loadWalletSummary();
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit pay out request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <main className="content dashboard-content premium-main">
      <section className="dashboard-header card ops-header">
        <p className="eyebrow">Operations Console</p>
        <h1 className="dashboard-title">Wallet & Payout Control Center</h1>
        <p className="dashboard-subtitle">
          Logged in as <strong>{userId}</strong>. Manage your secure
          credit-card withdrawals and bank payouts from one place.
        </p>
      </section>

      <section className="wallet-metrics">
        <article className="card metric-card metric-primary">
          <p>Available Wallet Balance</p>
          <h3>
            {isSummaryLoading
              ? "Loading..."
              : formatAmount(walletSummary.availableWalletBalance)}
          </h3>
        </article>
        <article className="card metric-card">
          <p>Total Card Withdrawn</p>
          <h3>{isSummaryLoading ? "Loading..." : formatAmount(walletSummary.totalLoadedAmount)}</h3>
        </article>
        <article className="card metric-card">
          <p>Total Sent to Bank</p>
          <h3>{isSummaryLoading ? "Loading..." : formatAmount(walletSummary.totalPayOutAmount)}</h3>
        </article>
      </section>

      <section className="dashboard-actions dashboard-tabs">
        <button
          type="button"
          className={`btn ${activeForm === "load-money" ? "btn-solid" : "btn-outline-dark"}`}
          onClick={() => {
            setActiveForm("load-money");
            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          Load Money (Card to Wallet)
        </button>
        <button
          type="button"
          className={`btn ${activeForm === "pay-out" ? "btn-solid" : "btn-outline-dark"}`}
          onClick={() => {
            setActiveForm("pay-out");
            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          Pay Out (Wallet to Bank)
        </button>
      </section>

      {activeForm === "load-money" ? (
        <section className="auth-card dashboard-form-card ops-form-card">
          <h2 className="auth-title">Load Money: Credit Card to Wallet</h2>
          <p className="auth-subtitle">
            Capture withdrawal amount and credit it into your operational wallet.
          </p>
          <form className="auth-form" onSubmit={handleLoadMoneySubmit}>
            <label htmlFor="load-phone-number">Phone Number</label>
            <input
              id="load-phone-number"
              name="phoneNumber"
              type="tel"
              placeholder="Enter phone number"
              value={loadMoneyForm.phoneNumber}
              onChange={handleLoadMoneyChange}
              required
            />

            <label htmlFor="load-name">Name</label>
            <input
              id="load-name"
              name="name"
              type="text"
              placeholder="Enter name"
              value={loadMoneyForm.name}
              onChange={handleLoadMoneyChange}
              required
            />

            <label htmlFor="load-amount">Amount</label>
            <input
              id="load-amount"
              name="amount"
              type="number"
              min="1"
              placeholder="Enter amount"
              value={loadMoneyForm.amount}
              onChange={handleLoadMoneyChange}
              required
            />

            <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Load Money"}
            </button>
          </form>
        </section>
      ) : (
        <section className="auth-card dashboard-form-card ops-form-card">
          <h2 className="auth-title">Pay Out: Wallet to Bank Account</h2>
          <p className="auth-subtitle">
            Send available wallet funds to a beneficiary bank account.
          </p>
          <form className="auth-form" onSubmit={handlePayOutSubmit}>
            <label htmlFor="payout-phone-number">Phone Number</label>
            <input
              id="payout-phone-number"
              name="phoneNumber"
              type="tel"
              placeholder="Enter phone number"
              value={payOutForm.phoneNumber}
              onChange={handlePayOutChange}
              required
            />

            <label htmlFor="payout-bank-name">Bank Name</label>
            <input
              id="payout-bank-name"
              name="bankName"
              type="text"
              placeholder="Enter bank name"
              value={payOutForm.bankName}
              onChange={handlePayOutChange}
              required
            />

            <label htmlFor="payout-ifsc-code">IFSC Code</label>
            <input
              id="payout-ifsc-code"
              name="ifscCode"
              type="text"
              placeholder="Enter IFSC code"
              value={payOutForm.ifscCode}
              onChange={handlePayOutChange}
              required
            />

            <label htmlFor="payout-beneficiary-name">Beneficiary Name</label>
            <input
              id="payout-beneficiary-name"
              name="beneficiaryName"
              type="text"
              placeholder="Enter beneficiary name"
              value={payOutForm.beneficiaryName}
              onChange={handlePayOutChange}
              required
            />

            <label htmlFor="payout-amount">Amount</label>
            <input
              id="payout-amount"
              name="amount"
              type="number"
              min="1"
              placeholder="Enter payout amount"
              value={payOutForm.amount}
              onChange={handlePayOutChange}
              required
            />

            <button type="submit" className="btn btn-solid" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Pay Out"}
            </button>
          </form>
        </section>
      )}

      {successMessage ? <p className="success-text dashboard-message">{successMessage}</p> : null}
      {errorMessage ? <p className="error-text dashboard-message">{errorMessage}</p> : null}
    </main>
  );
}

export default DashboardPage;
