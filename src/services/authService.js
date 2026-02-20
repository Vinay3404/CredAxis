import { apiRequest } from "./apiClient";

export function signIn(payload) {
  return apiRequest("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logIn(payload) {
  return apiRequest("/auth/log-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
