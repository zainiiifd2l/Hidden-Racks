/**
 * API Client with JWT Authorization Interceptor
 */
const API_BASE = "http://127.0.0.1:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("hr_jwt_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || errData.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("API error:", err.message);
    throw err;
  }
}
