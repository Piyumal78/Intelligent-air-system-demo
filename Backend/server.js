const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

// Routes
const authRoutes = require("./routes/authRoutes")
const deviceRoutes = require("./routes/deviceRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/devices", deviceRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "AirPurify Backend API",
    status: "running",
    version: "1.0.0",
  })
})

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[Backend] Server running on port ${PORT}`)
  console.log(`[Backend] Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
})
