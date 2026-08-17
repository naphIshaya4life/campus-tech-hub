
// ==========================================
// POSTGRESQL DATABASE CONNECTION
// NAPHTECH HUB
// ONLINE + OFFLINE SUPPORT
// ==========================================

require("dotenv").config();

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is missing!");
    process.exit(1);
}

const isLocal =
    process.env.DB_MODE === "offline" ||
    process.env.DB_MODE === "local";

const poolConfig = {
    connectionString: process.env.DATABASE_URL,

    max: 10,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 10000,

    keepAlive: true
};

// ==========================================
// LOCAL / OFFLINE DATABASE
// ==========================================

if (isLocal) {

    console.log("📱 DATABASE MODE: OFFLINE / LOCAL");

    poolConfig.ssl = false;

}

// ==========================================
// ONLINE / RENDER DATABASE
// ==========================================

else {

    console.log("🌐 DATABASE MODE: ONLINE / RENDER");

    poolConfig.ssl = {
        rejectUnauthorized: false
    };

}

// ==========================================
// CREATE CONNECTION POOL
// ==========================================

const pool = new Pool(poolConfig);

// ==========================================
// DATABASE EVENTS
// ==========================================

pool.on("connect", () => {

    console.log("✅ PostgreSQL Connected");

});

pool.on("error", (err) => {

    console.error(
        "❌ Unexpected PostgreSQL pool error:",
        err
    );

});

module.exports = pool;
