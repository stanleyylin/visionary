import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAadNSxbncXvqFTQG7s6Lhuhhi4rKi66Gk",
  authDomain: "visionary-399309.firebaseapp.com",
  projectId: "visionary-399309",
  storageBucket: "visionary-399309.appspot.com",
  messagingSenderId: "18087301516",
  appId: "1:18087301516:web:2d2e3135b04526b98046a9",
  measurementId: "G-V4QTMVYLJD",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
