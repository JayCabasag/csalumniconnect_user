import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import {getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCDVJVBWI5gOLvRitLDgFggkEOq1wZzH-4",
  authDomain: "cs-alumni-connect.firebaseapp.com",
  projectId: "cs-alumni-connect",
  storageBucket: "cs-alumni-connect.appspot.com",
  messagingSenderId: "149143005334",
  appId: "1:149143005334:web:2bef1036b68036c8a5fab7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app)
