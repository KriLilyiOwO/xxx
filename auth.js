// --- USER DATABASE ---
const accounts = [
    { username: "admin@chewiwi.com", password: "admin123", role: "admin" },
    { username: "user@chewiwi.com", password: "user123", role: "user" }
];

// --- LOGIN LOGIC ---
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passInput').value;

    const user = accounts.find(a => a.username === email && a.password === pass);

    if (user) {
        // Save user session to browser
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Success! Logged in as " + user.role);
        
        // Close modal and redirect
        window.location.href = (user.role === "admin") ? "admin.html" : "index.html";
    } else {
        alert("Invalid email or password.");
    }
}

// --- LOGOUT LOGIC ---
function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// --- DYNAMIC NAVBAR UPDATE ---
function updateNavbar() {
    const navRight = document.getElementById('nav-actions'); 
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // If a user is logged in, rewrite the right side of the navbar
    if (user && navRight) {
        navRight.innerHTML = `
            <a href="cart.html" class="btn btn-link text-dark me-2 position-relative text-decoration-none">
                <i class="bi bi-cart3 h5"></i>
            </a>
            
            <div class="vr me-3" style="height: 20px; opacity: 0.2;"></div>

            <div class="d-flex align-items-center">
                <span class="me-3 small fw-bold text-muted">${user.role === 'admin' ? '🛠️ ADMIN' : '👤 USER'}</span>
                ${user.role === 'admin' ? '<a href="admin.html" class="btn btn-sm btn-outline-dark me-2 fw-bold">Dashboard</a>' : ''}
                <button class="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-bold" onclick="logoutUser()">Logout</button>
            </div>
        `;
    }
}

// Run this function every time the page finishes loading
document.addEventListener('DOMContentLoaded', updateNavbar);
