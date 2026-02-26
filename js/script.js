let users = JSON.parse(localStorage.getItem("users")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

/* ---------------- REGISTER ---------------- */
function register(){
    let user = document.getElementById("regUsername").value;
    let pass = document.getElementById("regPassword").value;

    users.push({username:user,password:pass});
    localStorage.setItem("users",JSON.stringify(users));

    alert("Registered Successfully!");
    window.location.href="login.html";
}

/* ---------------- LOGIN ---------------- */
function login(){
    let user=document.getElementById("username").value;
    let pass=document.getElementById("password").value;

    if(user==="admin" && pass==="admin"){
        window.location.href="admin.html";
        return;
    }

    let found=users.find(u=>u.username===user && u.password===pass);

    if(found){
        localStorage.setItem("currentUser",user);
        window.location.href="student.html";
    }else{
        alert("Invalid Credentials");
    }
}

/* ---------------- STUDENT ---------------- */
function raiseTicket(){
    let id="TID"+Math.floor(Math.random()*10000);
    let cat=document.getElementById("category").value;
    let desc=document.getElementById("description").value;

    tickets.push({
        id,
        user:localStorage.getItem("currentUser"),
        category:cat,
        description:desc,
        status:"Pending",
        priority:"Medium",
        remark:"",
        createdAt:new Date().toLocaleString()
    });

    localStorage.setItem("tickets",JSON.stringify(tickets));
    alert("Ticket Submitted!");
    loadStudentTickets();
}

function loadStudentTickets(){
    let table=document.getElementById("ticketTable");
    if(!table) return;

    table.innerHTML=`
    <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Description</th>
        <th>Status</th>
    </tr>`;

    tickets
      .filter(t=>t.user===localStorage.getItem("currentUser"))
      .forEach(t=>{
        table.innerHTML+=`
        <tr>
            <td>${t.id}</td>
            <td>${t.category}</td>
            <td>${t.description}</td>
            <td class="status-${t.status.toLowerCase().replace(" ","")}">
                ${t.status}
            </td>
        </tr>`;
      });
}

/* ---------------- ADMIN ---------------- */
function loadAdminTickets(filtered=tickets){
    let table=document.getElementById("adminTicketTable");
    if(!table) return;

    table.innerHTML=`
    <tr>
        <th>ID</th>
        <th>User</th>
        <th>Category</th>
        <th>Description</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Remark</th>
        <th>Action</th>
    </tr>`;

    filtered.forEach(t=>{
        table.innerHTML+=`
        <tr>
            <td>${t.id}</td>
            <td>${t.user}</td>
            <td>${t.category}</td>
            <td>${t.description}</td>

            <td>
                <select onchange="updatePriority('${t.id}',this.value)">
                    <option ${t.priority==="Low"?"selected":""}>Low</option>
                    <option ${t.priority==="Medium"?"selected":""}>Medium</option>
                    <option ${t.priority==="High"?"selected":""}>High</option>
                </select>
            </td>

            <td class="status-${t.status.toLowerCase().replace(" ","")}">
                ${t.status}
            </td>

            <td>
                <input type="text"
                       value="${t.remark||""}"
                       onchange="updateRemark('${t.id}',this.value)">
            </td>

            <td>
                <button onclick="updateStatus('${t.id}','In Progress')">Start</button>
                <button onclick="updateStatus('${t.id}','Resolved')">Resolve</button>
            </td>
        </tr>`;
    });
}

function updatePriority(id,val){
    let t=tickets.find(x=>x.id===id);
    t.priority=val;
    localStorage.setItem("tickets",JSON.stringify(tickets));
}

function updateRemark(id,val){
    let t=tickets.find(x=>x.id===id);
    t.remark=val;
    localStorage.setItem("tickets",JSON.stringify(tickets));
}

function updateStatus(id,status){
    let t=tickets.find(x=>x.id===id);
    t.status=status;
    localStorage.setItem("tickets",JSON.stringify(tickets));
    loadAdminTickets();
}

/* search */
function searchTickets(){
    const value=document.getElementById("searchBox").value.toLowerCase();
    const filtered=tickets.filter(t =>
        t.user.toLowerCase().includes(value) ||
        t.category.toLowerCase().includes(value)
    );
    loadAdminTickets(filtered);
}

/* filter */
function filterTickets(){
    const status=document.getElementById("statusFilter").value;
    if(status==="All") loadAdminTickets(tickets);
    else loadAdminTickets(tickets.filter(t=>t.status===status));
}

/* feedback */
function submitFeedback(){
    let text=document.getElementById("feedbackText").value;
    feedbacks.push(text);
    localStorage.setItem("feedbacks",JSON.stringify(feedbacks));
    alert("Feedback Submitted!");
}

function loadFeedback(){
    let list=document.getElementById("feedbackList");
    if(!list) return;
    list.innerHTML="";
    feedbacks.forEach(f=>list.innerHTML+=`<li>${f}</li>`);
}

function logout(){
    localStorage.removeItem("currentUser");
    window.location.href="index.html";
}