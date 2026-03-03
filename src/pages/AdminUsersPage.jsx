import React from "react";
import {
  createAdminUser,
  fetchAdminAuditTransactions,
  fetchAdminUsers,
} from "../services/adminService";

const USER_ROLES = ["USER", "ADMIN"];
const KYC_STATUSES = ["PENDING", "VERIFIED", "REJECTED"];
const TRANSACTION_TYPES = ["ALL", "LOAD_MONEY", "PAY_OUT"];

const DEFAULT_AUDIT_SUMMARY = {
  totalTransactions: 0,
  loadMoneyCount: 0,
  payOutCount: 0,
  uniqueUsers: 0,
  totalLoadMoneyAmount: 0,
  totalPayOutAmount: 0,
  netWalletMovement: 0,
};

const DEFAULT_AUDIT_FILTERS = {
  fromDate: "",
  toDate: "",
  userId: "",
  transactionType: "ALL",
  phoneNumber: "",
  minAmount: "",
  maxAmount: "",
};

const ADMIN_PANELS = [
  {
    key: "overview",
    title: "Overview",
    description: "Quick admin summary and shortcuts.",
  },
  {
    key: "kyc",
    title: "KYC Form",
    description: "Create new users with Indian KYC data.",
  },
  {
    key: "users",
    title: "Users and IP",
    description: "View users, KYC status, and login IP records.",
  },
  {
    key: "audit",
    title: "Transactions",
    description: "Audit all load-money and payout transactions.",
  },
];

function AdminUsersPage() {
  const [activePanel, setActivePanel] = React.useState("overview");
  const [users, setUsers] = React.useState([]);
  const [auditSummary, setAuditSummary] = React.useState(DEFAULT_AUDIT_SUMMARY);
  const [auditTransactions, setAuditTransactions] = React.useState([]);
  const [isUsersLoading, setIsUsersLoading] = React.useState(false);
  const [isAuditLoading, setIsAuditLoading] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [createErrorMessage, setCreateErrorMessage] = React.useState("");
  const [auditErrorMessage, setAuditErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [auditFilters, setAuditFilters] = React.useState(DEFAULT_AUDIT_FILTERS);
  const [formValues, setFormValues] = React.useState({
    userId: "",
    password: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    dateOfBirth: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    role: "USER",
    kycStatus: "VERIFIED",
  });

  const loadUsers = React.useCallback(async () => {
    setIsUsersLoading(true);
    setCreateErrorMessage("");
    try {
      const response = await fetchAdminUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      setCreateErrorMessage(error.message || "Unable to fetch users.");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  const loadAudit = React.useCallback(async (filters = DEFAULT_AUDIT_FILTERS) => {
    setIsAuditLoading(true);
    setAuditErrorMessage("");
    try {
      const response = await fetchAdminAuditTransactions(filters);
      setAuditSummary(response?.summary || DEFAULT_AUDIT_SUMMARY);
      setAuditTransactions(Array.isArray(response?.transactions) ? response.transactions : []);
    } catch (error) {
      setAuditErrorMessage(error.message || "Unable to fetch transaction audit.");
    } finally {
      setIsAuditLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
    loadAudit(DEFAULT_AUDIT_FILTERS);
  }, [loadUsers, loadAudit]);

  const handleCreateUserChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "panNumber" ? value.toUpperCase() : value,
    }));
  };

  const handleAuditFilterChange = (event) => {
    const { name, value } = event.target;
    setAuditFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUserSubmit = async (event) => {
    event.preventDefault();
    setCreateErrorMessage("");
    setSuccessMessage("");
    setIsCreating(true);
    try {
      await createAdminUser(formValues);
      setSuccessMessage("User created successfully with KYC data.");
      setFormValues({
        userId: "",
        password: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        panNumber: "",
        aadhaarNumber: "",
        dateOfBirth: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        role: "USER",
        kycStatus: "VERIFIED",
      });
      await loadUsers();
    } catch (error) {
      setCreateErrorMessage(error.message || "Unable to create user.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleApplyAuditFilters = async (event) => {
    event.preventDefault();
    await loadAudit(auditFilters);
  };

  const handleResetAuditFilters = async () => {
    setAuditFilters(DEFAULT_AUDIT_FILTERS);
    await loadAudit(DEFAULT_AUDIT_FILTERS);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsed);
  };

  const formatAmount = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatCoordinates = (latitude, longitude) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return "-";
    }
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  };

  const buildMapUrl = (latitude, longitude) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return "";
    }
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const kycVerifiedCount = users.filter((user) => user.kycStatus === "VERIFIED").length;
  const kycPendingCount = users.filter((user) => user.kycStatus === "PENDING").length;

  return (
    <main className="content dashboard-content premium-main">
      <section className="card admin-shell">
        <div className="reports-header-row">
          <div>
            <img src="/credaxis-wordmark.svg" className="section-wordmark" alt="CredAxis" />
            <p className="eyebrow">Admin Console</p>
            <h1 className="dashboard-title">User, KYC and Transaction Audit</h1>
            <p className="dashboard-subtitle">
              Use the options below to open only the section you want and avoid long scrolling.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={async () => {
              await loadUsers();
              await loadAudit(auditFilters);
            }}
            disabled={isUsersLoading || isAuditLoading}
          >
            {isUsersLoading || isAuditLoading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        <section className="admin-option-grid">
          {ADMIN_PANELS.map((panel) => (
            <button
              key={panel.key}
              type="button"
              className={`admin-option-card ${activePanel === panel.key ? "admin-option-active" : ""}`}
              onClick={() => setActivePanel(panel.key)}
            >
              <h3>{panel.title}</h3>
              <p>{panel.description}</p>
            </button>
          ))}
        </section>

        {activePanel === "overview" ? (
          <section className="card admin-panel-card">
            <h3>Overview</h3>
            <section className="admin-overview-grid">
              <article className="card admin-overview-card">
                <p>Total Users</p>
                <h3>{users.length}</h3>
              </article>
              <article className="card admin-overview-card">
                <p>KYC Verified</p>
                <h3>{kycVerifiedCount}</h3>
              </article>
              <article className="card admin-overview-card">
                <p>KYC Pending</p>
                <h3>{kycPendingCount}</h3>
              </article>
              <article className="card admin-overview-card">
                <p>Total Transactions</p>
                <h3>{auditSummary.totalTransactions}</h3>
              </article>
              <article className="card admin-overview-card">
                <p>Total Load Money</p>
                <h3>{formatAmount(auditSummary.totalLoadMoneyAmount)}</h3>
              </article>
              <article className="card admin-overview-card">
                <p>Total Pay Out</p>
                <h3>{formatAmount(auditSummary.totalPayOutAmount)}</h3>
              </article>
            </section>
            <div className="admin-section-actions">
              <button type="button" className="btn btn-solid" onClick={() => setActivePanel("kyc")}>
                Go To KYC Form
              </button>
              <button type="button" className="btn btn-outline-dark" onClick={() => setActivePanel("users")}>
                Go To Users and IP
              </button>
              <button type="button" className="btn btn-outline-dark" onClick={() => setActivePanel("audit")}>
                Go To Transactions
              </button>
            </div>
          </section>
        ) : null}

        {activePanel === "kyc" ? (
          <section className="card admin-form-card admin-panel-card">
            <h3>Create New User (KYC)</h3>
            <form className="auth-form" onSubmit={handleCreateUserSubmit}>
              <div className="admin-grid-3">
                <div>
                  <label htmlFor="admin-user-id">User ID</label>
                  <input id="admin-user-id" name="userId" value={formValues.userId} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-password">Password</label>
                  <input id="admin-password" name="password" type="password" value={formValues.password} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-full-name">Full Name</label>
                  <input id="admin-full-name" name="fullName" value={formValues.fullName} onChange={handleCreateUserChange} required />
                </div>
              </div>

              <div className="admin-grid-3">
                <div>
                  <label htmlFor="admin-email">Email</label>
                  <input id="admin-email" name="email" type="email" value={formValues.email} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-phone">Phone Number</label>
                  <input id="admin-phone" name="phoneNumber" inputMode="numeric" maxLength={10} value={formValues.phoneNumber} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-dob">Date of Birth</label>
                  <input id="admin-dob" name="dateOfBirth" type="date" value={formValues.dateOfBirth} onChange={handleCreateUserChange} required />
                </div>
              </div>

              <div className="admin-grid-3">
                <div>
                  <label htmlFor="admin-pan">PAN Number</label>
                  <input id="admin-pan" name="panNumber" value={formValues.panNumber} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-aadhaar">Aadhaar Number</label>
                  <input id="admin-aadhaar" name="aadhaarNumber" inputMode="numeric" maxLength={12} value={formValues.aadhaarNumber} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-pincode">Pincode</label>
                  <input id="admin-pincode" name="pincode" inputMode="numeric" maxLength={6} value={formValues.pincode} onChange={handleCreateUserChange} required />
                </div>
              </div>

              <div className="admin-grid-3">
                <div>
                  <label htmlFor="admin-address">Address</label>
                  <input id="admin-address" name="addressLine1" value={formValues.addressLine1} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-city">City</label>
                  <input id="admin-city" name="city" value={formValues.city} onChange={handleCreateUserChange} required />
                </div>
                <div>
                  <label htmlFor="admin-state">State</label>
                  <input id="admin-state" name="state" value={formValues.state} onChange={handleCreateUserChange} required />
                </div>
              </div>

              <div className="admin-grid-3">
                <div>
                  <label htmlFor="admin-role">Role</label>
                  <select id="admin-role" name="role" value={formValues.role} onChange={handleCreateUserChange} required>
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="admin-kyc-status">KYC Status</label>
                  <select id="admin-kyc-status" name="kycStatus" value={formValues.kycStatus} onChange={handleCreateUserChange} required>
                    {KYC_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-submit-cell">
                  <button type="submit" className="btn btn-solid" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create User"}
                  </button>
                </div>
              </div>
            </form>
            {successMessage ? <p className="success-text dashboard-message">{successMessage}</p> : null}
            {createErrorMessage ? <p className="error-text dashboard-message">{createErrorMessage}</p> : null}
          </section>
        ) : null}

        {activePanel === "users" ? (
          <section className="card report-view-card admin-panel-card">
            <h3>Users and Login IP Tracking ({users.length})</h3>
            <div className="table-shell">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Full Name</th>
                    <th>KYC Status</th>
                    <th>Phone</th>
                    <th>PAN</th>
                    <th>Last Login IP</th>
                    <th>Last Login Location</th>
                    <th>Coordinates</th>
                    <th>Map</th>
                    <th>Last Login Time</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={11}>{isUsersLoading ? "Loading users..." : "No users found."}</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.userId}</td>
                        <td>{user.role}</td>
                        <td>{user.fullName}</td>
                        <td>{user.kycStatus}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.panNumber}</td>
                        <td>{user.lastLoginIp || "-"}</td>
                        <td>
                          {[user.lastLoginCity, user.lastLoginRegion, user.lastLoginCountry]
                            .filter((value) => value && value.trim() !== "")
                            .join(", ") || "-"}
                        </td>
                        <td>{formatCoordinates(user.lastLoginLatitude, user.lastLoginLongitude)}</td>
                        <td>
                          {buildMapUrl(user.lastLoginLatitude, user.lastLoginLongitude) ? (
                            <a
                              href={buildMapUrl(user.lastLoginLatitude, user.lastLoginLongitude)}
                              className="map-link"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open Map
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{formatDateTime(user.lastLoginAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {activePanel === "audit" ? (
          <>
            <section className="card report-view-card admin-panel-card">
              <h3>Transaction Audit Filters</h3>
              <form className="audit-filter-grid" onSubmit={handleApplyAuditFilters}>
                <div>
                  <label htmlFor="audit-from-date">From Date</label>
                  <input id="audit-from-date" name="fromDate" type="date" value={auditFilters.fromDate} onChange={handleAuditFilterChange} />
                </div>
                <div>
                  <label htmlFor="audit-to-date">To Date</label>
                  <input id="audit-to-date" name="toDate" type="date" value={auditFilters.toDate} onChange={handleAuditFilterChange} />
                </div>
                <div>
                  <label htmlFor="audit-user-id">User</label>
                  <select id="audit-user-id" name="userId" value={auditFilters.userId} onChange={handleAuditFilterChange}>
                    <option value="">All Users</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.userId}>
                        {user.userId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="audit-transaction-type">Transaction Type</label>
                  <select id="audit-transaction-type" name="transactionType" value={auditFilters.transactionType} onChange={handleAuditFilterChange}>
                    {TRANSACTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="audit-phone-number">Phone Number</label>
                  <input id="audit-phone-number" name="phoneNumber" value={auditFilters.phoneNumber} onChange={handleAuditFilterChange} />
                </div>
                <div>
                  <label htmlFor="audit-min-amount">Min Amount</label>
                  <input id="audit-min-amount" name="minAmount" type="number" min="0" step="0.01" value={auditFilters.minAmount} onChange={handleAuditFilterChange} />
                </div>
                <div>
                  <label htmlFor="audit-max-amount">Max Amount</label>
                  <input id="audit-max-amount" name="maxAmount" type="number" min="0" step="0.01" value={auditFilters.maxAmount} onChange={handleAuditFilterChange} />
                </div>
                <div className="audit-filter-actions">
                  <button type="submit" className="btn btn-solid" disabled={isAuditLoading}>
                    {isAuditLoading ? "Applying..." : "Apply Filters"}
                  </button>
                  <button type="button" className="btn btn-outline-dark" onClick={handleResetAuditFilters} disabled={isAuditLoading}>
                    Reset
                  </button>
                </div>
              </form>
              {auditErrorMessage ? <p className="error-text dashboard-message">{auditErrorMessage}</p> : null}
            </section>

            <section className="audit-summary-grid">
              <article className="card audit-summary-card">
                <p>Total Txns</p>
                <h3>{auditSummary.totalTransactions}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Load Money Count</p>
                <h3>{auditSummary.loadMoneyCount}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Pay Out Count</p>
                <h3>{auditSummary.payOutCount}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Unique Users</p>
                <h3>{auditSummary.uniqueUsers}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Total Load Money</p>
                <h3>{formatAmount(auditSummary.totalLoadMoneyAmount)}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Total Pay Out</p>
                <h3>{formatAmount(auditSummary.totalPayOutAmount)}</h3>
              </article>
              <article className="card audit-summary-card">
                <p>Net Movement</p>
                <h3>{formatAmount(auditSummary.netWalletMovement)}</h3>
              </article>
            </section>

            <section className="card report-view-card admin-panel-card">
              <h3>Transaction Ledger ({auditTransactions.length})</h3>
              <div className="table-shell">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date Time</th>
                      <th>Type</th>
                      <th>Txn ID</th>
                      <th>User ID</th>
                      <th>Phone</th>
                      <th>Party Name</th>
                      <th>Bank</th>
                      <th>IFSC</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={9}>{isAuditLoading ? "Loading transactions..." : "No transaction data for selected filters."}</td>
                      </tr>
                    ) : (
                      auditTransactions.map((item) => (
                        <tr key={`${item.transactionType}-${item.transactionId}-${item.createdAt}`}>
                          <td>{formatDateTime(item.createdAt)}</td>
                          <td>{item.transactionType}</td>
                          <td>{item.transactionId}</td>
                          <td>{item.userId}</td>
                          <td>{item.phoneNumber}</td>
                          <td>{item.partyName}</td>
                          <td>{item.bankName || "-"}</td>
                          <td>{item.ifscCode || "-"}</td>
                          <td>{formatAmount(item.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default AdminUsersPage;
