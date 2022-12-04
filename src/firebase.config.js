// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBonAYpreWXc3jmrVS3J-QZ2viAd8m3vSM",
  authDomain: "house-marketplace-17b60.firebaseapp.com",
  projectId: "house-marketplace-17b60",
  storageBucket: "house-marketplace-17b60.appspot.com",
  messagingSenderId: "630243074416",
  appId: "1:630243074416:web:9b10d4f658fe47a2e4efb5"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()