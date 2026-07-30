

const pool = require("./db");

async function testConnection() {

    try {

        const result = await pool.query("SELECT NOW()");

        console.log("✅ Database Connected!");

        console.log(result.rows[0]);

    } catch (err) {

        console.error("❌ Database Connection Failed");

        console.error(err.message);

    } finally {

        await pool.end();

    }

}

testConnection();
