if (window.location.href.includes("admin.html")) {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
        alert("Access Denied! Please login as Admin.");
        window.location.href = "admin-login.html";
    }
}
/* ================== STORAGE ================== */
let users = JSON.parse(localStorage.getItem("users")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

/* ================== REGISTER ================== */
function register() {
    let user = document.getElementById("regUsername").value;
    let pass = document.getElementById("regPassword").value;

    if (!user || !pass) {
        alert("Please fill all fields");
        return;
    }

    if (users.find(u => u.username === user)) {
        alert("Username already exists!");
        return;
    }

    users.push({ username: user, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered Successfully!");
    window.location.href = "login.html";
}

/* ================== LOGIN ================== */
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let found = users.find(u => u.username === user && u.password === pass);

    if (found) {
        localStorage.setItem("currentUser", user);
        window.location.href = "student.html";
    } else {
        alert("Invalid Credentials");
    }
}

/* ================== STUDENT ================== */
function raiseTicket() {
    let id = "TID" + Math.floor(Math.random() * 10000);
    let cat = document.getElementById("category").value;
    let desc = document.getElementById("description").value;

    if (!cat || !desc) {
        alert("Please fill all fields");
        return;
    }

    tickets.push({
        id,
        user: localStorage.getItem("currentUser"),
        category: cat,
        description: desc,
        status: "Pending",
        priority: "Medium",
        remark: "",
        createdAt: new Date().toLocaleString()
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));
    alert("Ticket Submitted!");
    loadStudentTickets();
}

function loadStudentTickets() {
    let table = document.getElementById("ticketTable");
    if (!table) return;

    tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    table.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Description</th>
        <th>Status</th>
    </tr>`;

    tickets
        .filter(t => t.user === localStorage.getItem("currentUser"))
        .forEach(t => {
            table.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.category}</td>
                <td>${t.description}</td>
                <td>${t.status}</td>
            </tr>`;
        });
}

/* ================== ADMIN DASHBOARD ================== */
let currentPage = 1;
let ticketsPerPage = 5;
let filteredTickets = [...tickets];

/* Animated Counter */
function animateCounter(id, target) {
    let count = 0;
    let increment = Math.ceil(target / 40);

    let interval = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(interval);
        }
        document.getElementById(id).innerText = count;
    }, 20);
}
/* ================== ADMIN PROTECTION ================== */
if (window.location.href.includes("admin.html")) {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
        alert("Access Denied! Please login as Admin.");
        window.location.href = "login.html";
    }
}
/* Load Admin Dashboard */
function loadAdminDashboard() {
    tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    filteredTickets = [...tickets];

    let total = tickets.length;
    let pending = tickets.filter(t => t.status === "Pending").length;
    let resolved = tickets.filter(t => t.status === "Resolved").length;

    animateCounter("totalCount", total);
    animateCounter("pendingCount", pending);
    animateCounter("resolvedCount", resolved);

    createChart(total, pending, resolved);
    displayTickets();
}

/* Chart */
function createChart(total, pending, resolved) {
    const ctx = document.getElementById("ticketChart");
    if (!ctx) return;

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Total", "Pending", "Resolved"],
            datasets: [{
                data: [total, pending, resolved],
                backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"]
            }]
        }
    });
}

/* Display Tickets (Table + Pagination) */
function displayTickets() {
    let tbody = document.getElementById("ticketTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    let start = (currentPage - 1) * ticketsPerPage;
    let paginated = filteredTickets.slice(start, start + ticketsPerPage);

    paginated.forEach(ticket => {
        tbody.innerHTML += `
            <tr>
                <td>${ticket.id}</td>
                <td>${ticket.user}</td>
                <td>${ticket.category}</td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
            </tr>`;
    });

    setupPagination();
}

/* Pagination */
function setupPagination() {
    let pageCount = Math.ceil(filteredTickets.length / ticketsPerPage);
    let paginationDiv = document.getElementById("pagination");
    if (!paginationDiv) return;

    paginationDiv.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        paginationDiv.innerHTML += `
            <button onclick="goToPage(${i})">${i}</button>`;
    }
}

function goToPage(page) {
    currentPage = page;
    displayTickets();
}

/* Search */
function searchTickets() {
    let value = document.getElementById("searchInput").value.toLowerCase();

    filteredTickets = tickets.filter(ticket =>
        ticket.user.toLowerCase().includes(value) ||
        ticket.category.toLowerCase().includes(value)
    );

    currentPage = 1;
    displayTickets();
}

/* Dark Mode */
function toggleMode() {
    document.body.classList.toggle("dark-mode");
}

/* ================== FEEDBACK ================== */
function submitFeedback() {
    let text = document.getElementById("feedbackText").value;
    if (!text) {
        alert("Please enter feedback");
        return;
    }

    feedbacks.push(text);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    alert("Feedback Submitted!");
}

function loadFeedback() {
    let list = document.getElementById("feedbackList");
    if (!list) return;

    list.innerHTML = "";
    feedbacks.forEach(f => list.innerHTML += `<li>${f}</li>`);
}

/* ================== LOGOUT ================== */
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "index.html";
}

/* ================== AUTO LOAD ================== */
if (window.location.href.includes("admin.html")) {
    loadAdminDashboard();
}

if (window.location.href.includes("student.html")) {
    loadStudentTickets();
}

function adminLogin() {
    let user = document.getElementById("adminUsername").value;
    let pass = document.getElementById("adminPassword").value;

    if (user === "admin" && pass === "admin") {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid Admin Credentials");
    }
}