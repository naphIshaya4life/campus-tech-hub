

// ======================================
// NAPHTECH HUB REGISTRATION
// ======================================

const form = document.getElementById("registerForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const user = {

        surname: document.getElementById("surname").value.trim(),

        firstname: document.getElementById("firstname").value.trim(),

        middlename: document.getElementById("middlename").value.trim(),

        matric: document.getElementById("matric").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        faculty:
            document.getElementById("faculty").value === "Other"
                ? document.getElementById("otherFaculty").value.trim()
                : document.getElementById("faculty").value,

        department:
            document.getElementById("department").value === "Other"
                ? document.getElementById("otherDepartment").value.trim()
                : document.getElementById("department").value,

        level: document.getElementById("level").value,

        gender: document.getElementById("gender").value,

        password: document.getElementById("password").value,

        confirmPassword: document.getElementById("confirmPassword").value

    };

    try {

        const response = await fetch("/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const data = await response.json();

        const message = document.getElementById("message");

        message.textContent = data.message;

        message.style.color = data.success ? "green" : "red";

        if (data.success) {

            form.reset();

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

        }

    } catch (err) {

        document.getElementById("message").textContent =
            "Server error. Please try again.";

        document.getElementById("message").style.color = "red";

        console.error(err);

    }

});


// ======================================
// OTHER FACULTY
// ======================================

function toggleOtherFaculty() {

    const faculty = document.getElementById("faculty");

    const other = document.getElementById("otherFaculty");

    if (faculty.value === "Other") {

        other.style.display = "block";

        other.required = true;

    } else {

        other.style.display = "none";

        other.required = false;

        other.value = "";

    }

}


// ======================================
// OTHER DEPARTMENT
// ======================================

function toggleOtherDepartment() {

    const department = document.getElementById("department");

    const other = document.getElementById("otherDepartment");

    if (department.value === "Other") {

        other.style.display = "block";

        other.required = true;

    } else {

        other.style.display = "none";

        other.required = false;

        other.value = "";

    }

}
