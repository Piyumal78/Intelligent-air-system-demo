fetch("http://localhost:5000/health")
  .then(res => res.json())
  .then(data => console.log("Health check:", data))
  .catch(err => console.error("Health check failed:", err.message));

fetch("http://localhost:5000/api/devices", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ deviceId: "API_TEST_DEVICE", assignedUser: "admin" })
})
  .then(res => res.json())
  .then(data => console.log("Create device response:", data))
  .catch(err => console.error("Create device failed:", err.message));
