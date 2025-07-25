// ========== 1. LOGOUT SYSTEM ==========
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ========== 2. LOAD PAGE FUNCTION ==========
function loadPage(page, title) {
    document.getElementById("page-title").innerHTML = title;
    console.log(`Loading page: ${page}`);

    // Hide all modals when switching pages
    document.querySelectorAll(".modal").forEach(modal => (modal.style.display = "none"));

    // Remove any previously loaded scripts before adding a new one
    document.querySelectorAll("script[data-dynamic]").forEach(script => script.remove());

    // Fetch and load the requested page
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;

            // Load the correct JavaScript file for the page
            loadPageScript(page);
        })
        .catch(error => console.error("Error loading page:", error));
}

// Load specific JavaScript file for each page
function loadPageScript(page) {
    const pageScripts = {
        "register.html": "javascript/register.js",
        "appointments.html": "javascript/appointments.js",
        "invoice.html": "javascript/invoice.js",
        "medicalrecord.html": "javascript/medicalrecord.js",
        "queue.html": "javascript/queue.js"
    };

    if (pageScripts[page]) {
        let script = document.createElement("script");
        script.src = pageScripts[page];
        script.setAttribute("data-dynamic", "true");
        script.onload = function () {
            console.log(`Script loaded: ${script.src}`);

            // Re-attach event listeners for each page
            if (page === "queue.html") {
                updateQueueDisplay();
                attachQueueEventListeners();
            } else {
                attachCRUDListeners();
            }
        };
        document.body.appendChild(script);
    }
}

function attachCRUDListeners() {
    document.querySelectorAll(".add-btn")?.forEach(btn => {
        btn.addEventListener("click", function () {
            openModal(btn.dataset.modal);
        });
    });

    document.querySelectorAll(".delete-btn")?.forEach(btn => {
        btn.addEventListener("click", function () {
            confirmDeleteEntry(btn.dataset.target);
        });
    });

    document.querySelectorAll(".edit-btn")?.forEach(btn => {
        btn.addEventListener("click", function () {
            editEntry(btn.dataset.target);
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    attachCRUDListeners();
    loadMonthlyCalendar(); // Initialize the monthly calendar when the page loads
});

// ========== 3. MONTHLY CALENDAR FUNCTION ==========
function loadMonthlyCalendar() {
    console.log("Initializing monthly calendar...");
    const calendarTable = document.querySelector(".calendar tbody");
    const monthDisplay = document.getElementById("monthDisplay");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    let currentMonthOffset = 0;

    function getMonthKey(offset) {
        const today = new Date();
        today.setMonth(today.getMonth() + offset);
        return `${today.getFullYear()}-${today.getMonth() + 1}`;
    }

    function updateMonth(offset) {
        currentMonthOffset = offset;
        const today = new Date();
        today.setMonth(today.getMonth() + offset);
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Update the month display
        if (monthDisplay) {
            monthDisplay.textContent = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        }

        // Clear previous calendar data
        calendarTable.innerHTML = generateCalendarGrid(firstDayOfMonth, daysInMonth);

        // Retrieve stored appointments from localStorage
        let savedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];

        // Display appointments in the calendar
        savedAppointments.forEach(appointment => {
            let appointmentDate = new Date(appointment.appointmentDate);
            let appointmentDay = appointmentDate.getDate();
            let appointmentMonth = appointmentDate.getMonth();
            let appointmentYear = appointmentDate.getFullYear();

            if (appointmentMonth === month && appointmentYear === year) {
                let slot = document.querySelector(`.slot[data-day="${appointmentDay}"]`);
                if (slot) {
                    slot.innerHTML += `<div class="appointment">${appointment.patientName} - ${appointment.appointmentTime}</div>`;
                }
            }
        });
    }

    // Month Navigation
    prevMonthBtn.addEventListener("click", () => updateMonth(currentMonthOffset - 1));
    nextMonthBtn.addEventListener("click", () => updateMonth(currentMonthOffset + 1));

    updateMonth(currentMonthOffset); // Initialize calendar on load
}

// Function to generate the monthly calendar grid
function generateCalendarGrid(firstDay, daysInMonth) {
    let rows = "";
    let day = 1;

    for (let i = 0; i < 6; i++) { // Maximum 6 rows for a month
        rows += "<tr>";
        for (let j = 0; j < 7; j++) { // 7 days in a week
            if (i === 0 && j < firstDay) {
                rows += "<td></td>"; // Empty cells before the start of the month
            } else if (day > daysInMonth) {
                rows += "<td></td>"; // Empty cells after the last day
            } else {
                rows += `<td class="slot" data-day="${day}">${day}</td>`;
                day++;
            }
        }
        rows += "</tr>";
    }
    return rows;
}

// ========== 4. SHOW HOME FUNCTION ==========
function showHome() {
    window.location.href = "dashboard.html"; 
}
