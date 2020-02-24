require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./data.js');
const brands = require('./brands.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        // "Promise all" does a parallel execution of async tasks
        const savedBrands = await Promise.all(
            brands.map(async brand => {
                const result = await client.query(`
                    INSERT INTO brands (name)
                    VALUES ($1)
                    RETURNING *;
                `,
                [brand]);

                return result.rows[0];
            })
        );
            // map every item in the array data
        await Promise.all(    
            data.map(nailpolish => {
                const brand = savedBrands.find(brand => {
                    return brand.name === nailpolish.brand;
                });

                return client.query(`
                    INSERT INTO nailpolishes (name, price, url, is_quickdry, brand_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
                [nailpolish.name, nailpolish.price, nailpolish.url, nailpolish.is_quickdry, brand.id]);
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