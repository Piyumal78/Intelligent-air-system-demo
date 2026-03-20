const express = require("express")
const router = express.Router()
const { db } = require("../config/firebase-config")
const { checkThresholds } = require("../controllers/alertController")

const admin = require("firebase-admin")

// Object to store timeout references for each device
const deviceTimeouts = {}

// Get All Devices
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("devices").get()
    const devices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(devices)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Register/Add Device
router.post("/", async (req, res) => {
  const { deviceId, assignedUser } = req.body

  if (!deviceId) {
    return res.status(400).json({ error: "Device ID is required" })
  }

  try {
    await db
      .collection("devices")
      .doc(deviceId)
      .set({
        assignedUser: assignedUser || null,
        status: "offline",
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })

    res.status(201).json({ message: "Device registered successfully", deviceId })
  } catch (error) {
    console.error("[Backend] Device registration error:", error)
    res.status(500).json({ error: error.message })
  }
})

router.post("/:deviceId/readings", async (req, res) => {
  const { deviceId } = req.params
  const { temperature, humidity, pressure, CO, LPG, H2, NH3 } = req.body

  try {
    // 1. Add sensor reading to sensorReadings collection
    await db.collection("sensorReadings").add({
      deviceId,
      temperature: temperature || 0,
      humidity: humidity || 0,
      pressure: pressure || 1013,
      CO: CO || 0,
      LPG: LPG || 0,
      H2: H2 || 0,
      NH3: NH3 || 0,
      timestamp: req.body.timestamp || new Date().toISOString(),
    })

    // 2. Update device status
    await db.collection("devices").doc(deviceId).update({
      status: "online",
      lastUpdated: new Date().toISOString(),
    })

    // Clear existing timeout if any
    if (deviceTimeouts[deviceId]) {
      clearTimeout(deviceTimeouts[deviceId])
    }

    // Set a new timeout to mark the device offline after 60 seconds (60000ms) of inactivity
    deviceTimeouts[deviceId] = setTimeout(async () => {
      try {
        await db.collection("devices").doc(deviceId).update({
          status: "offline",
          lastUpdated: new Date().toISOString(),
        })
        console.log(`[Backend] Device ${deviceId} marked offline due to inactivity.`)
      } catch (err) {
        console.error(`[Backend] Error marking device ${deviceId} offline:`, err)
      }
    }, 60000)

    // 3. Check for alerts
    await checkThresholds(deviceId, { CO, LPG, H2, NH3 })

    console.log(`[Backend] Sensor data received from ${deviceId}`)
    res.json({ message: "Readings updated and processed successfully" })
  } catch (error) {
    console.error("[Backend] Error updating readings:", error)
    res.status(500).json({ error: error.message })
  }
})

router.patch("/:deviceId/status", async (req, res) => {
  const { deviceId } = req.params
  const { status } = req.body

  try {
    await db.collection("devices").doc(deviceId).update({
      status,
      lastUpdated: new Date().toISOString(),
    })

    res.json({ message: "Device status updated", deviceId, status })
  } catch (error) {
    console.error("[Backend] Device status update error:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
