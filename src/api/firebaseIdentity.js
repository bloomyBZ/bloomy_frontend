import { env, assertFirebaseApiKey } from '../config/config';
import { requestJson } from './http';

const identityBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

function buildIdentityUrl(action) {
  assertFirebaseApiKey();
  return `${identityBaseUrl}:${action}?key=${env.firebaseApiKey}`;
}

function mapFirebaseErrorMessage(message) {
  switch (message) {
    case 'EMAIL_EXISTS':
      return 'This email is already in use.';
    case 'EMAIL_NOT_FOUND':
      return 'No account was found for this email.';
    case 'INVALID_PASSWORD':
      return 'The password is incorrect.';
    case 'USER_DISABLED':
      return 'This account has been disabled.';
    case 'INVALID_LOGIN_CREDENTIALS':
      return 'Email or password is incorrect.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return 'Too many attempts. Please try again later.';
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'WEAK_PASSWORD : Password should be at least 6 characters':
    case 'WEAK_PASSWORD':
      return 'Password must be at least 6 characters.';
    case 'MISSING_PASSWORD':
      return 'Password is required.';
    case 'OPERATION_NOT_ALLOWED':
      return 'Email/password sign-in is not enabled in Firebase.';
    default:
      return message;
  }
}

async function runIdentityRequest(action, body) {
  try {
    return await requestJson(buildIdentityUrl(action), {
      method: 'POST',
      body,
    });
  } catch (error) {
    throw new Error(mapFirebaseErrorMessage(error.message));
  }
}

export async function signInWithEmailAndPassword(email, password) {
  return runIdentityRequest('signInWithPassword', {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function sendPasswordResetEmail(email) {
  return runIdentityRequest('sendOobCode', {
    requestType: 'PASSWORD_RESET',
    email,
  });
}
