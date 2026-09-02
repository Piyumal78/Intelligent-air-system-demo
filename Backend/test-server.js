const http = require('http');

console.log("Testing Backend Server...");

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`[${method} ${path}] Status: ${res.statusCode}`);
                console.log(`Response: ${body.substring(0, 100)}...`); // Truncate
                resolve();
            });
        });

        req.on('error', error => {
            console.error(`[${method} ${path}] Error: ${error.message}`);
            resolve(); // Resolve anyway to continue testing
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    // 1. Test Root
    await testEndpoint('/');

    // 2. Test Get Devices (should be empty array or error if no firebase)
    await testEndpoint('/api/devices');

    // 3. Test Register Device (Mock)
    await testEndpoint('/api/devices', 'POST', {
        id: 'TEST_DEVICE_001',
        location: 'Test Lab',
        assignedTo: 'Tester'
    });
}

// Wait for server to potentially start
setTimeout(runTests, 2000);
