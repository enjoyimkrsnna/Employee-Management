/*
    Author: Krishna Singh
    Date: 10-10-2024
    Description: This JavaScript file contains methods for simple CRUD (create, read, update, delete) operations.
*/

let employees = JSON.parse(localStorage.getItem('employees')) || [];
let editingIndex = null;

// Saving to local storage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Validation Functions
const validationFunctions = {
    name: validateName,
    dob: validateDOB,
    email: validateEmail,
    phone: validatePhone,
};

Object.keys(validationFunctions).forEach(field => {
    document.getElementById(field).addEventListener("input", validationFunctions[field]);
});

function validateName() {
    const name = document.getElementById("name").value;
    if (!/^[A-Za-z0-9 ]{4,20}$/.test(name)) {
        showError("name", "Name must be 4-20 characters long and can only contain letters, numbers, and spaces.");
    } else {
        clearError("name");
    }
}

function validateDOB() {
    const dobDate = new Date(document.getElementById("dob").value);
    const today = new Date();
    if (dobDate >= today) {
        showError("dob", "Date of Birth must be in the past");
    } else {
        clearError("dob");
    }
}

function validateEmail() {
    const email = document.getElementById("email").value;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        showError("email", "Please enter a valid email address");
    } else {
        clearError("email");
    }
}

function validatePhone() {
    const phone = document.getElementById("phone").value;
    if (!/^\d{10}$/.test(phone)) {
        showError("phone", "Phone number must be exactly 10 digits");
    } else {
        clearError("phone");
    }
}

function showError(field, message) {
    document.getElementById(`${field}Error`).innerHTML = message;
    document.getElementById(field).classList.add("error-border");
}

function clearError(field) {
    document.getElementById(`${field}Error`).innerHTML = "";
    document.getElementById(field).classList.remove("error-border");
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    console.log("form submitted")
    // Validate all fields before processing
    validateName();
    validateDOB();
    validateEmail();
    validatePhone();

    // Check for any errors
    if (document.querySelectorAll('.error-border').length > 0) {
        return; 
    }

    const employeeData = {
        name: document.getElementById('name').value,
        gender: document.querySelector('input[name="gender"]:checked').nextElementSibling.textContent,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(checkbox => checkbox.nextSibling.textContent.trim())
    };

    if (editingIndex !== null) {
        employees[editingIndex] = employeeData;
        editingIndex = null; 
    } else {
        employees.push(employeeData);
    }

    saveToLocalStorage();
    displayTables();
    resetForm();
}

function resetForm() {
    document.querySelector('form').reset();
    editingIndex = null;
}

// Row clicked event handler
function rowclicked(index) {
    editEmployee(index);
}

// Update displaying basic table data
function displayBasicTable() {
    console.log("hey from basic table")
    const basicTableBody = document.querySelector('.basic-table tbody');
    
    // Clear existing rows
    basicTableBody.innerHTML = ''; 

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        // row.setAttribute('onclick', `rowclicked(${index})`);
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.dob}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.hobbies.join(', ')}</td>
            <td>
                <button class='editbutton' onclick="editEmployee(${index})" >Edit</button> | 
                <button class="deletebutton" onclick="deleteEmployee(${index})">Delete</button>
            </td>
        `;
        
        basicTableBody.appendChild(row);
    });
}

// Update displaying Advanced table data
function displayAdvancedTable() {
    console.log("hey from advance table")
    const advanceTableContainer = document.querySelector('.advance-table-container');

    // Clear existing table if any
    advanceTableContainer.innerHTML = '';

    if (employees.length === 0) {
        advanceTableContainer.innerHTML = '<p>No employees available.</p>';
        return;
    }

    let tableHtml = `
        <table class="advance-table">
            <thead>
                <tr>
                    <th>Name</th>
                    ${employees.map(employee => `<td>${employee.name}</td>`).join('')}
                </tr>
                <tr>
                    <th>Gender</th>
                    ${employees.map(employee => `<td>${employee.gender}</td>`).join('')}
                </tr>
                <tr>
                    <th>DOB</th>
                    ${employees.map(employee => `<td>${employee.dob}</td>`).join('')}
                </tr>
                <tr>
                    <th>Email</th>
                    ${employees.map(employee => `<td>${employee.email}</td>`).join('')}
                </tr>
                <tr>
                    <th>Phone No</th>
                    ${employees.map(employee => `<td>${employee.phone}</td>`).join('')}
                </tr>
                <tr>
                    <th>Hobbies</th>
                    ${employees.map(employee => `<td>${employee.hobbies.join(', ')}</td>`).join('')}
                </tr>

                <tr>
                    <th>Actions</th>
                    ${employees.map((employee, index) => `
                        <td>
                            <button class='editbutton'onclick="editEmployee(${index})">Edit</button> |
                            <button class="deletebutton" onclick="deleteEmployee(${index})">Delete</button>
                        </td>
                    `).join('')}
                </tr>

            </thead>
        </table>
    `;

    advanceTableContainer.innerHTML = tableHtml;
}

// Delete employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveToLocalStorage();
    displayTables();
}

// Edit employee
function editEmployee(index) {
    const employee = employees[index];

    document.getElementById('name').value = employee.name;
    document.getElementById('dob').value = employee.dob;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;

    document.querySelectorAll('input[name="hobbies"]').forEach(checkbox => {
        checkbox.checked = employee.hobbies.includes(checkbox.value);
    });

    document.getElementById(employee.gender === 'Male' ? '1' : '2').checked = true;

    editingIndex = index;
}

// Display tables on DOMContentLoaded
function displayTables() {
    displayBasicTable();
    displayAdvancedTable();
}

document.addEventListener('DOMContentLoaded', displayTables);
document.querySelector('form').addEventListener('submit', handleSubmit);