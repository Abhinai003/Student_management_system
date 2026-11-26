
// FastAPI backend URL
const API_URL = "http://127.0.0.1:8000/api/students/";

// Accessing form elements
let studentForm = document.getElementById("studentForm");
let nameInput = document.getElementById("studentName");
let emailInput = document.getElementById("email");
let mobileInput = document.getElementById("mobile");
let courseInput = document.getElementById("course");
let studentTableBody = document.getElementById("studentTableBody");
let searchInput = document.getElementById("searchInput");

// Store students retrieved from PostgreSQL
let students = [];

let editIndex = null;


// GET: Fetch all students from backend
async function fetchStudents() {
    try {
        let response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        students = await response.json();

        displayStudents();

    } catch (error) {
        console.error("Error fetching students:", error);
        alert("Unable to load students. Check whether FastAPI is running.");
    }
}


// POST / PUT: Handle form submission
studentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    let student = {
        name: nameInput.value,
        email: emailInput.value,
        mobile: mobileInput.value,
        course: courseInput.value
    };

    try {
        let response;

        if (editIndex === null) {

            // POST: Add new student
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

        } else {

            // PUT: Update existing student
            response = await fetch(API_URL + editIndex, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

        }

        if (!response.ok) {
            let errorData = await response.json();
            throw new Error(JSON.stringify(errorData.detail));
        }

        editIndex = null;
        studentForm.reset();

        await fetchStudents();

    } catch (error) {
        console.error("Error saving student:", error);
        alert("Unable to save student: " + error.message);
    }
});


// Search functionality
searchInput.addEventListener("input", function() {

    let searchText = searchInput.value.toLowerCase();

    let filteredStudents = students.filter(function(student) {

        return (
            student.name.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText) ||
            student.mobile.includes(searchText) ||
            student.course.toLowerCase().includes(searchText)
        );

    });

    displayStudents(filteredStudents);

});


// DELETE: Delete student from database
async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        let response = await fetch(API_URL + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete student");
        }

        await fetchStudents();

    } catch (error) {
        console.error("Error deleting student:", error);
        alert(error.message);
    }

}


// Display students in HTML table
function displayStudents(studentList = students) {

    studentTableBody.innerHTML = "";

    studentList.forEach(function(student, index) {

        studentTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.mobile}</td>
                <td>${student.course}</td>
                <td>
                    <button onclick="editStudent(${student.id})">Edit</button>
                    <button onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `;

    });

}


// Edit student
function editStudent(id) {

    let student = students.find(function(item) {
        return item.id === id;
    });

    if (!student) {
        return;
    }

    nameInput.value = student.name;
    emailInput.value = student.email;
    mobileInput.value = student.mobile;
    courseInput.value = student.course;

    editIndex = id;

}


// Load students when page opens
fetchStudents();
