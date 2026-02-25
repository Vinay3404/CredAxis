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
