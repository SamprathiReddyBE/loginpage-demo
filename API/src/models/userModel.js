// src/models/userModel.js

// Placeholder for user model logic
// src/models/userModel.js

const db = require('../db/connection');

async function getAllUsers() {
    try {
        const [rows, fields] = await db.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllUsers
};


module.exports = {
    getAllUsers
};
