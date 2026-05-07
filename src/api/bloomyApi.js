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

export async function loginDemoUser(payload) {
  return requestJson(buildUrl('/api/auth/login'), {
    method: 'POST',
    body: payload,
  });
}

export async function logoutUser() {
  return requestJson(buildUrl('/api/auth/logout'), {
    method: 'POST',
  });
}

export async function verifyBackendToken(idToken) {
  return requestJson(buildUrl('/api/auth/verify-token'), {
    method: 'POST',
    body: {
      id_token: idToken,
    },
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

export async function updateUserProfile({ idToken, uid, payload }) {
  return requestJson(buildUrl(`/api/users/${uid}`), {
    method: 'PUT',
    headers: getAuthHeaders(idToken),
    body: payload,
  });
}

export async function deleteUserAccount({ idToken, uid }) {
  return requestJson(buildUrl(`/api/users/${uid}/delete`), {
    method: 'DELETE',
    headers: getAuthHeaders(idToken),
  });
}

export async function getUserHabits({ idToken, uid }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getHabitRecommendations({ idToken, uid, limit = 8 }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}/recommendations?limit=${limit}`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function getHabit({ idToken, habitId }) {
  return requestJson(buildUrl(`/api/habits/${habitId}`), {
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

export async function updateHabit({ idToken, habitId, payload }) {
  return requestJson(buildUrl(`/api/habits/${habitId}`), {
    method: 'PUT',
    headers: getAuthHeaders(idToken),
    body: payload,
  });
}

export async function undoDeleteHabit({ idToken, habitId }) {
  return requestJson(buildUrl(`/api/habits/${habitId}/undo`), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
  });
}

export async function getUserTrash({ idToken, uid }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}/trash`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function emptyUserTrash({ idToken, uid }) {
  return requestJson(buildUrl(`/api/habits/user/${uid}/trash`), {
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

export async function uncompleteHabit({ idToken, habitId }) {
  return requestJson(buildUrl(`/api/habits/${habitId}/uncomplete`), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
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

export async function getPlantHealth({ idToken, uid }) {
  return requestJson(buildUrl(`/api/plants/${uid}/health`), {
    method: 'GET',
    headers: getAuthHeaders(idToken),
  });
}

export async function updatePlantHealth({ idToken, uid, payload }) {
  return requestJson(buildUrl(`/api/plants/${uid}/health`), {
    method: 'PUT',
    headers: getAuthHeaders(idToken),
    body: payload,
  });
}

export async function checkPlantDecay({ idToken, uid }) {
  return requestJson(buildUrl(`/api/plants/${uid}/decay-check`), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
  });
}

export async function runBatchPlantDecayCheck(payload, headers = {}) {
  return requestJson(buildUrl('/api/plants/batch-decay'), {
    method: 'POST',
    headers,
    body: payload,
  });
}

export async function resetHabitStreak({ idToken, habitId }) {
  return requestJson(buildUrl(`/api/habits/${habitId}/reset-streak`), {
    method: 'POST',
    headers: getAuthHeaders(idToken),
  });
}
