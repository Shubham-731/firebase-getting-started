import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqOTn2x1g6xkmrWjMXcj3tqpokxckbiWc",
  authDomain: "getting-started-5664c.firebaseapp.com",
  projectId: "getting-started-5664c",
  storageBucket: "getting-started-5664c.appspot.com",
  messagingSenderId: "75923906247",
  appId: "1:75923906247:web:360307f35d092a61c0a8e2",
  measurementId: "G-MR4CNY0D2J",
};

// Init firebase
const app = initializeApp(firebaseConfig);

// Get the db
const db = getFirestore(app);

// Get auth
const auth = getAuth();

export { db, auth };
