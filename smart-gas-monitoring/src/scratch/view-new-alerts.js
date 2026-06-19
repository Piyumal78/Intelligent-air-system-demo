const { db } = require('../Backend/config/firebase-config');

async function viewNewAlerts() {
    try {
        const snapshot = await db.collection('alerts').where('status', '==', 'new').get();
        console.log("Total NEW alerts in database:", snapshot.size);
        snapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Data:`, doc.data());
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

viewNewAlerts();
