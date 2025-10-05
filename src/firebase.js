// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// REMPLACEZ ces valeurs par VOS clés Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDkcvhdANZdOXOucgF8Sm33cq_0idCq-OU",
  authDomain: "inventaire-pompiers.firebaseapp.com",
  projectId: "inventaire-pompiers",
  storageBucket: "inventaire-pompiers.firebasestorage.app",
  messagingSenderId: "19833960025",
  appId: "1:19833960025:web:c93522bbbdb240045f2348"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);