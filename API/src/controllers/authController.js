// src/controllers/authController.js

// Placeholder for authentication controller logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        // Fetch user from database by username
        const user = await userModel.getUserByUsername(username);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'my_secret_key', { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    loginUser
};
