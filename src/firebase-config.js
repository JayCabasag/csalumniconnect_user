// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4DtPRmjl8XOf4mgmO45UaEjeS4CnGkaQ",
  authDomain: "tcuhub-cf9e1.firebaseapp.com",
  projectId: "tcuhub-cf9e1",
  storageBucket: "tcuhub-cf9e1.appspot.com",
  messagingSenderId: "974408101611",
  appId: "1:974408101611:web:bafe219fc3dd5361ea18ae",
  measurementId: "G-WKH9QSHEJX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app)
