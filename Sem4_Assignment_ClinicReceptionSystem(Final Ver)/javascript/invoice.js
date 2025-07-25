// Select elements
const form = document.getElementById('invoice-form');
const tableBody = document.getElementById('invoice-list');
const editModal = document.getElementById("edit-invoice-modal");
const closeModalBtn = document.getElementById("close-invoice-modal");
const editForm = document.getElementById("edit-invoice-form");

// Hide modal on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log('Invoice JavaScript is running!');
    tableBody.innerHTML = ""; // Clear existing rows to avoid duplication
    editModal.style.display = "none";
    loadInvoices();
});

// Event listener for form submission
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    // Get form input values
    let invoiceNo = document.getElementById("invoiceNo").value.trim();
    let invoicePatientId = document.getElementById("invoicePatientId").value.trim();
    let consultDate = document.getElementById("consultDate").value.trim();
    let billAmount = document.getElementById("billAmount").value.trim();

    // Validation to ensure all fields are filled
    if (!invoiceNo || !invoicePatientId || !consultDate || !billAmount) {
        alert("Please fill in all fields!");
        return;
    }

    // Get invoices data from localStorage
    let invoices = JSON.parse(localStorage.getItem("invoicesData")) || [];

    // Check if invoice number already exists in localStorage
    if (invoices.some(invoice => invoice.invoiceNo === invoiceNo)) {
        alert("An invoice with this number already exists.");
        return;
    }

    // Create a new invoice object
    const newInvoice = {
        invoiceNo: invoiceNo,
        invoicePatientId: invoicePatientId,
        consultDate: consultDate,
        billAmount: billAmount
    };

    // Add new invoice to localStorage
    invoices.push(newInvoice);
    localStorage.setItem("invoicesData", JSON.stringify(invoices));

    // Reload table
    loadInvoices();

    // Clear the form fields after submission
    form.reset();
});

// Function to dynamically add an invoice row to the table
function addInvoiceToTable(invoice) {
    console.log("Adding invoice to table", invoice);
    const row = tableBody.insertRow();

    row.innerHTML = `
        <td>${invoice.invoiceNo}</td>
        <td>${invoice.invoicePatientId}</td>
        <td>${invoice.consultDate}</td>
        <td>${invoice.billAmount}</td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="openEditInvoiceModal(this)">Edit</button>
            <button class="delete-btn" onclick="deleteInvoice(this)">Delete</button>
        </td>
    `;
}

// Function to load saved invoices from localStorage
function loadInvoices() {
    tableBody.innerHTML = ""; // Clear table before inserting
    const invoices = JSON.parse(localStorage.getItem("invoicesData")) || [];
    invoices.forEach(invoice => addInvoiceToTable(invoice));
}

// Function to delete an invoice from the table and localStorage
function deleteInvoice(button) {
    const row = button.parentElement.parentElement;
    const invoiceNo = row.cells[0].textContent; // Get invoice number

    // Confirm deletion
    const isConfirmed = confirm("Are you sure you want to delete this invoice?");
    if (!isConfirmed) {
        return;
    }

    // Remove from localStorage
    let invoices = JSON.parse(localStorage.getItem("invoicesData")) || [];
    invoices = invoices.filter(invoice => invoice.invoiceNo !== invoiceNo);
    localStorage.setItem("invoicesData", JSON.stringify(invoices));

    // Remove from table
    row.remove();
}

// Function to edit invoice details
function openEditInvoiceModal(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName("td");
    document.getElementById("edit-invoiceNo").value = cells[0].textContent;
    document.getElementById("edit-invoicePatientId").value = cells[1].textContent;
    document.getElementById("edit-consultDate").value = cells[2].textContent;
    document.getElementById("edit-billAmount").value = cells[3].textContent;

    editModal.style.display = "block";

    editForm.onsubmit = function (event) {
        event.preventDefault();

        const updatedInvoicePatientId = document.getElementById("edit-invoicePatientId").value;
        const updatedConsultDate = document.getElementById("edit-consultDate").value;
        const updatedBillAmount = document.getElementById("edit-billAmount").value;

        // Update the invoice in localStorage
        let invoices = JSON.parse(localStorage.getItem("invoicesData")) || [];
        let invoice = invoices.find(inv => inv.invoiceNo === cells[0].textContent);
        if (invoice) {
            invoice.invoicePatientId = updatedInvoicePatientId;
            invoice.consultDate = updatedConsultDate;
            invoice.billAmount = updatedBillAmount;
            localStorage.setItem("invoicesData", JSON.stringify(invoices));
        }

        // Reload table
        loadInvoices();

        // Close the modal
        editModal.style.display = "none";
    };
}

// Close modal when clicking the close button
closeModalBtn.addEventListener("click", function () {
    console.log("Modal close button clicked.");
    editModal.style.display = "none";
});
