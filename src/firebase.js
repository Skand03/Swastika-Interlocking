import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWohooB6IAKM0KlNA0R8XbmM_LAiuCz60",
  authDomain: "swastika-interlocking.firebaseapp.com",
  projectId: "swastika-interlocking",
  storageBucket: "swastika-interlocking.firebasestorage.app",
  messagingSenderId: "430044309955",
  appId: "1:430044309955:web:1ee763298848c88971b576",
  measurementId: "G-8MYDBFPQC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Google Sign-In provider
export const googleProvider = new GoogleAuthProvider();

export default app;
