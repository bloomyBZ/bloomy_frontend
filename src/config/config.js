const fallbackApiBaseUrl = 'http://127.0.0.1:5001';

function sanitizeUrl(value, fallback) {
  const rawValue = (value || '').trim();
  const safeValue = rawValue || fallback;

  return safeValue.replace(/\/+$/, '');
}

export const env = {
  apiBaseUrl: sanitizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL, fallbackApiBaseUrl),
  firebaseApiKey: (process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '').trim(),
  firebaseProjectId: (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '').trim(),
};

export function assertFirebaseApiKey() {
  if (!env.firebaseApiKey) {
    throw new Error(
      'EXPO_PUBLIC_FIREBASE_API_KEY is missing. Add your Firebase Web API key to bloomy-frontend/.env.'
    );
  }
}
