const express = require('express');
const router = express.Router();
const db = require('../db/connection.js');

// Function to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Route to fetch all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        return res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch user by username or email
router.get('/users/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params; // Ensure identifier is correctly extracted
        console.log('Received request for user:', identifier); // Move logging statement here

        // Check if the identifier is in email format
        const isEmailFormat = validateEmail(identifier);
        const username = isEmailFormat ? identifier.split('@')[0] : identifier;

        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(users[0]); // Assuming there's only one user with a given username
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to check if a username exists
router.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return res.json({ exists: existingUsers.length > 0 });
    } catch (error) {
        console.error('Error checking username:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
