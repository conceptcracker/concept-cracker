// ============================================================
//  STEP 1: Paste YOUR Firebase web-app config here.
//  Firebase Console -> Project settings (gear icon) -> General
//  -> "Your apps" -> Web app -> "SDK setup and configuration" -> Config
//  Replace the whole object below with the one Firebase shows you.
// ============================================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy5qO8AI8kWqQQUSDqPCqm2Z6tSCckia4",
  authDomain: "concepts-creakres.firebaseapp.com",
  projectId: "concepts-creakres",
  storageBucket: "concepts-creakres.firebasestorage.app",
  messagingSenderId: "882506019552",
  appId: "1:882506019552:web:2a5357160294eae7afd685",
  measurementId: "G-9697ZXLMN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
