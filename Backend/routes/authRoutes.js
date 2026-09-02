const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase-config');

// Middleware to verify Admin Token
const verifyAdmin = async (req, res, next) => {
    // Extract token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decodedToken = await auth.verifyIdToken(token);
        
        // Retrieve the user record from Firestore to verify their role
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({ error: 'Access denied. User profile not found.' });
        }
        
        const userData = userDoc.data();
        if (userData.role !== 'admin' && userData.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        }
        
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("verifyAdmin authentication error:", error.message);
        res.status(403).json({ error: 'Unauthorized' });
    }
};

// Create User (Admin Only)
router.post('/register', verifyAdmin, async (req, res) => {
    const { email, password, username, role, deviceId } = req.body;

    try {
        // 1. Create in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: username
        });

        // 2. Create in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            username,
            email,
            role: role || 'user',
            deviceId: deviceId || null,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
});

// List Users (Admin Only)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        // Retrieve users from Firestore to include roles and device assignments
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            uid: doc.id,
            ...doc.data()
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete User (Admin Only)
router.delete('/users/:uid', verifyAdmin, async (req, res) => {
    const { uid } = req.params;
    try {
        // 1. Delete from Firebase Auth
        await auth.deleteUser(uid);

        // 2. Delete from Firestore
        await db.collection('users').doc(uid).delete();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
