const { server } = require('./server.js');
const request = require('supertest');

describe('/api/nailpolishes', () => {
    test('Should show seed data', 
        async(done) => {
            const data = await request(server)
                .get('/api/nailpolishes');
            console.log(data.body);
            expect(data.body).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(String),
                url: expect.any(String),
                is_quickdry: expect.any(Boolean),
                brand: expect.any(String)
            });

            expect(data.statusCode).toBe(200);

            done();
        });
});