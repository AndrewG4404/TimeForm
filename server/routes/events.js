const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();

// Set up MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Route to get an event by date
router.get('/event-by-date', (req, res) => {
    const eventDate = req.query.date; // Expecting a date in YYYY-MM-DD or similar format

    if (!eventDate) {
        return res.status(400).json({ error: "Date parameter is required." });
    }

    // Query to find a historical event closest to the provided date
    const query = `
        SELECT * FROM events 
        WHERE event_date = ?
        ORDER BY ABS(DATEDIFF(event_date, ?))
        LIMIT 1
    `;

    db.query(query, [eventDate, eventDate], (err, results) => {
        if (err) {
            console.error("Error retrieving event:", err);
            return res.status(500).json({ error: "Failed to retrieve event." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No event found for the specified date." });
        }

        res.status(200).json(results[0]);
    });
});

module.exports = router;
