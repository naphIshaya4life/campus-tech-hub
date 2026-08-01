
const fs = require("fs");
const path = require("path");
const pool = require("./db");

const usersFile = path.join(__dirname, "data", "users.json");

async function migrateUsers() {
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
        try {
            const exists = await pool.query(
                "SELECT id FROM users WHERE email = $1 OR matric = $2",
                [user.email, user.matric]
            );

            if (exists.rowCount > 0) {
                console.log(`⏭️ Skipped: ${user.email}`);
                skipped++;
                continue;
            }

            await pool.query(
                `INSERT INTO users
                (surname, firstname, middlename, matric, email, phone,
                 faculty, department, level, gender, password, role, created_at)
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                [
                    user.surname,
                    user.firstname,
                    user.middlename,
                    user.matric,
                    user.email,
                    user.phone,
                    user.faculty,
                    user.department,
                    user.level,
                    user.gender,
                    user.password,
                    user.role || "student",
                    user.createdAt || new Date()
                ]
            );

            console.log(`✅ Migrated: ${user.email}`);
            migrated++;

        } catch (err) {
            console.error(`❌ Failed: ${user.email}`);
            console.error(err.message);
        }
    }

    console.log("\n========================");
    console.log(`✅ Migrated: ${migrated}`);
    console.log(`⏭️ Skipped : ${skipped}`);
    console.log("========================");

    await pool.end();
}

migrateUsers();
