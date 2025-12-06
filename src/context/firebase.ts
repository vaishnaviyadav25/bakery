import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGeZh16k85pSblnFf0QYyF_3ENtliYWK4",
  authDomain: "my-shop-2c7ed.firebaseapp.com",
  projectId: "my-shop-2c7ed",
  storageBucket: "my-shop-2c7ed.firebasestorage.app",
  messagingSenderId: "942958259544",
  appId: "1:942958259544:web:cfdcd99b53ce7a7207892d",
  measurementId: "G-3D0HZ0DJ7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize analytics only on client-side
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, storage, analytics };
export default app;
