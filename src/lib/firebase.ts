import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyD-EGYaNa-ZM0WbGeH_NE-Q1C3arrsCG3Q",
  authDomain: "linktree-8905d.firebaseapp.com",
  projectId: "linktree-8905d",
  storageBucket: "linktree-8905d.appspot.com",
  messagingSenderId: "293855218038",
  appId: "1:293855218038:web:86094f33c8fa63a0229257",
  measurementId: "G-240G6V9EKS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
