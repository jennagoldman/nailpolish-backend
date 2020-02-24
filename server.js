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
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/nailpolishes', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT
                nailpolishes.*,
                brands.name as brand
            FROM nailpolishes
            JOIN brands
            ON nailpolishes.brand_id = brands.id
            ORDER BY nailpolishes.brand_id ASC;
        `);

        console.log(result.rows);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.post('/api/nailpolishes', async(req, res) => {
    try {
        const result = await client.query(`
            INSERT INTO nailpolishes (name, price, brand_id, url, is_quickdry)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `,
            // source code had req.body.typeId
        [req.body.name, req.body.price, req.body.brandId, req.body.url, req.body.isQuickdry]
        );

        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/nailpolish/:nailpolishId', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM nailpolishes
            WHERE nailpolishes.id=$1`,
            
        [req.params.nailpolishId]
        );

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/brands', async(req, res) => {
    try {
        const result = await client.query(`
        SELECT * 
        FROM brands
        ORDER BY name;
        `);

        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
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