// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

// Your web app's Firebase configuration
// For production, use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyA3YNzpG8zsCR5KwC_yRAsJzRIs8TaRdsA", // Using the Google Maps API key temporarily
  authDomain: "biosentinel-demo.firebaseapp.com",
  projectId: "biosentinel-demo",
  storageBucket: "biosentinel-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google Popup
export const signInWithGoogle = async () => {
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
  return onAuthStateChanged(auth, callback);
};

export default app;
