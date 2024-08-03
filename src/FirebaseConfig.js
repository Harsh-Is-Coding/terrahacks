// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDovSO3_SeMWB3k5_ULEU3bp0N5jzyEQG8",
  authDomain: "terrahacks-f41ac.firebaseapp.com",
  projectId: "terrahacks-f41ac",
  storageBucket: "terrahacks-f41ac.appspot.com",
  messagingSenderId: "423499513470",
  appId: "1:423499513470:web:fc1c0ad820282c2436a22f",
  measurementId: "G-7EDQ1422TV"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };