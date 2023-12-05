// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVxyFYFCvn_sJujmcUu8Q45oC-C2s3h2s",
  authDomain: "consumercat-88562.firebaseapp.com",
  projectId: "consumercat-88562",
  storageBucket: "consumercat-88562.appspot.com",
  messagingSenderId: "528069045166",
  appId: "1:528069045166:web:a82c16f54782a09a98763f",
  measurementId: "G-6FQ8VPMT4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication and Firestore services
const auth = getAuth(app);
// const storage = getStorage(app)
const db = getFirestore(app);

// Export the necessary Firebase services
export { auth, db };
