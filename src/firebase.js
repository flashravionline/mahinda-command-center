import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqWGz1gHONq7tYtHM3-fIjatfXEEl_9VM",
  authDomain: "mahinda-656f3.firebaseapp.com",
  databaseURL: "https://mahinda-656f3-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "mahinda-656f3",
  storageBucket: "mahinda-656f3.firebasestorage.app",
  messagingSenderId: "335147758476",
  appId: "1:335147758476:web:4a35d93db30aa863a15ca9"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);