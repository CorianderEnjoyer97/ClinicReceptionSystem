// ========== QUEUE MANAGEMENT SYSTEM ==========
let queue = JSON.parse(localStorage.getItem("queue")) || [];
let queueList;

// Update the queue table display
function updateQueueDisplay() {
    queueList = document.getElementById("queue-list");
    if (!queueList) return;

    queueList.innerHTML = "";
    queue.forEach((patient, index) => {
        let row = document.createElement("tr");

        let queueNo = document.createElement("td");
        queueNo.textContent = index + 1;

        let name = document.createElement("td");
        name.textContent = patient;

        row.appendChild(queueNo);
        row.appendChild(name);
        queueList.appendChild(row);
    });

    localStorage.setItem("queue", JSON.stringify(queue));
}

// Open a modal and focus input
function openModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        let inputField = modal.querySelector("input");
        if (inputField) inputField.focus();
    }
}

// Close a modal and clear input
function closeModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        let inputField = modal.querySelector("input");
        if (inputField) inputField.value = "";
    }
}

// Add a patient to the queue
function confirmAddPatient() {
    let patientNameInput = document.getElementById("patientName");
    if (!patientNameInput) return;

    let patientName = patientNameInput.value.trim();
    queue = JSON.parse(localStorage.getItem("queue")) || [];

    if (!patientName) {
        alert("Please enter a valid patient name.");
        return;
    }

    queue.push(patientName);
    localStorage.setItem("queue", JSON.stringify(queue));
    updateQueueDisplay();

    alert(`Patient "${patientName}" added successfully.`);
    closeModal("addPatientModal");
}

// Remove a patient from the queue
function confirmRemovePatient() {
    let patientNameInput = document.getElementById("removePatientName");
    if (!patientNameInput) return;

    let patientName = patientNameInput.value.trim();
    queue = JSON.parse(localStorage.getItem("queue")) || [];

    if (!patientName) {
        alert("Please enter a patient name.");
        return;
    }

    let index = queue.indexOf(patientName);
    if (index !== -1) {
        queue.splice(index, 1);
        localStorage.setItem("queue", JSON.stringify(queue));
        updateQueueDisplay();
        alert(`Patient "${patientName}" removed successfully.`);
    } else {
        alert("Patient not found.");
    }

    closeModal("removePatientModal");
}

// Call the next patient
function callNextPatient() {
    if (queue.length > 0) {
        alert(`Calling: ${queue[0]}`);
        queue.shift();
        updateQueueDisplay();
    } else {
        alert("No patients in queue.");
    }
}

// Clear the queue
function clearQueue() {
    if (confirm("Are you sure you want to clear the queue?")) {
        queue = [];
        localStorage.setItem("queue", JSON.stringify(queue));
        updateQueueDisplay();
    }
}

funtionadd
document.addEventListener("DOMContentLoaded", function () {
    updateQueueDisplay();

    // Ensure modals are hidden unless explicitly called
    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });

    // Attach event listeners to buttons (fixes dynamic loading issue)
    attachQueueEventListeners();
});

// Reattach event listeners after `queue.html` loads dynamically
function attachQueueEventListeners() {
    document.getElementById("addPatientBtn")?.addEventListener("click", function () {
        openModal("addPatientModal");
    });

    document.getElementById("removePatientBtn")?.addEventListener("click", function () {
        openModal("removePatientModal");
    });

    document.getElementById("callNextBtn")?.addEventListener("click", function () {
        callNextPatient();
    });

    document.getElementById("clearQueueBtn")?.addEventListener("click", function () {
        clearQueue();
    });
}

// Ensure queue updates after loading dynamically inside the dashboard
if (document.getElementById("queue-list")) {
    updateQueueDisplay();
    attachQueueEventListeners();
}

 