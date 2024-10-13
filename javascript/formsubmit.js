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

// Insert a new row or update an existing one in the basic table
function updateBasicTableRow(employee, index) {
    console.log("employee length ", employees.length ," index value ",index)
    const basicTableBody = document.querySelector('.basic-table tbody');
    let row = document.getElementById(`row-${index}`);

    if (!row) { 
        row = document.createElement('tr');
        row.setAttribute('id', `row-${index}`);
        basicTableBody.appendChild(row);
    }

    row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td>${employee.dob}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${employee.hobbies.join(', ')}</td>
        <td>
            <button class='editbutton' onclick="editEmployee(${index})">Edit${index}</button> | 
            <button class="deletebutton" onclick="deleteEmployee(${index})">Delete</button>
        </td>
    `;
}

// Display the entire basic table
function displayBasicTable() {
    employees.forEach((employee, index) => {
        updateBasicTableRow(employee, index);
    });
}

// Create the advanced table once
function createAdvancedTable() {
    const advanceTableContainer = document.querySelector('.advance-table-container');

    // Clear existing table if any
    advanceTableContainer.innerHTML = '';

    // Create table HTML
    let tableHtml = `
        <table class="advance-table">              
            <tbody>
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
                    ${employees.map((_, index) => `
                        <td>
                            <button class='editbutton' onclick="editEmployee(${index})">Edit</button> |
                            <button class="deletebutton" onclick="deleteEmployee(${index})">Delete</button>
                        </td>
                    `).join('')}
                </tr>
            </tbody>
        </table>
    `;

    advanceTableContainer.innerHTML = tableHtml;
}

// Display the advanced table once
function displayAdvancedTable() {
    createAdvancedTable();  
}


// Display both tables on DOMContentLoaded
function displayTables() {
    displayBasicTable();
    displayAdvancedTable();
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    validateName();
    validateDOB();
    validateEmail();
    validatePhone();

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
        updateBasicTableRow(employeeData, editingIndex);
       displayAdvancedTable();
        editingIndex = null;
    } else {
        employees.push(employeeData); 
        updateBasicTableRow(employeeData, employees.length - 1);
        displayAdvancedTable();
    }

    saveToLocalStorage();
    resetForm();
}

// Reset form after submission
function resetForm() {
    document.querySelector('form').reset();
    editingIndex = null;
}

// Delete employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveToLocalStorage();

    const basicRow = document.getElementById(`row-${index}`);
    const advRow = document.getElementById(`adv-row-${index}`);
    if (basicRow) basicRow.remove();
    if (advRow) advRow.remove();

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
        checkbox.checked = employee.hobbies.includes(checkbox.nextSibling.textContent.trim());
    });

    document.getElementById(employee.gender === 'Male' ? '1' : '2').checked = true;

    editingIndex = index;
}

// Display both tables when the page loads
document.addEventListener('DOMContentLoaded', displayTables);
document.querySelector('form').addEventListener('submit', handleSubmit);
