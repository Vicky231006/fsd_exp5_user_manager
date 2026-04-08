const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware order matters! Parse first, then log
app.use(cors());
app.use(express.json());

// 1. Request Logger Middleware
// This will log every single request that hits your server
app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] 🛰️  ${req.method} request to ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Payload:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// 2. Database Connection Logs
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("------------------------------------------");
        console.log("✅ SUCCESS: Connected to MongoDB Atlas");
        console.log(`📡 Host: ${mongoose.connection.host}`);
        console.log(`📂 DB Name: ${mongoose.connection.name}`);
        console.log("------------------------------------------");
    })
    .catch(err => {
        console.log("❌ ERROR: Could not connect to MongoDB");
        console.error(err);
    });

// 3. Mongoose Operation Logs (Very useful for debugging)
// This logs the actual queries Mongoose sends to Atlas
mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`\x1b[36m%s\x1b[0m`, `🔍 MONGO: ${collectionName}.${method}`, JSON.stringify(query));
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ignited on http://localhost:${PORT}`);
});