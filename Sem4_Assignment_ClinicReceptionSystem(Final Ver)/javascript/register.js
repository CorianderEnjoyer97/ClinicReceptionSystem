console.log('JavaScript is running');

// Event listener for form submission
document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    // Get form input values
    let patientID = document.getElementById("id").value.trim();
    let icNumber = document.getElementById("ic").value.trim();
    let fullName = document.getElementById("name").value.trim();
    let dob = document.getElementById("dob").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();

    // Validation to ensure all fields are filled
    if (!patientID || !icNumber || !fullName || !dob || !phone || !email) {
        alert("Please fill in all fields!");
        return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    // Validate phone number (just a simple check for digits and length)
    const phonePattern = /^[0-9]{9,15}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    // Get patients data from localStorage
    let patients = JSON.parse(localStorage.getItem("patientsData")) || [];

    // Check if patient ID already exists in localStorage
    if (patients.some(patient => patient.id === patientID)) {
        alert("A patient with this ID already exists.");
        return;
    }

    // Create a new patient object
    const newPatient = {
        id: patientID,
        ic: icNumber,
        name: fullName,
        dob: dob,
        phone: phone,
        email: email
    };

    // Add new patient to localStorage
    patients.push(newPatient);
    localStorage.setItem("patientsData", JSON.stringify(patients));

    // Add new patient to the table dynamically
    addPatientToTable(newPatient);

    document.addEventListener("DOMContentLoaded", loadPatients);

    // Clear the form fields after submission
    document.getElementById("register-form").reset();
});

// Function to dynamically add a patient row to the table
function addPatientToTable(patient) {
    console.log("Adding patient to table", patient);
    const table = document.getElementById("patient-list");
    const row = table.insertRow();

    // Insert new cells with patient data
    row.innerHTML = `
        <td>${patient.id}</td>
        <td>${patient.ic}</td>
        <td>${patient.name}</td>
        <td>${patient.dob}</td>
        <td>${patient.phone}</td>
        <td>${patient.email}</td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="editPatient(this)">Edit</button>
            <button class="delete-btn" onclick="deletePatient(this)">Delete</button>
        </td>
    `;
}

// Function to load saved patients from localStorage
function loadPatients() {
    console.log("Loading patients from localStorage...");
    const patients = JSON.parse(localStorage.getItem("patientsData")) || [];
    console.log("Patients retrieved from localStorage:", patients);
    patients.forEach(patient => {
        addPatientToTable(patient);
    });
}

// Function to delete a patient from the table and localStorage
function deletePatient(button) {
    const row = button.parentElement.parentElement;
    const patientID = row.cells[0].textContent; // Get patient ID

    // Confirm deletion
    const isConfirmed = confirm("Are you sure you want to delete this patient?");
    if (!isConfirmed) {
        return; // If not confirmed, stop the deletion process
    }

    // Remove from localStorage
    let patients = JSON.parse(localStorage.getItem("patientsData")) || [];
    patients = patients.filter(patient => patient.id !== patientID);
    localStorage.setItem("patientsData", JSON.stringify(patients));

    // Remove from table
    row.remove();
}

// Function to edit patient details
function editPatient(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName("td");

    // Populate the modal with the current patient's data
    document.getElementById("edit-ic").value = cells[1].textContent;
    document.getElementById("edit-name").value = cells[2].textContent;
    document.getElementById("edit-dob").value = cells[3].textContent;
    document.getElementById("edit-phone").value = cells[4].textContent;
    document.getElementById("edit-email").value = cells[5].textContent;

    // Debugging: Check if this line is being executed
    console.log("Modal data populated, showing modal...");

    // Show the modal
    document.getElementById("edit-modal").style.display = "block"; // This should make the modal visible

    // Store the patient's ID for later use when saving the changes
    document.getElementById("edit-form").onsubmit = function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the new values from the form
        const updatedIC = document.getElementById("edit-ic").value;
        const updatedName = document.getElementById("edit-name").value;
        const updatedDOB = document.getElementById("edit-dob").value;
        const updatedPhone = document.getElementById("edit-phone").value;
        const updatedEmail = document.getElementById("edit-email").value;

        // Update the table
        cells[1].textContent = updatedIC;
        cells[2].textContent = updatedName;
        cells[3].textContent = updatedDOB;
        cells[4].textContent = updatedPhone;
        cells[5].textContent = updatedEmail;

        // Update the patient in localStorage
        let patients = JSON.parse(localStorage.getItem("patientsData")) || [];
        let patient = patients.find(p => p.id === cells[0].textContent);
        if (patient) {
            patient.ic = updatedIC;
            patient.name = updatedName;
            patient.dob = updatedDOB;
            patient.phone = updatedPhone;
            patient.email = updatedEmail;
            localStorage.setItem("patientsData", JSON.stringify(patients));
        }

        // Close the modal
        document.getElementById("edit-modal").style.display = "none"; // This will hide the modal after submission
    };
}

// Close the modal when the close button is clicked
document.getElementById("close-modal").addEventListener("click", function () {
    console.log("Modal close button clicked.");
    document.getElementById("edit-modal").style.display = "none"; // Hide the modal
});
