// src/models/authModel.js

// Placeholder for authentication model logic
const db = require('../db/connection');

async function getUserByUsername(username) {
    try {
        const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserByUsername
};
