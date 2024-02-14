const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();
const port = 5500;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use(userRoutes);
app.use(authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
