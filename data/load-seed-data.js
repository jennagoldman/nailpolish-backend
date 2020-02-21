require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./data.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            data.map(item => {

                return client.query(`
                    INSERT INTO nailpolishes (name, price, image_url, is_quickdry, brand)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
                [item.name, item.price, item.image_url, item.is_quickdry, item.brand]);
                // Don't forget to "return" the client.query promise!
                
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}