const { db, firebase } = require('../Backend/config/firebase-config');

async function dismissAllAlerts() {
    try {
        console.log("Waiting for Firebase Authentication...");
        const auth = firebase.auth();
        await new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    unsubscribe();
                    resolve();
                }
            });
            // Timeout after 15 seconds if no auth
            setTimeout(() => {
                unsubscribe();
                reject(new Error("Firebase Auth timeout."));
            }, 15000);
        });

        console.log("Authenticated as:", auth.currentUser.email);
        const snapshot = await db.collection('alerts').where('status', '==', 'new').get();
        console.log(`Found ${snapshot.size} active alerts to dismiss.`);
        
        if (snapshot.size === 0) {
            console.log("No active alerts found.");
            process.exit(0);
        }

        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.update(doc.ref, { 
                status: 'dismissed',
                dismissedAt: new Date().toISOString()
            });
        });
        
        await batch.commit();
        console.log("All active alerts have been successfully dismissed in the database.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
}

dismissAllAlerts();
