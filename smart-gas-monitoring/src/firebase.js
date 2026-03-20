// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmolbgW0nqvzYlp7CyFVYlj9YNAsqapC0",
  authDomain: "intelligent-air-system.firebaseapp.com",
  projectId: "intelligent-air-system",
  storageBucket: "intelligent-air-system.firebasestorage.app",
  messagingSenderId: "215914184089",
  appId: "1:215914184089:web:3d70c51d010eb0d03ce708",
  measurementId: "G-17BESYD9N9"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Export auth and db
export const auth = getAuth(app)
export const db = getFirestore(app)
