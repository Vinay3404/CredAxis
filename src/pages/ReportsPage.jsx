import React from "react";
import { fetchLoadMoneyReports, fetchPayOutReports } from "../services/paymentService";

function ReportsPage() {
  const [activeReport, setActiveReport] = React.useState("payout");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loadMoneyReports, setLoadMoneyReports] = React.useState([]);
  const [payOutReports, setPayOutReports] = React.useState([]);

  const loadReports = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [loadMoneyData, payOutData] = await Promise.all([
        fetchLoadMoneyReports(),
        fetchPayOutReports(),
      ]);
      setLoadMoneyReports(Array.isArray(loadMoneyData) ? loadMoneyData : []);
      setPayOutReports(Array.isArray(payOutData) ? payOutData : []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to fetch reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReports();
  }, [loadReports]);

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <main className="content dashboard-content premium-main">
      <section className="card reports-shell">
        <div className="reports-header-row">
          <div>
            <img src="/credaxis-wordmark.svg" className="section-wordmark" alt="CredAxis" />
            <p className="eyebrow">Reports</p>
            <h1 className="dashboard-title">Transaction Reports</h1>
            <p className="dashboard-subtitle">
              Review live load-money and payout transactions from your backend database.
            </p>
          </div>
          <button type="button" className="btn btn-outline-dark" onClick={loadReports} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <section className="reports-options-grid">
          <button
            type="button"
            className={`report-option-card ${activeReport === "payout" ? "report-option-active" : ""}`}
            onClick={() => setActiveReport("payout")}
          >
            <h3>Pay Out Reports</h3>
            <p>View payout transactions made from wallet to beneficiary bank accounts.</p>
          </button>
          <button
            type="button"
            className={`report-option-card ${activeReport === "load-money" ? "report-option-active" : ""}`}
            onClick={() => setActiveReport("load-money")}
          >
            <h3>Load Money Reports</h3>
            <p>View card-to-wallet load entries and status summaries.</p>
          </button>
        </section>

        {errorMessage ? <p className="error-text dashboard-message">{errorMessage}</p> : null}

        <section className="card report-view-card">
          {activeReport === "payout" ? (
            <>
              <h3>Pay Out Reports ({payOutReports.length})</h3>
              {payOutReports.length === 0 ? (
                <p>{isLoading ? "Loading payout reports..." : "No payout report data available."}</p>
              ) : (
                <div className="table-shell">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Phone Number</th>
                        <th>Beneficiary Name</th>
                        <th>Bank Name</th>
                        <th>IFSC Code</th>
                        <th>Amount</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payOutReports.map((row) => (
                        <tr key={row.transactionId}>
                          <td>{row.transactionId}</td>
                          <td>{row.phoneNumber}</td>
                          <td>{row.beneficiaryName}</td>
                          <td>{row.bankName}</td>
                          <td>{row.ifscCode}</td>
                          <td>{formatAmount(row.amount)}</td>
                          <td>{formatDateTime(row.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <h3>Load Money Reports ({loadMoneyReports.length})</h3>
              {loadMoneyReports.length === 0 ? (
                <p>{isLoading ? "Loading load money reports..." : "No load money report data available."}</p>
              ) : (
                <div className="table-shell">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Phone Number</th>
                        <th>Customer Name</th>
                        <th>Amount</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadMoneyReports.map((row) => (
                        <tr key={row.transactionId}>
                          <td>{row.transactionId}</td>
                          <td>{row.phoneNumber}</td>
                          <td>{row.customerName}</td>
                          <td>{formatAmount(row.amount)}</td>
                          <td>{formatDateTime(row.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default ReportsPage;
