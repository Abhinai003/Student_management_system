//accessing form elements

let studentForm = document.getElementById("studentForm");
let nameInput = document.getElementById("studentName");
let emailInput = document.getElementById("email");
let mobileInput = document.getElementById("mobile");
let courseInput = document.getElementById("course");
let studentTableBody = document.getElementById("studentTableBody");
let searchInput = document.getElementById("searchInput");

//Array to store student records
let students = JSON.parse(localStorage.getItem("students")) || [];


let editIndex = null;


console.log(studentForm);
console.log(nameInput);
console.log(emailInput);
console.log(mobileInput);
console.log(courseInput);
console.log(studentTableBody);


//Handling form submission
studentForm.addEventListener("submit",function(event){
    event.preventDefault();
    
    let student = {
        name: nameInput.value,
        email: emailInput.value,
        mobile: mobileInput.value,
        course: courseInput.value
    };

    if (editIndex === null) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = null;
    }
saveStudents();
displayStudents();

studentForm.reset();

    console.log(students);
});


//for filter/search
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




//delete functionality
function deleteStudent(index) {

    students.splice(index, 1);

    saveStudents();
    displayStudents();

    console.log(students);

}



function displayStudents(studentList = students) {

    studentTableBody.innerHTML = "";

    studentList.forEach(function(student) {

        let index = students.indexOf(student);

        studentTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.mobile}</td>
                <td>${student.course}</td>
                <td>
                    <button onclick="editStudent(${index})">Edit</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;

    });

}

//editing function
function editStudent(index) {

    let student = students[index];

    nameInput.value = student.name;
    emailInput.value = student.email;
    mobileInput.value = student.mobile;
    courseInput.value = student.course;

    editIndex = index;

}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

displayStudents();