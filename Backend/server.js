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

// Live Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`[AirSense Backend Log ${timestamp}] 🟢 ${req.method} ${req.originalUrl}`)
  next()
})

// Routes
const authRoutes = require("./routes/authRoutes")
const deviceRoutes = require("./routes/deviceRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/devices", deviceRoutes)

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AirSense Backend API Status</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; border: 1px solid #334155; }
          .status { display: inline-flex; align-items: center; gap: 8px; background: #064e3b; color: #34d399; padding: 8px 16px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-bottom: 20px; border: 1px solid #059669; }
          .dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; display: inline-block; }
          h1 { margin: 0 0 10px 0; color: #38bdf8; font-size: 28px; }
          p { color: #94a3b8; margin: 5px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status"><span class="dot"></span> SERVER RUNNING & ONLINE</div>
          <h1>AirSense Backend API</h1>
          <p>Status: <strong>Healthy & Active</strong></p>
          <p>Port: <strong>${PORT}</strong></p>
          <p>Frontend URL: <strong>${process.env.FRONTEND_URL || "http://localhost:5173"}</strong></p>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `)
})

app.get("/health", (req, res) => {
  res.json({
    service: "AirSense Backend API",
    status: "running",
    health: "healthy",
    port: PORT,
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log("==================================================")
  console.log(`🚀 [AirSense Backend API] Server Running on Port ${PORT}`)
  console.log(`🌐 API Web Status: http://localhost:${PORT}`)
  console.log(`🟢 Health Endpoint: http://localhost:${PORT}/health`)
  console.log(`🔗 Connected Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
  console.log("==================================================")
})
