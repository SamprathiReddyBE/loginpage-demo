// src/controllers/userController.js

// Placeholder for user controller logic
const userModel = require('../models/userModel');

async function getAllUsers(req, res) {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllUsers
};
