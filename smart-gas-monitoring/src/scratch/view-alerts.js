const { db } = require('../Backend/config/firebase-config');

async function viewAlerts() {
    try {
        const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').limit(5).get();
        console.log("Total alerts in database:", snapshot.size);
        snapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Data:`, doc.data());
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

viewAlerts();
