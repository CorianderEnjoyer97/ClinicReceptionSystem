// Login System
document.getElementById("login-form")?.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    // Dummy Account
    if (username === "admin" && password === "admin1234") {
        alert("Login successful!");
        window.location.href = "dashboard.html"; 
    } else {
        alert("Invalid username or password. Try again.");
    }
});