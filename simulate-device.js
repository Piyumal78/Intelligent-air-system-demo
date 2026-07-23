const axios = require('axios');

// CONFIGURATION
const BACKEND_URL = 'http://localhost:5000'; // Change to your PC's IP if running from another device
const DEVICE_ID = 'DEVICE001'; // Must match a device ID in your database

// Function to generate random sensor data
function generateRandomData() {
    const co = Math.random() * 50;
    const lpg = Math.random() * 20;
    const h2 = Math.random() * 10;
    const nh3 = Math.random() * 5;
    return {
        temperature: 20 + Math.random() * 10, // 20-30°C
        humidity: 40 + Math.random() * 20,    // 40-60%
        pressure: 1000 + Math.random() * 20,  // 1000-1020 hPa
        CO: co,                               // Pre-filtration CO
        LPG: lpg,                             // Pre-filtration LPG
        H2: h2,                               // Pre-filtration H2
        NH3: nh3,                             // Pre-filtration NH3
        CO_post: co * 0.7,                    // Real filtered sensor value from device hardware filter
        LPG_post: lpg * 0.9,                  // Real filtered sensor value from device hardware filter
        H2_post: h2 * 0.8,                    // Real filtered sensor value from device hardware filter
        NH3_post: nh3 * 0.85,                 // Real filtered sensor value from device hardware filter
        timestamp: new Date().toISOString()   // Add timestamp in ISO format
    };
}

async function sendData() {
    const data = generateRandomData();
    const url = `${BACKEND_URL}/api/devices/${DEVICE_ID}/readings`;

    console.log(`Sending data to ${url}...`);
    console.log('Payload:', data);

    try {
        const response = await axios.post(url, data);
        console.log('✅ Success:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('   (Is the backend server running on port 5000?)');
        }
    }
}

// Run every 5 seconds
console.log('Starting device simulation...');
console.log('Press Ctrl+C to stop');
sendData(); // Send first immediately
setInterval(sendData, 5000);
