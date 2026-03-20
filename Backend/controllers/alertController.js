const { db } = require("../config/firebase-config")
const admin = require("firebase-admin")

const checkThresholds = async (deviceId, readings) => {
  const THRESHOLDS = {
    CO: { danger: 50, warning: 30 },
    LPG: { danger: 150, warning: 100 },
    H2: { danger: 80, warning: 50 },
    NH3: { danger: 35, warning: 25 },
  }

  const alerts = []

  for (const [gasType, value] of Object.entries(readings)) {
    if (!THRESHOLDS[gasType]) continue

    let level = "Good"
    let message = `${gasType} level is normal`

    if (value >= THRESHOLDS[gasType].danger) {
      level = "Danger"
      message = `Critical ${gasType} level detected!`
      alerts.push({ gasType, value, level, message })
    } else if (value >= THRESHOLDS[gasType].warning) {
      level = "Warning"
      message = `${gasType} level is elevated`
      alerts.push({ gasType, value, level, message })
    }
  }

  if (alerts.length === 0) return

  const recentAlerts = await db
    .collection("alerts")
    .where("deviceId", "==", deviceId)
    .where("timestamp", ">", new Date(Date.now() - 60000)) // Last 1 minute
    .get()

  const batch = db.batch()
  const alertsRef = db.collection("alerts")

  for (const alert of alerts) {
    // Skip if similar alert exists in last minute
    const hasSimilar = recentAlerts.docs.some(
      (doc) => doc.data().gasType === alert.gasType && doc.data().level === alert.level,
    )

    if (hasSimilar) continue

    const newAlertRef = alertsRef.doc()
    batch.set(newAlertRef, {
      deviceId,
      gasType: alert.gasType,
      value: alert.value,
      level: alert.level,
      message: alert.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "new",
    })
  }

  try {
    await batch.commit()
    if (alerts.length > 0) {
      console.log(`[Backend] Generated ${alerts.length} alerts for device ${deviceId}`)
    }
  } catch (error) {
    console.error("[Backend] Error creating alerts:", error)
  }
}

module.exports = { checkThresholds }
