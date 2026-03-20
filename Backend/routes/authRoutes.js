const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase-config');

// Middleware to verify Admin Token (Optional, for strictly protected routes)
const verifyAdmin = async (req, res, next) => {
    // Implementation for verifying ID token using auth.verifyIdToken(token)
    // Extract token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decodedToken = await auth.verifyIdToken(token);
        // Check if user is admin (custom claim or lookup)
        // For now, just allow if valid token
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Unauthorized' });
    }
};

// Create User (Admin Only)
router.post('/register', async (req, res) => {
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

// List Users
router.get('/users', async (req, res) => {
    try {
        const listUsersResult = await auth.listUsers(100);
        // Enhance with Firestore data if needed, or just return Auth data
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            metadata: user.metadata
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
