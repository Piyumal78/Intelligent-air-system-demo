const axios = require('axios');

// CONFIGURATION
const BACKEND_URL = 'http://localhost:5000'; // Change to your PC's IP if running from another device
const DEVICE_ID = 'DEVICE001'; // Must match a device ID in your database

// Function to generate random sensor data
function generateRandomData() {
    return {
        temperature: 20 + Math.random() * 10, // 20-30°C
        humidity: 40 + Math.random() * 20,    // 40-60%
        pressure: 1000 + Math.random() * 20,  // 1000-1020 hPa
        CO: Math.random() * 50,               // 0-50 ppm (Warning at 30)
        LPG: Math.random() * 20,              // 0-20 ppm
        H2: Math.random() * 10,               // 0-10 ppm
        NH3: Math.random() * 5,               // 0-5 ppm
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
