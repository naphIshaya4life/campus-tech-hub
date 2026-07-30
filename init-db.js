
// ==========================================
// NAPHTECH HUB DATABASE INITIALIZER
// Version 3.0
// ==========================================

const pool = require("./db");

async function initializeDatabase() {

    try {

        await pool.query(`

            CREATE TABLE IF NOT EXISTS users (

                id SERIAL PRIMARY KEY,

                surname VARCHAR(100),

                firstname VARCHAR(100),

                middlename VARCHAR(100),

                matric VARCHAR(100) UNIQUE,

                email VARCHAR(255) UNIQUE NOT NULL,

                phone VARCHAR(20),

                faculty VARCHAR(255),

                department VARCHAR(255),

                level VARCHAR(50),

                gender VARCHAR(20),

                password TEXT NOT NULL,

                role VARCHAR(20) DEFAULT 'student',

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            );

        `);

        console.log("✅ Users table created successfully.");

    } catch (err) {

        console.error("❌ Database initialization failed.");

        console.error(err.message);

    } finally {

        await pool.end();

    }

}

initializeDatabase();
