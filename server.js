
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// STATIC FILES
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// API ROUTE
// ===============================
app.get("/api", (req, res) => {
    res.json({
        project: "Campus Tech Hub",
        developer: "Naphtali Ishaya",
        version: "1.0.0",
        status: "Running 🚀"
    });
});

// ===============================
// 404 PAGE
// ===============================
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you requested does not exist.</p>
    `);
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("=======================================");
    console.log("🎓 CAMPUS TECH HUB");
    console.log("=======================================");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Local URL : http://127.0.0.1:${PORT}`);
    console.log(`📚 API URL   : http://127.0.0.1:${PORT}/api`);
    console.log("=======================================");
});
