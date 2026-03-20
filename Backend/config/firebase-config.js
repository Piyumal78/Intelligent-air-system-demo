const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let db;
let auth;

try {
    // Attempt to load the service account key
    // You should modify this path or use an environment variable
    const serviceAccountPath = process.env.FIREBASE_KEY_PATH || path.join(__dirname, 'serviceAccountKey.json');

    // Check if file exists roughly or just try to require it
    // Note: require might fail if file not found
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Firebase Admin Initialized Successfully");
    db = admin.firestore();
    auth = admin.auth();
} catch (error) {
    console.warn("WARNING: Firebase Admin could not be initialized. Check if serviceAccountKey.json exists in config/ or FIREBASE_KEY_PATH is set.");
    console.error(error.message);

    // Mock DB/Auth for verification/development without keys
    console.log("Using MOCK Firebase implementation.");
    db = {
        collection: () => ({
            doc: () => ({
                set: async () => { },
                get: async () => ({ exists: false, data: () => ({}) }),
                update: async () => { }
            }),
            get: async () => ({ docs: [] })
        }),
        batch: () => ({
            set: () => { },
            commit: async () => { }
        })
    };
    auth = {
        createUser: async () => ({ uid: 'mock-uid' }),
        listUsers: async () => ({ users: [] }),
        verifyIdToken: async () => ({ uid: 'mock-uid', role: 'admin' })
    };
}

module.exports = { db, auth, admin };
