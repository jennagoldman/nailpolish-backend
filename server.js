// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const server = express();
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public'));
// API Routes

app.get('/api/nailpolishes', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT
                id,
                name,
                price,
                url,
                is_quickdry,
                brand
            FROM nailpolishes;
        `);

        console.log(result.rows);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});

module.exports = { server: server };