import React from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchWalletSummary,
  submitLoadMoney,
  submitPayOut,
  validateBeneficiaryAccount,
} from "../services/paymentService";

const INDIAN_BANKS = [
  { name: "State Bank of India", ifsc: "SBIN0000001" },
  { name: "HDFC Bank", ifsc: "HDFC0000001" },
  { name: "ICICI Bank", ifsc: "ICIC0000001" },
  { name: "Axis Bank", ifsc: "UTIB0000001" },
  { name: "Punjab National Bank", ifsc: "PUNB0000001" },
  { name: "Bank of Baroda", ifsc: "BARB0MAINXX" },
  { name: "Canara Bank", ifsc: "CNRB0000001" },
  { name: "Union Bank of India", ifsc: "UBIN0000001" },
  { name: "Bank of India", ifsc: "BKID0000001" },
  { name: "Indian Bank", ifsc: "IDIB000M001" },
  { name: "Indian Overseas Bank", ifsc: "IOBA0000001" },
  { name: "UCO Bank", ifsc: "UCBA0000001" },
  { name: "Bank of Maharashtra", ifsc: "MAHB0000001" },
  { name: "Central Bank of India", ifsc: "CBIN0280001" },
  { name: "Punjab and Sind Bank", ifsc: "PSIB0000001" },
  { name: "IDBI Bank", ifsc: "IBKL0000001" },
  { name: "Kotak Mahindra Bank", ifsc: "KKBK0000001" },
  { name: "IndusInd Bank", ifsc: "INDB0000001" },
  { name: "Yes Bank", ifsc: "YESB0000001" },
  { name: "Federal Bank", ifsc: "FDRL0000001" },
  { name: "South Indian Bank", ifsc: "SIBL0000001" },
  { name: "RBL Bank", ifsc: "RATN0000001" },
  { name: "IDFC FIRST Bank", ifsc: "IDFB0080001" },
  { name: "AU Small Finance Bank", ifsc: "AUBL0002001" },
  { name: "Bandhan Bank", ifsc: "BDBL0000001" },
  { name: "CSB Bank", ifsc: "CSBK0000001" },
  { name: "DCB Bank", ifsc: "DCBL0000001" },
  { name: "Dhanlaxmi Bank", ifsc: "DLXB0000001" },
  { name: "Jammu and Kashmir Bank", ifsc: "JAKA0CANTON" },
  { name: "Karnataka Bank", ifsc: "KARB0000001" },
  { name: "Karur Vysya Bank", ifsc: "KVBL0000001" },
  { name: "Nainital Bank", ifsc: "NTBL0DEL048" },
  { name: "Tamilnad Mercantile Bank", ifsc: "TMBL0000001" },
  { name: "City Union Bank", ifsc: "CIUB0000001" },
  { name: "DBS Bank India", ifsc: "DBSS0IN0811" },
  { name: "Deutsche Bank", ifsc: "DEUT0784PBC" },
  { name: "HSBC India", ifsc: "HSBC0400002" },
  { name: "Standard Chartered Bank", ifsc: "SCBL0036001" },
  { name: "Citi Bank", ifsc: "CITI0000001" },
  { name: "Bank of America", ifsc: "BOFA0MM6205" },
  { name: "Barclays Bank", ifsc: "BARB0BARC01" },
  { name: "BNP Paribas", ifsc: "BNPA0009001" },
  { name: "Credit Agricole", ifsc: "CRLY0000001" },
  { name: "Doha Bank", ifsc: "DOHB0000001" },
  { name: "Emirates NBD", ifsc: "EBIL0000001" },
  { name: "First Abu Dhabi Bank", ifsc: "NBAD0000001" },
  { name: "Mizuho Bank", ifsc: "MHCB0000001" },
  { name: "MUFG Bank", ifsc: "BOTK0IN0XXX" },
  { name: "Riyad Bank", ifsc: "RIYA0000001" },
  { name: "Shinhan Bank", ifsc: "SHBK0000001" },
  { name: "Societe Generale", ifsc: "SOGE0INBB00" },
  { name: "Sumitomo Mitsui Banking Corporation", ifsc: "SMBC0100001" },
  { name: "Jio Payments Bank", ifsc: "JIOP0000001" },
  { name: "Airtel Payments Bank", ifsc: "AIRP0000001" },
  { name: "India Post Payments Bank", ifsc: "IPOS0000001" },
  { name: "Fino Payments Bank", ifsc: "FINO0000001" },
  { name: "Paytm Payments Bank", ifsc: "PYTM0123456" },
  { name: "NSDL Payments Bank", ifsc: "NSDL0000001" },
  { name: "Ujjivan Small Finance Bank", ifsc: "UJVN0000001" },
  { name: "Equitas Small Finance Bank", ifsc: "ESFB0000001" },
  { name: "Jana Small Finance Bank", ifsc: "JSFB0000001" },
  { name: "Suryoday Small Finance Bank", ifsc: "SURY0000001" },
  { name: "North East Small Finance Bank", ifsc: "NESF0000001" },
  { name: "ESAF Small Finance Bank", ifsc: "ESMF0000001" },
  { name: "Utkarsh Small Finance Bank", ifsc: "UTKS0000001" },
  { name: "Shivalik Small Finance Bank", ifsc: "SSFB0000001" },
  { name: "Capital Small Finance Bank", ifsc: "CLBL0000001" },
  { name: "Saraswat Co-operative Bank", ifsc: "SRCB0000001" },
  { name: "Cosmos Co-operative Bank", ifsc: "COSB0000001" },
  { name: "Abhyudaya Co-operative Bank", ifsc: "ABHY0065001" },
  { name: "Janata Sahakari Bank", ifsc: "JSBP0000001" },
  { name: "Mehsana Urban Co-operative Bank", ifsc: "MSNU0000001" },
  { name: "Dombivli Nagari Sahakari Bank", ifsc: "DNSB0000001" },
  { name: "TJSB Sahakari Bank", ifsc: "TJSB0000001" },
  { name: "Kalupur Commercial Co-operative Bank", ifsc: "KCCB0KALUPR" },
  { name: "Bassein Catholic Co-operative Bank", ifsc: "BCCB0000001" },
  { name: "Bombay Mercantile Co-operative Bank", ifsc: "BMCB0000001" },
];

const BANK_IFSC_MAP = INDIAN_BANKS.reduce((acc, bank) => {
  acc[bank.name] = bank.ifsc;
  return acc;
}, {});

function DashboardPage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmittingLoadMoney, setIsSubmittingLoadMoney] = React.useState(false);
  const [isSubmittingPayOut, setIsSubmittingPayOut] = React.useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(false);
  const [isValidatingBeneficiary, setIsValidatingBeneficiary] = React.useState(false);
  const [validatedAccountName, setValidatedAccountName] = React.useState("");

  const [walletSummary, setWalletSummary] = React.useState({
    totalLoadedAmount: 0,
    totalPayOutAmount: 0,
    availableWalletBalance: 0,
  });

  const [loadMoneyForm, setLoadMoneyForm] = React.useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: "",
  });

  const [payOutForm, setPayOutForm] = React.useState({
    bankName: "",
    ifscCode: "",
    beneficiaryName: "",
    amount: "",
    beneficiaryAccountNumber: "",
  });

  const loadWalletSummary = React.useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const response = await fetchWalletSummary();
      setWalletSummary(response);
    } catch (error) {
      setErrorMessage(error.message || "Unable to fetch wallet summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadWalletSummary();
  }, [loadWalletSummary]);

  const openModal = (modalType) => {
    setSuccessMessage("");
    setErrorMessage("");
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLoadMoneyChange = (event) => {
    const { name, value } = event.target;
    setLoadMoneyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayOutChange = (event) => {
    const { name, value } = event.target;
    setPayOutForm((prev) => {
      if (name === "bankName") {
        return {
          ...prev,
          bankName: value,
          ifscCode: value ? BANK_IFSC_MAP[value] || "" : "",
        };
      }
      return { ...prev, [name]: value };
    });

    if (name === "bankName" || name === "ifscCode" || name === "beneficiaryAccountNumber") {
      setValidatedAccountName("");
    }
  };

  const handleValidateBeneficiary = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setValidatedAccountName("");

    if (!payOutForm.bankName || !payOutForm.ifscCode || !payOutForm.beneficiaryAccountNumber) {
      setErrorMessage("Select bank and enter IFSC and beneficiary account number first.");
      return;
    }

    setIsValidatingBeneficiary(true);
    try {
      const response = await validateBeneficiaryAccount({
        bankName: payOutForm.bankName,
        ifscCode: payOutForm.ifscCode,
        beneficiaryAccountNumber: payOutForm.beneficiaryAccountNumber,
        beneficiaryName: payOutForm.beneficiaryName,
      });
      setValidatedAccountName(response.accountHolderName);
      setSuccessMessage("Account validated successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Unable to validate account.");
    } finally {
      setIsValidatingBeneficiary(false);
    }
  };

  const handleLoadMoneySubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmittingLoadMoney(true);

    try {
      const response = await submitLoadMoney({
        phoneNumber: "9000000001",
        name: "Wallet User",
        amount: Number(loadMoneyForm.amount),
      });
      setSuccessMessage(response.message || "Load money submitted successfully.");
      setLoadMoneyForm({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        amount: "",
      });
      closeModal();
      await loadWalletSummary();
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit load money.");
    } finally {
      setIsSubmittingLoadMoney(false);
    }
  };

  const handlePayOutSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmittingPayOut(true);

    try {
      const response = await submitPayOut({
        phoneNumber: "9000000001",
        bankName: payOutForm.bankName,
        ifscCode: payOutForm.ifscCode,
        beneficiaryName: payOutForm.beneficiaryName,
        amount: Number(payOutForm.amount),
      });
      setSuccessMessage(response.message || "Pay out submitted successfully.");
      setPayOutForm({
        bankName: "",
        ifscCode: "",
        beneficiaryName: "",
        amount: "",
        beneficiaryAccountNumber: "",
      });
      setValidatedAccountName("");
      closeModal();
      await loadWalletSummary();
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit pay out.");
    } finally {
      setIsSubmittingPayOut(false);
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
      <section className="card dashboard-shell">
        <div className="dashboard-toolbar">
          <div>
            <img src="/credaxis-wordmark.svg" className="section-wordmark" alt="CredAxis" />
            <p className="eyebrow">Wallet Dashboard</p>
            <h1 className="dashboard-title">Card Withdrawals and Bank Payouts</h1>
            <p className="dashboard-subtitle">
              Manage credit-card withdrawals into wallet and transfer funds to beneficiaries.
            </p>
          </div>
          <div className="dashboard-toolbar-actions">
            <button type="button" className="btn btn-outline-dark" onClick={() => navigate("/reports")}>
              Reports
            </button>
            <button type="button" className="btn btn-outline-dark" onClick={() => openModal("load-money")}>
              Load Money
            </button>
            <button type="button" className="btn btn-solid" onClick={() => openModal("pay-out")}>
              Pay Out
            </button>
          </div>
        </div>

        <section className="wallet-metrics dashboard-metrics-flat">
          <article className="card metric-card metric-primary">
            <p>Available Wallet Balance</p>
            <h3>
              {isSummaryLoading ? "Loading..." : formatAmount(walletSummary.availableWalletBalance)}
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

        <section className="dashboard-insight-grid">
          <article className="card insight-card">
            <h3>Load Money Flow</h3>
            <p>Withdraw from card, convert instantly to wallet balance, and monitor success rates.</p>
          </article>
          <article className="card insight-card">
            <h3>Pay Out Flow</h3>
            <p>Validate beneficiary details, then transfer wallet funds securely to bank account.</p>
          </article>
        </section>
      </section>

      {successMessage ? <p className="success-text dashboard-message">{successMessage}</p> : null}
      {errorMessage ? <p className="error-text dashboard-message">{errorMessage}</p> : null}

      {activeModal === "load-money" ? (
        <div className="modal-overlay" onClick={closeModal}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="auth-title">Load Money (Card to Wallet)</h2>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                x
              </button>
            </div>
            <p className="auth-subtitle">Enter card details and amount to credit your wallet.</p>
            <form className="auth-form" onSubmit={handleLoadMoneySubmit}>
              <label htmlFor="load-card-number">Card Number</label>
              <input
                id="load-card-number"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={loadMoneyForm.cardNumber}
                onChange={handleLoadMoneyChange}
                minLength={16}
                maxLength={19}
                required
              />

              <div className="modal-grid-two">
                <div>
                  <label htmlFor="load-expiry-date">Expiry Date</label>
                  <input
                    id="load-expiry-date"
                    name="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={loadMoneyForm.expiryDate}
                    onChange={handleLoadMoneyChange}
                    minLength={5}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="load-cvv">CVV</label>
                  <input
                    id="load-cvv"
                    name="cvv"
                    type="password"
                    inputMode="numeric"
                    placeholder="123"
                    value={loadMoneyForm.cvv}
                    onChange={handleLoadMoneyChange}
                    minLength={3}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

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

              <button type="submit" className="btn btn-solid" disabled={isSubmittingLoadMoney}>
                {isSubmittingLoadMoney ? "Submitting..." : "Submit"}
              </button>
            </form>
          </section>
        </div>
      ) : null}

      {activeModal === "pay-out" ? (
        <div className="modal-overlay" onClick={closeModal}>
          <section className="modal-card modal-card-wide" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2 className="auth-title">Pay Out (Wallet to Bank)</h2>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                x
              </button>
            </div>
            <p className="auth-subtitle">Validate beneficiary account before enabling payout submission.</p>

            <form className="auth-form" onSubmit={handlePayOutSubmit}>
              <div className="modal-grid-two">
                <div>
                  <label htmlFor="payout-bank-name">Bank Name</label>
                  <select
                    id="payout-bank-name"
                    name="bankName"
                    value={payOutForm.bankName}
                    onChange={handlePayOutChange}
                    required
                  >
                    <option value="">Select Bank</option>
                    {INDIAN_BANKS.map((bank) => (
                      <option key={bank.name} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
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
                </div>
              </div>

              <div className="modal-grid-two">
                <div>
                  <label htmlFor="payout-ifsc-code">IFSC Code</label>
                  <input
                    id="payout-ifsc-code"
                    name="ifscCode"
                    type="text"
                    placeholder="IFSC code"
                    value={payOutForm.ifscCode}
                    onChange={handlePayOutChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="payout-amount">Amount</label>
                  <input
                    id="payout-amount"
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={payOutForm.amount}
                    onChange={handlePayOutChange}
                    required
                  />
                </div>
              </div>

              <label htmlFor="payout-account-number">Beneficiary Account Number</label>
              <input
                id="payout-account-number"
                name="beneficiaryAccountNumber"
                type="text"
                placeholder="Enter beneficiary account number"
                value={payOutForm.beneficiaryAccountNumber}
                onChange={handlePayOutChange}
                required
              />

              <div className="modal-action-row">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-validate"
                  onClick={handleValidateBeneficiary}
                  disabled={isValidatingBeneficiary}
                >
                  {isValidatingBeneficiary ? "Validating..." : "Validate Account"}
                </button>
                {validatedAccountName ? (
                  <span className="validation-pill">Verified: {validatedAccountName}</span>
                ) : null}
              </div>

              {validatedAccountName ? (
                <button type="submit" className="btn btn-solid" disabled={isSubmittingPayOut}>
                  {isSubmittingPayOut ? "Submitting..." : "Submit Pay Out"}
                </button>
              ) : null}
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default DashboardPage;
