const knex = require("knex");

const db = knex({
    client: "pg",
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    },
    version: 13,
    pool: {
        min: 2,
        max: 10,
    },
});

module.exports = db;