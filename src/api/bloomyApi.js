import { env } from '../config/config';
import { requestJson } from './http';

function buildUrl(path) {
  return `${env.apiBaseUrl}${path}`;
}

function getAuthHeaders(idToken) {
  return idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};
}

export async function registerUser(payload) {
  return requestJson(buildUrl('/api/auth/register'), {
    method: 'POST',
    body: payload,
  });
}

export async function logoutUser() {
  return requestJson(buildUrl('/api/auth/logout'), {
    method: 'POST',
  });
}

export async function getUserProfile({ idToken, uid }) {
  return requestJson(buildUrl(`/api/users/${uid}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getUserStats({ idToken, uid }) {
  return requestJson(buildUrl(`/api/users/${uid}/stats`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getUserHabits({ idToken, uid }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getHabitRecommendations({ idToken, uid, limit = 4 }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}/recommendations?limit=${limit}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function createHabit({ idToken, payload }) {
  return requestJson(buildUrl('/api/habits'), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
    body: payload,
  });
}

export async function deleteHabit({ idToken, habitId }) {
  return requestJson(buildUrl(`/api/habits/${habitId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(idToken),
  });
}

export async function completeHabit({ idToken, habitId, payload = {} }) {
  return requestJson(buildUrl(`/api/habits/${habitId}/complete`), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
    body: payload,
  });
}

export async function getHabitStreak({ idToken, habitId, uid }) {
  return requestJson(buildUrl(`/api/habits/${habitId}/streak?uid=${uid}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getPlant({ idToken, uid }) {
  return requestJson(buildUrl(`/api/plants/${uid}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}
