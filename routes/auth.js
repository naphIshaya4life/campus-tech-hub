
const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");
const pool = require("../db");
// ==========================================
// READ USERS
// ==========================================

function getUsers() {

    if (!fs.existsSync(usersFile)) {

        fs.writeFileSync(usersFile, "[]");

    }

    return JSON.parse(fs.readFileSync(usersFile, "utf8"));

}

// ==========================================
// SAVE USERS
// ==========================================

function saveUsers(users) {

    fs.writeFileSync(

        usersFile,

        JSON.stringify(users, null, 4)

    );

}

// ==========================================
// REGISTER STUDENT
// ==========================================

router.post("/register", async (req, res) => {

    const {

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

        password,

        confirmPassword

    } = req.body;

    if (

        !surname ||

        !firstname ||

        !matric ||

        !email ||

        !phone ||

        !faculty ||

        !department ||

        !level ||

        !gender ||

        !password ||

        !confirmPassword

    ) {

        return res.status(400).json({

            success: false,

            message: "Please fill all required fields."

        });

    }

    if (password !== confirmPassword) {

        return res.status(400).json({

            success: false,

            message: "Passwords do not match."

        });

    }

const existing = await pool.query(
    `SELECT id
     FROM users
     WHERE email = $1 OR matric = $2`,
    [email, matric]
);

if (existing.rowCount > 0) {
    return res.status(400).json({
        success: false,
        message: "Student already exists."
    });
}




    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {

        id: Date.now(),

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

        password: hashedPassword,


        // ==========================================
        // USER ROLE
        // ==========================================

        role: "student",

        createdAt: new Date().toISOString()

    };



try {

    await pool.query(
        `INSERT INTO users
        (
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
            password,
            role
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        )`,
        [
            newUser.surname,
            newUser.firstname,
            newUser.middlename,
            newUser.matric,
            newUser.email,
            newUser.phone,
            newUser.faculty,
            newUser.department,
            newUser.level,
            newUser.gender,
            newUser.password,
            newUser.role
        ]
    );

} catch (err) {

if (err.code === "23505") {
    return res.status(400).json({
        success: false,
        message: "Email or Matric Number already exists."
    });
}

    console.error("========== POSTGRESQL INSERT ERROR ==========");
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error("Detail:", err.detail);
    console.error("Constraint:", err.constraint);
    console.error("Stack:", err.stack);

    return res.status(500).json({
        success: false,
        message: err.message
    });

}




return res.json({
    success: true,
    message: "Registration successful."
});
});






// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

const result = await pool.query(
    `SELECT * FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email.trim()]
);

if (result.rowCount === 0) {
    return res.status(400).json({
        success: false,
        message: "Email not found."
    });
}

const user = result.rows[0];





    const valid = await bcrypt.compare(

        password,

        user.password

    );

    if (!valid) {

        return res.status(400).json({

            success: false,

            message: "Incorrect password."

        });

    }

    req.session.user = {

        id: user.id,

        surname: user.surname,

        firstname: user.firstname,

        matric: user.matric,

        email: user.email,

        phone: user.phone,

        faculty: user.faculty,

        department: user.department,

        level: user.level,

        role: user.role

    };

    res.json({

        success: true,

        message: "Login Successful.",

        user: req.session.user

    });

});









// ==========================================
// LOGOUT
// Destroy user session
// ==========================================

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Logout failed.");
        }

        res.clearCookie("connect.sid");
        res.redirect("/login.html");
    });
});

module.exports = router;
