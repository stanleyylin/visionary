import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhF0Vx2M18MTRJ264W5llTZY6IalkaPkk",
  authDomain: "visionary2-c9a13.firebaseapp.com",
  projectId: "visionary2-c9a13",
  storageBucket: "visionary2-c9a13.appspot.com",
  messagingSenderId: "55638680221",
  appId: "1:55638680221:web:8f39bd2ee417ae76a1aa74",
  measurementId: "G-TYTKHRCSLS",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
