/**
 * KAINORA KIDS - FIREBASE CONFIG
 * ⚠️ Untuk development, gunakan Firebase emulator atau buat project baru
 * ⚠️ API keys di sini HARUS diganti saat production
 *
 * Cara setup production:
 * 1. Buka https://console.firebase.google.com
 * 2. Buat project baru (atau pakai existing)
 * 3. Settings → Project settings → Web apps
 * 4. Copy config ke .env.local sebagai VITE_FIREBASE_API_KEY, dll
 * 5. Ganti placeholder di bawah dengan import.meta.env
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import publicConfig from './config/firebasePublic.json';

// ⚠️ DEVELOPMENT CONFIG - GANTI UNTUK PRODUCTION!
const firebaseConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'kainora-kids-dev' ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dev-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kainora-kids-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kainora-kids-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kainora-kids-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
} : publicConfig;

const app = getApps().find(candidate => candidate.name === firebaseConfig.projectId) || initializeApp(firebaseConfig, firebaseConfig.projectId);
export const isFirebaseConfigured = firebaseConfig.apiKey !== 'dev-api-key' && firebaseConfig.projectId !== 'kainora-kids-dev';
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

let messaging = null;
try {
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
} catch (e) {
  console.warn('[Firebase] Messaging not supported:', e);
}
export { messaging };

// Constants
export const appId = firebaseConfig.projectId;
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'kainorakids@gmail.com';
export { WA_NUMBER } from './config/shop';
export const LOGO_URL = '/favicon.png';

// Anonymous sign-in (only if real API key configured)
export const initAuth = () => {
  // Public catalogue is static; guest visits do not create Firebase accounts.
  // Firebase Auth restores existing buyer sessions; login is explicit.
};

// Notification helpers (stubs)
export const requestForToken = async () => {
  try {
    if (!messaging) return null;
    // Real token request would go here
    return null;
  } catch (e) {
    return null;
  }
};

export const onMessageListener = () => new Promise(() => {});
