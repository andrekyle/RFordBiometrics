// Firebase configuration and initialization
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';

// Your web app's Firebase configuration
// Uses environment variables — see .env.example
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.appId.includes('abcdef')
);

// Initialize Firebase only if properly configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    'Firebase is not configured. Set VITE_FIREBASE_* environment variables (see .env.example). Auth features will be disabled.'
  );
}

export { auth };

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export { googleProvider };

// Sign in with Google Popup
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up environment variables.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Sign out
export const logoutUser = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  } catch (error: any) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // Not configured — immediately call back with null (not signed in)
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export default app;
