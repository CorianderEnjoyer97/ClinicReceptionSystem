// Wait for the page to load before executing the JS code
document.addEventListener("DOMContentLoaded", function() {
    loadAppointments(); // Load the appointments when the page loads
});

// Add event listener to handle form submission for appointments
document.getElementById('appointment-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission from reloading the page
    addAppointment(); // Call function to handle adding an appointment
});

// Function to load appointments from localStorage and display them in the table
function loadAppointments() {
    const appointmentList = document.getElementById('appointment-list');
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Clear the table before adding new rows
    appointmentList.innerHTML = '';

    appointments.forEach((appointment) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.appointmentId}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.appointmentDate}</td>
            <td>${appointment.appointmentTime}</td>
            <td>${appointment.doctor}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editAppointment('${appointment.appointmentId}')">Edit</button>
                <button class="delete-btn" onclick="deleteAppointment('${appointment.appointmentId}')">Delete</button>
            </td>
        `;
        appointmentList.appendChild(row);
    });
}

// Function to add a new appointment
function addAppointment() {
    const appointmentId = document.getElementById('appointmentId').value;
    const patientName = document.getElementById('patientName').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const doctor = document.getElementById('doctor').value;

    // Create an object for the new appointment
    const newAppointment = {
        appointmentId,
        patientName,
        appointmentDate,
        appointmentTime,
        doctor
    };

    // Get existing appointments from localStorage or create an empty array if none exist
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    // Add the new appointment to the array
    appointments.push(newAppointment);

    // Save the updated list of appointments to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Reload the appointments table to show the new appointment
    loadAppointments();
}

// Function to handle the editing of an appointment
function editAppointment(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(appt => appt.appointmentId === appointmentId);

    if (appointment) {
        // Populate the modal with the current appointment data
        document.getElementById('modalAppointmentId').value = appointment.appointmentId;
        document.getElementById('modalPatientName').value = appointment.patientName;
        document.getElementById('modalAppointmentDate').value = appointment.appointmentDate;
        document.getElementById('modalAppointmentTime').value = appointment.appointmentTime;
        document.getElementById('modalDoctor').value = appointment.doctor;

        // Show the modal
        document.getElementById('edit-modal').style.display = 'block';
    }
}

// Close modal functionality
document.getElementById('close-modal')?.addEventListener('click', function() {
    document.getElementById('edit-modal').style.display = 'none';
});

// Function to handle saving the changes after editing
document.getElementById('edit-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const appointmentId = document.getElementById('modalAppointmentId').value;
    const updatedAppointment = {
        appointmentId,
        patientName: document.getElementById('modalPatientName').value,
        appointmentDate: document.getElementById('modalAppointmentDate').value,
        appointmentTime: document.getElementById('modalAppointmentTime').value,
        doctor: document.getElementById('modalDoctor').value,
    };

    // Update the appointment in localStorage
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const index = appointments.findIndex(appt => appt.appointmentId === appointmentId);

    if (index !== -1) {
        appointments[index] = updatedAppointment;
    }

    // Save updated appointments list to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Re-render the appointments table
    loadAppointments();

    // Close the modal
    document.getElementById('edit-modal').style.display = 'none';
});

// Function to delete an appointment from the table and localStorage
function deleteAppointment(appointmentID) {
    // Confirm deletion
    const isConfirmed = confirm("Are you sure you want to delete this appointment?");
    if (!isConfirmed) {
        return; // If not confirmed, stop the deletion process
    }

    // Retrieve appointments from localStorage
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Filter out the appointment to delete
    appointments = appointments.filter(appointment => appointment.appointmentId !== appointmentID);

    // Save updated list back to localStorage
    localStorage.setItem("appointments", JSON.stringify(appointments));

    // Reload the appointments table
    loadAppointments();

     // Clear input fields after deletion
    document.getElementById('appointment-form').reset();
}
