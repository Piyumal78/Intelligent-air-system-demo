"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("[v0] Auth state changed:", firebaseUser?.uid)

      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData,
            })
            console.log("[v0] User data loaded:", userData)
          } else {
            // User authenticated but no Firestore document
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
              username: firebaseUser.email.split("@")[0],
            })
          }
        } catch (err) {
          console.error("[v0] Error fetching user data:", err)
          setError(err.message)
        }
      } else {
        setCurrentUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password, deviceId = null) => {
    try {
      setError(null)
      console.log("[v0] Attempting login for:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Fetch user role and device assignment from Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const isUserAdmin = userData.role === 'admin' || userData.role === 'Admin'
        
        // Enforce device ID check for regular users
        if (!isUserAdmin) {
          if (!deviceId || userData.deviceId !== deviceId) {
            await signOut(auth)
            throw new Error("Invalid or missing Device ID for this user.")
          }
        }
      } else {
        await signOut(auth)
        throw new Error("User record not found in system.")
      }

      return userCredential.user
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err.message)
      throw err
    }
  }

  const signup = async (email, password, userData = {}) => {
    try {
      setError(null)
      console.log("[v0] Creating new user:", email)

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create Firestore user document
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, {
        email: user.email,
        username: userData.username || email.split("@")[0],
        role: userData.role || "user",
        deviceId: userData.deviceId || null,
        createdAt: new Date().toISOString(),
      })

      console.log("[v0] User created successfully")
      return user
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
      setCurrentUser(null)
    } catch (err) {
      console.error("[v0] Logout error:", err)
      setError(err.message)
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
