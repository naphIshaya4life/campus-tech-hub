

// ==========================================
// NAPHTECH HUB SERVER
// Campus Tech Hub
// ==========================================
//
// Developer : Naphtali Ishaya
// Version   : 3.2.0
// Status    : Production Ready
//
// Stack:
// - Node.js
// - Express.js
// - PostgreSQL
// - Render Cloud
//
// Features:
// - Student Registration
// - Secure Login
// - Admin Dashboard
// - PostgreSQL Database
// - Session Authentication
// - REST API
// - GitHub Deployment
// - Database Backup System
//
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const session = require("express-session");

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/auth");
const {
    requireLogin,
    requireAdmin
} = require("./middleware/auth");
// ==========================================
// CREATE EXPRESS APP
// ==========================================


const app = express();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes."
    }
});

app.use(helmet({
    contentSecurityPolicy: false
}));


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);



// ==========================================
// STATIC FILES
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================


// ==========================================
// ROUTES
// ==========================================

app.use("/auth/login", loginLimiter);
app.use("/auth", authRoutes);

// ==========================================
// PREVENT CACHING OF PROTECTED PAGES
// ==========================================

app.use((req, res, next) => {

    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
    );

    res.setHeader("Pragma", "no-cache");

    res.setHeader("Expires", "0");

    next();

});


// ==========================================
// PROTECTED STUDENT DASHBOARD
// ==========================================

app.get("/dashboard", requireLogin, (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "student_dashboard.html")
    );

});


// ==========================================
// PROTECTED ADMIN DASHBOARD
// ==========================================

app.get("/admin", requireLogin, (req, res) => {

    if (req.session.user.role !== "admin") {

        return res.redirect("/login.html");

    }

    res.sendFile(
        path.join(__dirname, "public", "admin_dashboard.html")
    );

});


// ==========================================
// CURRENT LOGGED-IN USER API
// ==========================================

app.get("/api/user", requireLogin, (req, res) => {

    res.json(req.session.user);

});



// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});



// ==========================================
// GET ALL REGISTERED STUDENTS
// ADMIN API
// ==========================================

const fs = require("fs");

app.get("/api/students", requireAdmin, async (req, res) => {

try {

    const result = await pool.query(`
        SELECT
            id,
            surname,
            firstname,
            middlename,
            matric,
            email,
            phone,
            faculty,
            department,
            level,
            gender,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return res.json(result.rows);

} catch (err) {

    console.error("Admin students error:", err);

    return res.status(500).json({
        success: false,
        message: "Unable to load students."
    });

}


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
const pool = require("./db");

(async () => {
    try {

        const result = await pool.query("SELECT NOW()");

        console.log("✅ Server PostgreSQL:", result.rows[0]);

    } catch (err) {

        console.error("❌ Server PostgreSQL Error:");

        console.error(err);

    }

})();



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
