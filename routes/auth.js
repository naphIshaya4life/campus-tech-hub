
const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

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

    let users = getUsers();

    const exists = users.find(

        user =>

            user.email === email ||

            user.matric === matric

    );

    if (exists) {

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

    users.push(newUser);

    saveUsers(users);

    res.json({

        success: true,

        message: "Registration Successful."

    });

});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    const {

        email,

        password

    } = req.body;

    let users = getUsers();

    const user = users.find(

        u => u.email === email

    );

    if (!user) {

        return res.status(400).json({

            success: false,

            message: "Email not found."

        });

    }

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



module.exports = router;


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
