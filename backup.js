
// ==========================================
// NAPHTECH HUB BACKUP MANAGER
// ==========================================

require("dotenv").config();

const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("❌ DATABASE_URL is missing.");
    process.exit(1);
}

const backupDir = path.join(
    __dirname,
    "backups",
    "manual"
);

fs.mkdirSync(backupDir, {
    recursive: true
});

const timestamp = new Date()
    .toISOString()
    .replace("T", "_")
    .replace(/:/g, "-")
    .replace(/\..+/, "");

const backupFile = path.join(
    backupDir,
    `campus_tech_hub_${timestamp}.sql`
);

console.log("");
console.log("==========================================");
console.log("💾 NAPHTECH HUB BACKUP MANAGER");
console.log("==========================================");
console.log("");
console.log("⏳ Creating backup...");
console.log(`📁 Destination: ${backupFile}`);
console.log("");

const output = fs.createWriteStream(backupFile);

const pgDump = execFile(
    "pg_dump",
    [
        "--no-owner",
        "--no-acl",
        databaseUrl
    ]
);

pgDump.stdout.pipe(output);

pgDump.stderr.on("data", (data) => {
    process.stderr.write(data);
});

pgDump.on("error", (error) => {

    output.close();

    if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
    }

    console.error("");
    console.error("❌ BACKUP FAILED");
    console.error(error.message);

    process.exit(1);
});

pgDump.on("close", (code) => {

    output.close();

    if (code !== 0) {

        if (fs.existsSync(backupFile)) {
            fs.unlinkSync(backupFile);
        }

        console.error("");
        console.error(`❌ BACKUP FAILED — pg_dump exited with code ${code}`);

        process.exit(code);
    }

    const stats = fs.statSync(backupFile);

    if (stats.size === 0) {

        fs.unlinkSync(backupFile);

        console.error("");
        console.error("❌ BACKUP FAILED — empty backup file.");

        process.exit(1);
    }

    console.log("✅ BACKUP SUCCESSFUL");
    console.log("");
    console.log(`📦 File: ${path.basename(backupFile)}`);
    console.log(`📊 Size: ${stats.size} bytes`);
    console.log("");
    console.log("==========================================");
});
