
const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API Test Route
app.get("/api", (req, res) => {
    res.json({
        project: "Campus Tech Hub",
        developer: "Naphtali Ishaya",
        status: "Running 🚀"
    });
});

// Start the server
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Campus Tech Hub running at http://0.0.0.0:${PORT}`);
});

// Keep the server alive
setInterval(() => {
    console.log("💚 Server Alive...");
}, 5000);
