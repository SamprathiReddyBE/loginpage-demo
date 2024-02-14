const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection.js');
const authController = require('../controllers/authController.js');


// Registration Endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the username already exists in the database
        const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Username already registered' });
        }

        // Insert the new user into the database
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user' });
    }
});

//  the login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are present
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password are Required' });
    }

    try {
        console.log('Received login request:', { username, password });

        // Query the database for the user with the provided username or email
        const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        console.log('Database query result:', existingUsers);

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'No user found with the provided username or email' });
        }

        const hashedPassword = existingUsers[0].password;
        const match = await bcrypt.compare(password, hashedPassword);

        if (match) {
            const token = jwt.sign({ userId: existingUsers[0].id }, 'my_secret_key', { expiresIn: '1h' });
            return res.json({ message: 'Login Successful', token });
        } else {
            return res.status(401).json({ message: 'Invalid Password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Error logging in user' });
    }
});

// Authentication Middleware using JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const extractedToken = token.split(' ')[1];
    try {
        // verify and validate our token
        const decoded = jwt.verify(extractedToken, 'my_secret_key');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

// Profile Endpoint
router.get('/profile', authenticate, async (req, res) => {
    const userId = req.userId;
    try {
        // Fetch only the username from the database
        const [userData] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);

        // Check if user data is found
        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract username from userData
        const { username } = userData[0];

        // Send response with username
        return res.json({ username });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Error fetching user profile' });
    }
});
// Route to update the password
router.put('/update-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Username and new password are required' });
    }

    try {
        // Retrieve user from the database
        const [userData] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, username]);

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Error updating password' });
    }
});


module.exports = router;
