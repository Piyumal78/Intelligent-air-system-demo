"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { db, auth } from "../firebase"
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  limit,
} from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "./AuthContext"

const SystemContext = createContext()

export const useSystem = () => useContext(SystemContext)

export const SystemProvider = ({ children }) => {
  const { currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [devices, setDevices] = useState([])
  const [sensorReadings, setSensorReadings] = useState([])
  const [alerts, setAlerts] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!currentUser) {
      const timer = setTimeout(() => setLoading(false), 0)
      return () => clearTimeout(timer)
    }

    console.log("[v0] Setting up Firestore listeners")

    const unsubscribers = []

    // Users collection listener (admin only)
    if (currentUser.role === "admin" || currentUser.role === "Admin") {
      const usersUnsub = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          const userList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setUsers(userList)
          console.log("[v0] Users updated:", userList.length)
        },
        (error) => {
          console.error("[v0] Users listener error:", error)
        },
      )
      unsubscribers.push(usersUnsub)
    }

    // Devices collection listener
    const devicesUnsub = onSnapshot(
      collection(db, "devices"),
      (snapshot) => {
        const deviceList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setDevices(deviceList)
        console.log("[v0] Devices updated:", deviceList.length)
      },
      (error) => {
        console.error("[v0] Devices listener error:", error)
      },
    )
    unsubscribers.push(devicesUnsub)

    // Sensor readings listener (last 2000 readings to support wider time intervals)
    const readingsQuery = query(collection(db, "sensorReadings"), orderBy("timestamp", "desc"), limit(2000))
    const readingsUnsub = onSnapshot(
      readingsQuery,
      (snapshot) => {
        const readingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setSensorReadings(readingsList)
        console.log("[v0] Sensor readings updated:", readingsList.length)
      },
      (error) => {
        console.error("[v0] Readings listener error:", error)
      },
    )
    unsubscribers.push(readingsUnsub)

    // Alerts collection listener
    const alertsQuery = query(collection(db, "alerts"), orderBy("timestamp", "desc"), limit(50))
    const alertsUnsub = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alertsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setAlerts(alertsList)
        console.log("[v0] Alerts updated:", alertsList.length)
      },
      (error) => {
        console.error("[v0] Alerts listener error:", error)
      },
    )
    unsubscribers.push(alertsUnsub)

    if (currentUser.role === "admin" || currentUser.role === "Admin") {
      const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(100))
      const logsUnsub = onSnapshot(
        logsQuery,
        (snapshot) => {
          const logsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setLogs(logsList)
          console.log("[v0] Logs updated:", logsList.length)
        },
        (error) => {
          console.error("[v0] Logs listener error:", error)
        },
      )
      unsubscribers.push(logsUnsub)
    }

    setTimeout(() => setLoading(false), 0)

    // Cleanup all listeners
    return () => {
      console.log("[v0] Cleaning up Firestore listeners")
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [currentUser])

  const createUser = async (userData) => {
    const { email, password, username, deviceId, role } = userData
    try {
      console.log("[v0] Creating user via Backend API:", email)

      const token = auth.currentUser ? await auth.currentUser.getIdToken() : ""

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, password, username, deviceId, role })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user via Backend API")
      }

      await addLog("User Created", `Created user ${username} (${role})`, "Success")
      console.log("[v0] User created successfully via backend:", data.uid)
      return { success: true, uid: data.uid }
    } catch (error) {
      console.error("[v0] Create user error:", error)
      await addLog("Error", `Failed to create user: ${error.message}`, "Error")
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (userId) => {
    try {
      console.log("[v0] Deleting user via Backend API:", userId)

      const token = auth.currentUser ? await auth.currentUser.getIdToken() : ""

      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user via Backend API")
      }

      await addLog("User Deleted", `ID: ${userId}`, "Info")
      console.log("[v0] User deleted via backend:", userId)
      return { success: true }
    } catch (error) {
      console.error("[v0] Delete user error:", error)
      return { success: false, error: error.message }
    }
  }

  const registerDevice = async (deviceData) => {
    try {
      const deviceId = deviceData.id || deviceData.deviceId
      await setDoc(doc(db, "devices", deviceId), {
        assignedUser: deviceData.assignedUser || deviceData.assignedTo || null,
        status: "Online",
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })

      await addLog("Device Registered", `Device ${deviceId} added`, "Success")
      console.log("[v0] Device registered:", deviceId)
      return { success: true }
    } catch (error) {
      console.error("[v0] Register device error:", error)
      return { success: false, error: error.message }
    }
  }

  const deleteDevice = async (deviceId) => {
    try {
      await deleteDoc(doc(db, "devices", deviceId))
      await addLog("Device Deleted", `Device ${deviceId} removed`, "Info")
      console.log("[v0] Device deleted:", deviceId)
      return { success: true }
    } catch (error) {
      console.error("[v0] Delete device error:", error)
      return { success: false, error: error.message }
    }
  }

  const updateDeviceStatus = async (deviceId, status) => {
    try {
      const deviceRef = doc(db, "devices", deviceId)
      await updateDoc(deviceRef, {
        status,
        lastUpdated: new Date().toISOString(),
      })
      console.log("[v0] Device status updated:", deviceId, status)
    } catch (error) {
      console.error("[v0] Update device status error:", error)
    }
  }

  const addSensorReading = async (deviceId, readings) => {
    try {
      await addDoc(collection(db, "sensorReadings"), {
        deviceId,
        temperature: readings.temperature || 0,
        humidity: readings.humidity || 0,
        pressure: readings.pressure || 1013,
        CO: readings.CO || 0,
        LPG: readings.LPG || 0,
        H2: readings.H2 || 0,
        NH3: readings.NH3 || 0,
        timestamp: new Date().toISOString(),
      })

      // Check thresholds and create alerts if needed
      await checkThresholds(deviceId, readings)
    } catch (error) {
      console.error("[v0] Add sensor reading error:", error)
    }
  }

  const checkThresholds = async (deviceId, readings) => {
    const thresholds = {
      CO: { danger: 50, warning: 30 },
      LPG: { danger: 150, warning: 100 },
      H2: { danger: 80, warning: 50 },
      NH3: { danger: 35, warning: 25 },
    }

    for (const [gasType, value] of Object.entries(readings)) {
      if (!thresholds[gasType]) continue

      let level = "Good"
      let message = `${gasType} level is normal`

      if (value >= thresholds[gasType].danger) {
        level = "Danger"
        message = `Critical ${gasType} level detected!`

        // Create alert in Firestore
        await addDoc(collection(db, "alerts"), {
          deviceId,
          gasType,
          value: value,
          level,
          message,
          timestamp: new Date().toISOString(),
          status: "new",
        })

        await addLog("Alert Triggered", `${gasType} danger on ${deviceId}`, "Warning")
      } else if (value >= thresholds[gasType].warning) {
        level = "Warning"
        message = `${gasType} level is elevated`
      }
    }
  }

  const dismissAlert = async (alertId) => {
    try {
      const alertRef = doc(db, "alerts", alertId)
      await updateDoc(alertRef, {
        status: "dismissed",
        dismissedAt: new Date().toISOString(),
      })
      console.log("[v0] Alert dismissed:", alertId)
      return { success: true }
    } catch (error) {
      console.error("[v0] Dismiss alert error:", error)
      return { success: false, error: error.message }
    }
  }

  const addLog = async (action, detail, type = "Info") => {
    try {
      await addDoc(collection(db, "logs"), {
        action,
        detail,
        type,
        userId: currentUser?.uid || "system",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Add log error:", error)
    }
  }

  const getLatestReading = (deviceId) => {
    const deviceReadings = sensorReadings.filter((r) => r.deviceId === deviceId)
    return deviceReadings.length > 0 ? deviceReadings[0] : null
  }

  const computedDevices = devices.map((device) => {
    const deviceReadings = sensorReadings.filter((r) => r.deviceId === device.id)
    const latestReading = deviceReadings.length > 0 ? deviceReadings[0] : null

    let status = "offline"
    if (latestReading && latestReading.timestamp) {
      const readingTime = new Date(latestReading.timestamp).getTime()
      const now = new Date().getTime()
      const diff = now - readingTime
      if (diff < 60000 && diff > -30000) {
        status = "online"
      }
    }
    return {
      ...device,
      status,
    }
  })

  const value = {
    users,
    devices: computedDevices,
    sensorReadings,
    alerts,
    logs,
    loading,
    createUser,
    deleteUser,
    registerDevice,
    deleteDevice,
    updateDeviceStatus,
    addSensorReading,
    dismissAlert,
    addLog,
    getLatestReading,
  }

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}
