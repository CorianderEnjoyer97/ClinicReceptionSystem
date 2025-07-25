// Select elements
const form = document.getElementById('medicalrecord-form');
const tableBody = document.getElementById('medical-record-list');
const editModal = document.getElementById("edit-medicalrecord-modal");
const closeModalBtn = document.getElementById("close-medicalrecord-modal");
const editForm = document.getElementById("edit-medicalrecord-form");

// Load medical records on page refresh
document.addEventListener("DOMContentLoaded", () => {
    console.log("Medical Record JavaScript is running!");
    tableBody.innerHTML = ""; // Clear table before loading
    loadMedicalRecords();
});

    // Add event listener for edit & delete buttons inside the table
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            editRecord(event.target); // Call edit function ONLY when clicking "Edit"
        }
        if (event.target.classList.contains("delete-btn")) {
            deleteRecord(event.target); // Call delete function ONLY when clicking "Delete"
        }
    });

// Add event listener for form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form input values
    let recordNo = document.getElementById("recordNo").value.trim();
    let medicalPatientId = document.getElementById("medicalPatientId").value.trim();
    let recordDate = document.getElementById("recordDate").value.trim();
    let description = document.getElementById("description").value.trim();

    // Validation to ensure all fields are filled
    if (!recordNo || !medicalPatientId || !recordDate || !description) {
        alert("Please fill in all fields!");
        return;
    }

    // Get medical records from localStorage
    let records = JSON.parse(localStorage.getItem("medicalRecordsData")) || [];

    // Check if record number already exists
    if (records.some(record => record.recordNo === recordNo)) {
        alert("A medical record with this number already exists.");
        return;
    }

    // Create a new medical record object
    const newRecord = { recordNo, medicalPatientId, recordDate, description };

    // Add new record to localStorage
    records.push(newRecord);
    localStorage.setItem("medicalRecordsData", JSON.stringify(records));

    // Reload table
    loadMedicalRecords();

    // Clear the form fields after submission
    form.reset();
});

// Function to dynamically add a record row to the table
function addRecordToTable(record) {
    console.log("Adding medical record to table", record);
    const row = tableBody.insertRow();

    row.innerHTML = `
        <td>${record.recordNo}</td>
        <td>${record.medicalPatientId}</td>
        <td>${record.recordDate}</td>
        <td>${record.description}</td>
        <td class="action-buttons">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;
}

// Function to load saved medical records from localStorage
function loadMedicalRecords() {
    console.log("Loading medical records from localStorage...");
    tableBody.innerHTML = ""; // Clear table before inserting

    let records = JSON.parse(localStorage.getItem("medicalRecordsData")) || [];

    console.log("Medical records retrieved from localStorage:", records);

    records.forEach(record => addRecordToTable(record));
}

// Function to delete a medical record
function deleteRecord(button) {
    const row = button.parentElement.parentElement;
    const recordNo = row.cells[0].textContent; // Get record number

    // Confirm deletion
    const isConfirmed = confirm("Are you sure you want to delete this medical record?");
    if (!isConfirmed) {
        return; // Stop deletion if not confirmed
    }

    // Remove from localStorage
    let records = JSON.parse(localStorage.getItem("medicalRecordsData")) || [];
    records = records.filter(record => record.recordNo !== recordNo);
    localStorage.setItem("medicalRecordsData", JSON.stringify(records));

    // Remove from table
    row.remove();
}

// Function to edit a medical record (Modal-Based)
function editRecord(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName("td");

    // Populate modal with current record details
    document.getElementById("edit-recordNo").value = cells[0].textContent;
    document.getElementById("edit-medicalPatientId").value = cells[1].textContent;
    document.getElementById("edit-recordDate").value = cells[2].textContent;
    document.getElementById("edit-description").value = cells[3].textContent;

    // Show modal
    editModal.style.display = "block";

    // Save changes on form submit
    editForm.onsubmit = function (event) {
        event.preventDefault();

        // Get updated values
        const updatedPatientId = document.getElementById("edit-medicalPatientId").value;
        const updatedRecordDate = document.getElementById("edit-recordDate").value;
        const updatedDescription = document.getElementById("edit-description").value;
        const recordNo = document.getElementById("edit-recordNo").value; // Keep record number the same

        // Update localStorage
        let records = JSON.parse(localStorage.getItem("medicalRecordsData")) || [];
        let record = records.find(rec => rec.recordNo === recordNo);

        if (record) {
            record.medicalPatientId = updatedPatientId;
            record.recordDate = updatedRecordDate;
            record.description = updatedDescription;
            localStorage.setItem("medicalRecordsData", JSON.stringify(records));
        }

        // Reload table
        loadMedicalRecords();

        // Close modal
        editModal.style.display = "none";
    };
}

// Close modal when clicking the close button
closeModalBtn.addEventListener("click", function () {
    console.log("Modal close button clicked.");
    editModal.style.display = "none";
});
