import { apiRequest } from "./apiClient";

export function submitLoadMoney(payload) {
  return apiRequest("/payments/load-money", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitPayOut(payload) {
  return apiRequest("/payments/pay-out", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchWalletSummary() {
  return apiRequest("/payments/wallet-summary");
}

export function fetchLoadMoneyReports() {
  return apiRequest("/payments/reports/load-money");
}

export function fetchPayOutReports() {
  return apiRequest("/payments/reports/pay-out");
}

export async function validateBeneficiaryAccount(payload) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const accountNumber = (payload.beneficiaryAccountNumber || "").trim();
  if (accountNumber.length < 8) {
    throw new Error("Enter a valid beneficiary account number (minimum 8 digits). ");
  }

  const fallbackName = `Account Holder ${accountNumber.slice(-4)}`;
  const accountHolderName = (payload.beneficiaryName || "").trim() || fallbackName;

  return {
    accountHolderName,
    ifscCode: payload.ifscCode,
    bankName: payload.bankName,
  };
}
