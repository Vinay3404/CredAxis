import { apiRequest } from "./apiClient";

export function fetchAdminUsers() {
  return apiRequest("/admin/users");
}

export function createAdminUser(payload) {
  return apiRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminAuditTransactions(filters = {}) {
  const query = new URLSearchParams();
  if (filters.fromDate) query.set("fromDate", filters.fromDate);
  if (filters.toDate) query.set("toDate", filters.toDate);
  if (filters.userId) query.set("userId", filters.userId);
  if (filters.transactionType) query.set("transactionType", filters.transactionType);
  if (filters.phoneNumber) query.set("phoneNumber", filters.phoneNumber);
  if (filters.minAmount) query.set("minAmount", filters.minAmount);
  if (filters.maxAmount) query.set("maxAmount", filters.maxAmount);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest(`/admin/audit/transactions${suffix}`);
}
