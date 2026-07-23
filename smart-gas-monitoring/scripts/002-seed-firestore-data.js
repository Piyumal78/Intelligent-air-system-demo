// Script to seed initial Firestore data
// Run this with: node scripts/002-seed-firestore-data.js

import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

// Firebase configuration (use environment variables in production)
const firebaseConfig = {
  apiKey: "AIzaSyCmolbgW0nqvzYlp7CyFVYlj9YNAsqapC0",
  authDomain: "intelligent-air-system.firebaseapp.com",
  projectId: "intelligent-air-system",
  storageBucket: "intelligent-air-system.firebasestorage.app",
  messagingSenderId: "215914184089",
  appId: "1:215914184089:web:3d70c51d010eb0d03ce708",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

async function seedData() {
  console.log("Starting Firestore data seeding...")

  try {
    // Create demo admin user
    console.log("Creating admin user...")
    const adminCred = await createUserWithEmailAndPassword(auth, "admin2@airpurify.com", "admin123")

    await setDoc(doc(db, "users", adminCred.user.uid), {
      username: "Admin",
      email: "admin2@airpurify.com",
      role: "admin",
      deviceId: null,
      createdAt: new Date().toISOString(),
    })
    console.log("✓ Admin user created")

    // Create demo regular user
    console.log("Creating regular user...")
    const userCred = await createUserWithEmailAndPassword(auth, "user2@airpurify.com", "user123")

    await setDoc(doc(db, "users", userCred.user.uid), {
      username: "User1",
      email: "user2@airpurify.com",
      role: "user",
      deviceId: "DEVICE001",
      createdAt: new Date().toISOString(),
    })
    console.log("✓ Regular user created")

    // Create demo devices
    console.log("Creating devices...")
    const devices = [
      {
        id: "DEVICE001",
        status: "online",
        location: "Lab Room 1",
        assignedUser: userCred.user.uid,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "DEVICE002",
        status: "offline",
        location: "Storage Area",
        assignedUser: null,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "DEVICE003",
        status: "online",
        location: "Main Hall",
        assignedUser: null,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]

    for (const device of devices) {
      await setDoc(doc(db, "devices", device.id), device)
      console.log(`✓ Device ${device.id} created`)
    }

    // Create sample sensor readings
    console.log("Creating sample sensor readings...")
    const readings = [
      {
        deviceId: "DEVICE001",
        temperature: 28.5,
        humidity: 62,
        pressure: 1013,
        CO: 5,
        LPG: 45,
        H2: 3,
        NH3: 2,
        CO_post: 3.5,
        LPG_post: 40.5,
        H2_post: 2.4,
        NH3_post: 1.7,
        timestamp: new Date().toISOString(),
      },
      {
        deviceId: "DEVICE003",
        temperature: 30.2,
        humidity: 55,
        pressure: 1011,
        CO: 12,
        LPG: 120,
        H2: 8,
        NH3: 4,
        CO_post: 8.4,
        LPG_post: 108,
        H2_post: 6.4,
        NH3_post: 3.4,
        timestamp: new Date().toISOString(),
      },
    ]

    for (const reading of readings) {
      await setDoc(doc(collection(db, "sensorReadings")), reading)
      console.log(`✓ Reading for ${reading.deviceId} created`)
    }

    console.log("\n✅ All data seeded successfully!")
    console.log("\nDemo Credentials:")
    console.log("Admin: admin@airpurify.com / admin123")
    console.log("User: user@airpurify.com / user123")
  } catch (error) {
    console.error("Error seeding data:", error)
    if (error.code === "auth/email-already-in-use") {
      console.log("\n⚠️  Users already exist. Skipping user creation.")
    }
  }
}

seedData()
