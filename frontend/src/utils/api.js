/**
 * Centralized API client for SafeSpend
 * All backend calls go through here.
 */

// In production (Vercel), set VITE_API_URL=https://your-app.onrender.com in Vercel env vars.
// In development, Vite's proxy forwards /api → localhost:5000 automatically.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const getUserId = () => localStorage.getItem('safespend_user_id') || 'user123';
export const getUserName = () => localStorage.getItem('safespend_user_name') || 'User';

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json;
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const loginUser = (email) => apiPost('/users/login', { email });
export const setupUser = (data) => apiPost('/users/setup', data);

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboard = (userId) => apiGet(`/dashboard/${userId}`);
export const getInsights = (userId) => apiGet(`/dashboard/${userId}/insights`);
export const getRecommendations = (userId) => apiGet(`/dashboard/${userId}/recommendations`);

// ── Goals ─────────────────────────────────────────────────────────────────
export const getUser = (userId) => apiGet(`/users/${userId}`);
export const createGoal = (data) => apiPost('/users/goals', data);
export const updateGoal = (userId, goalId, data) => apiPut(`/users/${userId}/goals/${goalId}`, data);
export const deleteGoal = (userId, goalId) => apiDelete(`/users/${userId}/goals/${goalId}`);
export const updateUserBudget = (userId, data) => apiPut(`/users/${userId}/budget`, data);

// ── Simulate ──────────────────────────────────────────────────────────────
export const simulate = (data) => apiPost('/simulate', data);

// ── Transactions ──────────────────────────────────────────────────────────
export const scanTransaction = (data) => apiPost('/transactions/scan', data);
export const addTransaction = (data) => apiPost('/transactions/add', data);

// ── AI Check ──────────────────────────────────────────────────────────────
export const aiCheck = (data) => apiPost('/ai-check', data);

// ── Chat ──────────────────────────────────────────────────────────────────
export const chatMessage = (data) => apiPost('/chat', data);
