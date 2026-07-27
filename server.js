
// ==========================================
// NAPHTECH HUB SERVER
// Version: 2.0.0
// Developer: Naphtali Ishaya
// ==========================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/auth");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "naphtechhub_secret_key",
        resave: false,
        saveUninitialized: false,
    })
);

// ==========================================
// STATIC FILES
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// ROUTES
// ==========================================

app.use("/auth", authRoutes);

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================================
// API INFORMATION
// ==========================================

app.get("/api", (req, res) => {

    res.json({

        project: "NAPHTECH HUB",

        platform: "Campus Tech Hub",

        developer: "Naphtali Ishaya",

        version: "2.0.0",

        status: "Running 🚀",

        message: "Welcome to NAPHTECH HUB API"

    });

});

// ==========================================
// 404 PAGE
// ==========================================

app.use((req, res) => {

    res.status(404).send(`

        <center style="font-family:Arial;padding:50px">

        <h1>🚫 404</h1>

        <h2>Page Not Found</h2>

        <p>

        The page you requested does not exist.

        </p>

        <a href="/">🏠 Return Home</a>

        </center>

    `);

});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.clear();

    console.log("");

    console.log("==============================================");

    console.log("🚀 NAPHTECH HUB SERVER");

    console.log("==============================================");

    console.log("🎓 Platform : Campus Tech Hub");

    console.log("👨🏾‍💻 Developer : Naphtali Ishaya");

    console.log("📦 Version : 2.0.0");

    console.log("🟢 Status : Running");

    console.log("");

    console.log(`🌐 Local : http://127.0.0.1:${PORT}`);

    console.log(`📚 API   : http://127.0.0.1:${PORT}/api`);

    console.log("");

    console.log("==============================================");

});
