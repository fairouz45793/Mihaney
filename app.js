console.log("app.js starts")
// Corporate Workflow & File-Sharing Hub - Strict Role Hierarchy
// 1 Admin, 1 Manager, 5 Service Chefs, 20 Employees (no overlap)

import { loginUser } from './modules/auth.js';
import { showApp, updateHeader } from './modules/ui.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (e) => {
    console.log("login form beggins");
    e.preventDefault();
    const u = document.getElementById('loginUsername').value;
    const p = document.getElementById('loginPassword').value;

    const { data, error } = await loginUser(u, p);
    console.log(u, "  ,   ", p)

    if (data) {
        localStorage.setItem('currentUser', JSON.stringify(data));
        showApp();
        updateHeader(data);
        // Load tasks here...
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
    console.log("login form ends");
});

async function getAllEmployees() {
    const { data, error } = await supabase
        .from('employees')
        .select('*'); // '*' means get all columns

    if (error) {
        console.error("Error fetching employees:", error);
        return;
    }
    
    console.log("Employees List:", data);
    return data;
}

/*function generateOrganization() {
    const employees = [];
    const used = new Set();
    let id = 1;
    for (let service = 1; service <= 5; service++) {
        const count = EMPLOYEE_COUNTS[service];
        for (let i = 0; i < count; i++) {
            let name;
            do {
                const first = firstNames[Math.floor(Math.random() * firstNames.length)];
                const last = lastNames[Math.floor(Math.random() * lastNames.length)];
                name = `${first} ${last}`;
            } while (used.has(name));
            used.add(name);
            employees.push({ id: id++, name, role: 'employee', service });
        }
    }
    return employees;
}*/

// Initial data: 20 employees, exact allocation, no overlap
// let employees = generateOrganization();
let role;
let currentUser = { id: 1, name: "", role: ''};
let tasks = {};
let currentService = 1;
// let notifications = [];
let messages = [];
// let adminFiles = ['Policy_2024.pdf', 'Guidelines.docx', 'Template.xlsx'];
// let declineTaskId = null;
// let taskIdCounter = 1000;

const taskTemplates = [
    'Review quarterly report', 'Update client database', 'Prepare presentation',
    'Audit expense reports', 'Schedule team meeting', 'Draft proposal',
    'Verify compliance docs', 'Process invoices', 'Update documentation',
    'Coordinate delivery', 'Follow up with vendor', 'Prepare budget forecast'
];

function generateTasks() {
    const tasks = {};
    for (let s = 1; s <= 5; s++) {
        tasks[s] = [];
        const serviceEmployees = employees.filter(e => e.service === s);
        const count = Math.min(serviceEmployees.length, 4 + Math.floor(Math.random() * 3)); // 4-6 tasks per service
        for (let i = 0; i < count; i++) {
            const statuses = ['pending', 'pending', 'pending', 'complete', 'stuck'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const emp = serviceEmployees[Math.floor(Math.random() * serviceEmployees.length)];
            if (!emp) continue;
            tasks[s].push({
                id: `s${s}-t${i + 1}`,
                title: taskTemplates[Math.floor(Math.random() * taskTemplates.length)],
                assignedTo: emp.id,
                assignedToName: emp.name,
                status,
                service: s,
                fileUploaded: status === 'complete',
                poked: false,
                privateTask: false
            });
        }
    }
    return tasks;
}

// let tasks = generateTasks();
let privateTasks = [];

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const appContainer = document.getElementById('app');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const menuSidebar = document.getElementById('menuSidebar');
const menuNav = document.getElementById('menuNav');
const currentUserEl = document.getElementById('currentUser');
const roleBadge = document.getElementById('roleBadge');
const parametersBtn = document.getElementById('parametersBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const notificationBtn = document.getElementById('notificationBtn');
const notificationCount = document.getElementById('notificationCount');
const notificationsPanel = document.getElementById('notificationsPanel');
const notificationsList = document.getElementById('notificationsList');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatSidebar = document.getElementById('chatSidebar');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatMessages = document.getElementById('chatMessages');
const chatEmployeeSelect = document.getElementById('chatEmployeeSelect');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const taskTableBody = document.getElementById('taskTableBody');
const tableTitle = document.getElementById('tableTitle');
const statsCard = document.getElementById('statsCard');
const parametersModal = document.getElementById('parametersModal');
const addTaskModal = document.getElementById('addTaskModal');
const closeParamsBtn = document.getElementById('closeParamsBtn');
const employeeList = document.getElementById('employeeList');
const newEmployeeName = document.getElementById('newEmployeeName');
const newEmployeeService = document.getElementById('newEmployeeService');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const fileList = document.getElementById('fileList');
const newFileName = document.getElementById('newFileName');
const addFileBtn = document.getElementById('addFileBtn');
const newTaskTitle = document.getElementById('newTaskTitle');
const newTaskService = document.getElementById('newTaskService');
const newTaskEmployee = document.getElementById('newTaskEmployee');
const cancelAddTaskBtn = document.getElementById('cancelAddTaskBtn');
const confirmAddTaskBtn = document.getElementById('confirmAddTaskBtn');
const declineModal = document.getElementById('declineModal');
const declineJustification = document.getElementById('declineJustification');
const cancelDeclineBtn = document.getElementById('cancelDeclineBtn');
const confirmDeclineBtn = document.getElementById('confirmDeclineBtn');


function setCurrentUser(role, employeeId = null, chefService = null) {
    /*currentUser.role = role;
    if (role === 'admin') {
        currentUser.name = 'Admin User';
        currentUser.id = 'admin';
    } else if (role === 'manager') {
        currentUser.name = 'Manager User';
        currentUser.id = 'manager';
    } else if (role === 'chef') {
        const svc = chefService ?? 1;
        currentUser.name = `Chef - Service ${svc}`;
        currentUser.id = 'chef';
        currentUser.service = parseInt(svc);
    } else {
        const empId = employeeId ?? employees[0].id;
        const emp = employees.find(e => e.id == empId) || employees[0];
        currentUser.name = emp.name;
        currentUser.id = emp.id;
        currentUser.service = emp.service;
    }
    currentUserEl.textContent = loginUsername;
    roleBadge.textContent = roleNames[role];
    roleBadge.className = 'px-2 py-0.5 rounded text-xs font-medium ' +
        (role === 'admin' ? 'bg-red-600' : role === 'manager' ? 'bg-amber-600' : role === 'chef' ? 'bg-purple-600' : 'bg-blue-600');*/

    // Show/hide UI based on role
    parametersBtn.classList.toggle('hidden', role !== 'admin');
    parametersBtn.classList.toggle('flex', role === 'admin');
    chatToggleBtn.classList.toggle('hidden', role !== 'manager' && role !== 'chef');
    chatToggleBtn.classList.toggle('flex', role === 'manager' || role === 'chef');
    addTaskBtn.classList.toggle('hidden', role !== 'manager');
    addTaskBtn.classList.toggle('inline-flex', role === 'manager');
    notificationBtn.classList.toggle('hidden', role !== 'employee');
    if (role === 'chef') {
        currentService = currentUser.service;
    }

    buildMenu();
    updateUI();
}

/*async function loginUser(event) {
    event.preventDefault(); // Prevents the page from refreshing
  
    // 1. Get values from your HTML inputs
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
  
    // 2. Query your 'employees' table for a match
    const { data, error } = await supabase
      .from('employees')
      .select('no, username, role, service_group') // Only get the info we need
      .eq('username', userVal)
      .eq('password', passVal) // Check if password matches
      .single(); // We only expect one matching row
  
    if (error || !data) {
      alert("Invalid username or password. Please try again.");
      console.error("Login Error:", error);
      return;
    }
  
    // 3. Success! Store the user info in 'localStorage'
    // This helps the website remember who is logged in on other pages.
    localStorage.setItem('currentUser', JSON.stringify(data));
  
    alert(`Welcome back, ${data.username}! Logging in as ${data.role}...`);
  
    // 4. Redirect based on role
    redirectToDashboard(data.role);
}*/
  
function redirectToDashboard(role) {
    // You can point these to different HTML files or sections of your site
    if (role === 'admin') {
      window.location.href = 'admin_dashboard.html';
    } else if (role === 'manager') {
      window.location.href = 'manager_dashboard.html';
    } else {
      window.location.href = 'employee_dashboard.html';
    }
}


function buildMenu() {
    menuNav.innerHTML = '';
    const role = currentUser.role;

    if (role === 'admin') {
        menuNav.innerHTML = `
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="1">Service 1</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="2">Service 2</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="3">Service 3</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="4">Service 4</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="5">Service 5</a>
            <div class="border-t border-slate-700 my-2"></div>
            <button id="menuParamsBtn" class="w-full text-left px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Parameters
            </button>
        `;
        document.getElementById('menuParamsBtn')?.addEventListener('click', () => parametersBtn.click());
    } else if (role === 'manager') {
        menuNav.innerHTML = `
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="1">Service 1</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="2">Service 2</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="3">Service 3</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="4">Service 4</a>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700" data-service="5">Service 5</a>
        `;
    } else if (role === 'chef') {
        const svc = currentUser.service || 1;
        menuNav.innerHTML = `
            <p class="px-3 py-2 text-slate-500 text-sm">Your Department</p>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700 active" data-service="${svc}">Service ${svc} Menu</a>
        `;
    } else {
        menuNav.innerHTML = `
            <p class="px-3 py-2 text-slate-500 text-sm">My Tasks</p>
            <a href="#" class="menu-link flex items-center px-3 py-2 rounded mb-1 text-slate-300 hover:bg-slate-700 active" data-service="my-tasks">My Tasks</a>
        `;
    }

    menuNav.querySelectorAll('.menu-link[data-service]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const svc = link.dataset.service;
            if (svc === 'my-tasks') return;
            currentService = parseInt(svc);
            updateUI();
            updateMenuActive();
        });
    });
}

function updateMenuActive() {
    menuNav.querySelectorAll('.menu-link').forEach(link => {
        const svc = link.dataset.service;
        link.classList.toggle('active', (svc && parseInt(svc) === currentService) || (svc === 'my-tasks' && currentUser.role === 'employee'));
    });
}

function getVisibleTasks() {
    if (currentUser.role === 'employee') {
        const allServiceTasks = [1, 2, 3, 4, 5].flatMap(s => (tasks[s] || []).filter(t => !t.privateTask));
        const assignedToMe = allServiceTasks.filter(t => t.assignedTo === currentUser.id);
        return { public: assignedToMe, private: privateTasks };
    }
    if (currentUser.role === 'chef') {
        const serviceTasks = tasks[currentUser.service] || [];
        return { public: serviceTasks.filter(t => !t.privateTask), private: [] };
    }
    const serviceTasks = currentUser.role === 'manager' || currentUser.role === 'admin'
        ? [1, 2, 3, 4, 5].flatMap(s => (tasks[s] || []).filter(t => !t.privateTask))
        : (tasks[currentService] || []).filter(t => !t.privateTask);
    return { public: serviceTasks, private: [] };
}

function getStatusClass(status) {
    if (status === 'complete') return 'status-done';
    if (status === 'stuck') return 'status-stuck';
    return 'status-active';
}

function getStatusLabel(status) {
    const labels = { pending: 'Active', complete: 'Done', stuck: 'Stuck/Declined', poked: 'Poked' };
    return labels[status] || status;
}

function updateStatistics() {
    let serviceTasks;
    if (currentUser.role === 'manager' || currentUser.role === 'admin') {
        serviceTasks = [1, 2, 3, 4, 5].flatMap(s => (tasks[s] || []).filter(t => !t.privateTask));
    } else if (currentUser.role === 'chef') {
        serviceTasks = (tasks[currentUser.service] || []).filter(t => !t.privateTask);
    } else {
        serviceTasks = (tasks[currentService] || []).filter(t => !t.privateTask);
    }
    const done = serviceTasks.filter(t => t.status === 'complete').length;
    const active = serviceTasks.filter(t => t.status === 'pending' || t.status === 'poked').length;
    const stuck = serviceTasks.filter(t => t.status === 'stuck').length;
    const total = serviceTasks.length;
    const completion = total ? Math.round((done / total) * 100) : 0;

    document.getElementById('completionPercent').textContent = completion + '%';
    document.getElementById('doneCount').textContent = done;
    document.getElementById('pendingCount').textContent = active;
    document.getElementById('stuckCount').textContent = stuck;
    document.getElementById('totalCount').textContent = total;
    const title = currentUser.role === 'manager' || currentUser.role === 'admin' ? 'All Services' :
        currentUser.role === 'chef' ? `Service ${currentUser.service}` : `Service ${currentService}`;
    document.getElementById('statsTitle').textContent = title + ' Statistics';
}

function canPoke(task) {
    if (currentUser.role === 'manager') return task.status === 'pending' && !task.poked;
    if (currentUser.role === 'chef') return task.service === currentUser.service && task.status === 'pending' && !task.poked;
    return false;
}

function renderTaskRow(task, isPrivate = false) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-700/30';
    tr.dataset.taskId = task.id;
    tr.dataset.service = task.service;

    const canPokeTask = canPoke(task);
    const canAcceptDecline = currentUser.role === 'employee' && task.poked && task.assignedTo === currentUser.id;
    const canDelete = currentUser.role === 'admin';

    let actionsHtml = '';
    if (canPokeTask) {
        actionsHtml = `<button class="poke-btn px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">Poke</button>`;
    } else if (canAcceptDecline) {
        actionsHtml = `
            <button class="accept-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm mr-1">Accept</button>
            <button class="decline-btn px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">Decline</button>
        `;
    } else if (isPrivate && task.status !== 'complete') {
        actionsHtml = `
            <label class="flex items-center gap-2">
                <input type="checkbox" class="done-checkbox rounded" ${task.status === 'complete' ? 'checked' : ''}>
                <span class="text-sm">Done</span>
            </label>
            <div class="mt-1">
                <input type="file" class="file-upload hidden" id="file-${task.id}">
                <button class="upload-btn px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">Upload</button>
                <button class="ok-btn px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm ml-1 hidden">OK</button>
            </div>
        `;
    }
    if (canDelete) {
        actionsHtml += ` <button class="delete-task-btn px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm ml-1">Delete</button>`;
    }

    tr.innerHTML = `
        <td class="px-4 py-3 text-slate-200">${task.title}</td>
        <td class="px-4 py-3 text-slate-300 hidden md:table-cell">${task.assignedToName}</td>
        <td class="px-4 py-3">
            <span class="px-2 py-1 rounded text-xs font-medium ${getStatusClass(task.status)}">${getStatusLabel(task.status)}</span>
        </td>
        <td class="px-4 py-3">${actionsHtml}</td>
    `;

    return tr;
}

function renderTasks() {
    taskTableBody.innerHTML = '';
    const { public: publicTasks, private: privateTasksList } = getVisibleTasks();

    // Employee: simplified - only their tasks
    if (currentUser.role === 'employee') {
        statsCard.classList.add('hidden');
        tableTitle.textContent = 'My Tasks';
        privateTasksList.forEach(task => {
            taskTableBody.appendChild(renderTaskRow(task, true));
        });
        publicTasks.forEach(task => {
            taskTableBody.appendChild(renderTaskRow(task, false));
        });
    } else {
        statsCard.classList.remove('hidden');
        tableTitle.textContent = currentUser.role === 'chef' ? `Service ${currentUser.service} Menu` :
            currentUser.role === 'manager' || currentUser.role === 'admin' ? 'All Tasks' : `Service ${currentService} Tasks`;
        privateTasksList.forEach(task => taskTableBody.appendChild(renderTaskRow(task, true)));
        publicTasks.forEach(task => taskTableBody.appendChild(renderTaskRow(task, false)));
    }

    attachTaskListeners();
}

function attachTaskListeners() {
    taskTableBody.querySelectorAll('.poke-btn').forEach(btn => {
        btn.onclick = (e) => pokeTask(e.target.closest('tr').dataset.taskId);
    });
    taskTableBody.querySelectorAll('.accept-btn').forEach(btn => {
        btn.onclick = (e) => acceptTask(e.target.closest('tr').dataset.taskId);
    });
    taskTableBody.querySelectorAll('.decline-btn').forEach(btn => {
        btn.onclick = (e) => {
            declineTaskId = e.target.closest('tr').dataset.taskId;
            declineModal.classList.remove('hidden');
            declineModal.classList.add('flex');
        };
    });
    taskTableBody.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.onclick = (e) => deleteTask(e.target.closest('tr').dataset.taskId);
    });
    taskTableBody.querySelectorAll('.done-checkbox').forEach(checkbox => {
        checkbox.onchange = (e) => {
            const task = privateTasks.find(t => t.id === e.target.closest('tr').dataset.taskId);
            if (task && task.fileUploaded) {
                task.status = e.target.checked ? 'complete' : 'pending';
                updateUI();
            }
        };
    });
    taskTableBody.querySelectorAll('.upload-btn').forEach(btn => {
        btn.onclick = () => document.getElementById(`file-${btn.closest('tr').dataset.taskId}`)?.click();
    });
    taskTableBody.querySelectorAll('.file-upload').forEach(input => {
        input.onchange = () => input.closest('tr')?.querySelector('.ok-btn')?.classList.remove('hidden');
    });
    taskTableBody.querySelectorAll('.ok-btn').forEach(btn => {
        btn.onclick = (e) => {
            const task = privateTasks.find(t => t.id === e.target.closest('tr').dataset.taskId);
            if (task) {
                task.fileUploaded = true;
                task.status = 'complete';
                btn.classList.add('hidden');
                updateUI();
            }
        };
    });
}

function findTask(taskId) {
    for (let s = 1; s <= 5; s++) {
        const t = (tasks[s] || []).find(x => x.id === taskId);
        if (t) return { task: t, service: s };
    }
    return null;
}

function pokeTask(taskId) {
    const found = findTask(taskId);
    if (!found) return;
    const { task } = found;
    task.poked = true;
    task.status = 'poked';
    notifications.push({
        id: Date.now(),
        type: 'poke',
        taskId,
        taskTitle: task.title,
        from: currentUser.name,
        to: task.assignedTo,
        read: false,
        timestamp: new Date()
    });
    updateNotificationCount();
    updateUI();
}

function acceptTask(taskId) {
    const found = findTask(taskId);
    if (!found) return;
    const { task, service } = found;
    const idx = tasks[service].findIndex(t => t.id === taskId);
    if (idx === -1) return;
    task.privateTask = true;
    task.poked = false;
    task.status = 'pending';
    privateTasks.push({ ...task });
    tasks[service].splice(idx, 1);
    notifications = notifications.filter(n => !(n.type === 'poke' && n.taskId === taskId));
    updateNotificationCount();
    updateUI();
}

function declineTask(taskId, justification) {
    const found = findTask(taskId);
    if (!found) return;
    const { task } = found;
    task.status = 'stuck';
    task.poked = false;
    messages.push({
        id: Date.now(),
        from: task.assignedToName,
        to: 'manager',
        type: 'decline',
        taskTitle: task.title,
        justification,
        timestamp: new Date(),
        read: false
    });
    declineModal.classList.add('hidden');
    declineModal.classList.remove('flex');
    declineJustification.value = '';
    declineTaskId = null;
    updateUI();
}

function deleteTask(taskId) {
    const found = findTask(taskId);
    if (!found || currentUser.role !== 'admin') return;
    const { service } = found;
    tasks[service] = tasks[service].filter(t => t.id !== taskId);
    updateUI();
}

function updateNotificationCount() {
    const unread = notifications.filter(n => (n.to === currentUser.id || n.to === currentUser.name) && !n.read).length;
    notificationCount.textContent = unread;
    notificationCount.classList.toggle('hidden', unread === 0);
}

function updateChatEmployeeSelect() {
    chatEmployeeSelect.innerHTML = '<option value="">Select employee...</option>';
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.name} (Service ${emp.service})`;
        chatEmployeeSelect.appendChild(opt);
    });
}

function renderChatMessages() {
    const filtered = messages.filter(m =>
        (m.to === 'manager' && (currentUser.role === 'manager' || currentUser.role === 'chef')) ||
        (m.from === currentUser.name && m.to !== 'manager') ||
        (m.to === currentUser.id && (m.from === 'manager' || m.from?.includes('Chef')))
    );
    chatMessages.innerHTML = filtered.map(m => {
        const isDecline = m.type === 'decline';
        const time = m.timestamp.toLocaleTimeString();
        if (isDecline) {
            return `<div class="mb-4 p-3 bg-red-900/30 rounded border border-red-800">
                <p class="text-sm text-red-300 font-medium">Decline from ${m.from}</p>
                <p class="text-slate-300 text-sm">Task: ${m.taskTitle}</p>
                <p class="text-white mt-1">"${m.justification}"</p>
                <p class="text-slate-500 text-xs mt-1">${time}</p>
            </div>`;
        }
        return `<div class="mb-4 p-3 bg-slate-700/50 rounded">
            <p class="text-sm text-slate-400">${m.from} → ${m.to}</p>
            <p class="text-white">${m.text || ''}</p>
            <p class="text-slate-500 text-xs mt-1">${time}</p>
        </div>`;
    }).join('');
}

function updateUI() {
    updateStatistics();
    renderTasks();
    updateMenuActive();
    renderChatMessages();
}

function renderEmployeeList() {
    employeeList.innerHTML = employees.map(emp =>
        `<li class="flex justify-between items-center py-1">
            <span class="text-slate-300">${emp.name} <span class="text-slate-500 text-xs">(Svc ${emp.service})</span></span>
            <button class="delete-emp text-red-400 hover:text-red-300 text-sm" data-id="${emp.id}">Delete</button>
        </li>`
    ).join('');
    employeeList.querySelectorAll('.delete-emp').forEach(btn => {
        btn.onclick = () => {
            if (currentUser.role !== 'admin') return;
            employees = employees.filter(e => e.id !== parseInt(btn.dataset.id));
            renderEmployeeList();
        };
    });
}

function renderFileList() {
    fileList.innerHTML = adminFiles.map((f, i) =>
        `<li class="flex justify-between items-center py-1">
            <span class="text-slate-300">${f}</span>
            <button class="delete-file text-red-400 hover:text-red-300 text-sm" data-idx="${i}">Delete</button>
        </li>`
    ).join('');
    fileList.querySelectorAll('.delete-file').forEach(btn => {
        btn.onclick = () => {
            if (currentUser.role !== 'admin') return;
            adminFiles.splice(parseInt(btn.dataset.idx), 1);
            renderFileList();
        };
    });
}

function populateAddTaskEmployee() {
    const svc = parseInt(newTaskService.value) || 1;
    newTaskEmployee.innerHTML = '<option value="">Select employee...</option>' +
        employees.filter(e => e.service === svc).map(e => `<option value="${e.id}">${e.name}</option>`).join('');
}

// Login: admin/admin, manager/manager, chef1-chef5/chef1-chef5, employee: name/name
function validateLogin(username, password) {
    const u = (username || '').trim();
    const p = (password || '').trim();
    if (!u || !p) return null;

    if (u === 'admin' && p === 'admin') return { role: 'admin' };
    if (u === 'manager' && p === 'manager') return { role: 'manager' };
    if (/^chef[1-5]$/.test(u) && u === p) return { role: 'chef', chefService: parseInt(u.replace('chef', '')) };
    const emp = employees.find(e => e.name === u);
    if (emp && p === u) return { role: 'employee', employeeId: emp.id };
    return null;
}

function doLogin(loginData) {
    console.log("do login    ", loginData);
    role = loginData.role;
    currentUser = {id: loginData.role, name: loginData.username, role: loginData.role};
    if (role === 'chef' || role === 'employee') {
        currentUser.service = loginData.service_gourp;
    }
    currentUserEl.textContent = loginUsername;
    currentService = currentUser.service;
    // roleBadge.textContent = roleNames[role];
    roleBadge.className = 'px-2 py-0.5 rounded text-xs font-medium ' +
        (role === 'admin' ? 'bg-red-600' : role === 'manager' ? 'bg-amber-600' : role === 'chef' ? 'bg-purple-600' : 'bg-blue-600');

    /*if (loginData.role === 'chef') {
        setCurrentUser('chef', null, loginData.chefService);
    } else if (loginData.role === 'employee') {
        setCurrentUser('employee', loginData.employeeId);
    } else {
        setCurrentUser(loginData.role);
    }*/
    
    if (validateLogin(loginData.username, loginData.password)){
        setCurrentUser(loginData.role);
        loginScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        updateUI();
    }
}

function doLogout() {
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
    loginUsername.value = '';
    loginPassword.value = '';
    loginError.classList.add('hidden');
}

import { supabaseClient } from './modules/supabase.js'; // Update this name

// Event Listeners
loginForm?.addEventListener('submit', async (e) => {
    console.log("do login 677");
    e.preventDefault();
    
    const userVal = loginUsername.value.trim();
    const passVal = loginPassword.value.trim();

    let loginData;

    /* console.log("Searching for:", userVal);
    const { data2, error2, status } = await supabaseClient
        .from('employees')
        .select('*')
        .ilike('username', userVal);

    console.log("Database Response Status:", status);
    console.log("Database Data:", data2); // If this is [], your 'userVal' doesn't match any row
    console.log("Database Error:", error2); */

    const result = await supabaseClient
        .from('employees')
        .select('*')
        .ilike('role', 'admin');

    if (result) {
        console.log("✅ User found in DB");
        loginData = {
            role: result.data[0].role.toLowerCase(),
            employeeId: result.data[0].no,
            chefService: result.data[0].service_group
        };
        // userVal = result.data[0].username;
        // passVal = result.data[0].password;
        // 2. Clear errors and proceed
        loginError.classList.add('hidden');
        localStorage.setItem('currentUser', JSON.stringify(loginData));
        // 3. Trigger the UI
        doLogin(loginData);

        console.log("Full Result Object:", result); // Look at this in the console!
        console.log("data ", result.data[0].username);
    } else {
        // FAIL-SAFE: No data found, but let's go to the app anyway
        console.warn("⚠️ No user found in DB. Logging in as local 'admin' bypass.");
        loginData = {
            role: 'admin', // Or 'manager' or 'employee'
            employeeId: 1,
            chefService: 1
        };
        return;
    }

    // 2. Map Supabase data to your app's expected format
    // Your app expects: { role: 'chef', chefService: 1 } or { role: 'employee', employeeId: 5 }
    /*const loginData = {
        role: data.role.toLowerCase(),
        employeeId: data.n_o, // Using your 'n_o' column as the ID
        chefService: data.service_group 
    };

    loginError.classList.add('hidden');
    
    // 3. Trigger your existing app logic
    doLogin(loginData);*/
});

logoutBtn?.addEventListener('click', doLogout);

menuToggleBtn?.addEventListener('click', () => menuSidebar.classList.toggle('-translate-x-full'));
closeMenuBtn?.addEventListener('click', () => menuSidebar.classList.add('-translate-x-full'));

notificationBtn?.addEventListener('click', () => {
    notificationsPanel.classList.toggle('hidden');
    const myNotifications = notifications.filter(n => n.to === currentUser.id || n.to === currentUser.name);
    myNotifications.forEach(n => n.read = true);
    updateNotificationCount();
    notificationsList.innerHTML = myNotifications.length ?
        myNotifications.slice().reverse().map(n => `
            <div class="p-3 mb-2 bg-slate-700/50 rounded text-sm">
                <p class="text-blue-400 font-medium">Poke: ${n.taskTitle}</p>
                <p class="text-slate-400">From ${n.from}</p>
                <p class="text-slate-500 text-xs">${n.timestamp.toLocaleString()}</p>
            </div>
        `).join('') : '<p class="p-4 text-slate-500 text-sm">No notifications</p>';
});

chatToggleBtn?.addEventListener('click', () => {
    chatSidebar.classList.toggle('hidden');
    updateChatEmployeeSelect();
});
closeChatBtn?.addEventListener('click', () => chatSidebar.classList.add('hidden'));

sendChatBtn?.addEventListener('click', () => {
    const empId = chatEmployeeSelect.value;
    const text = chatInput.value.trim();
    if (!empId || !text) return;
    messages.push({
        id: Date.now(),
        from: currentUser.name,
        to: empId,
        text,
        timestamp: new Date(),
        read: false
    });
    chatInput.value = '';
    renderChatMessages();
});

parametersBtn?.addEventListener('click', () => {
    parametersModal.classList.remove('hidden');
    parametersModal.classList.add('flex');
    renderEmployeeList();
    renderFileList();
});
closeParamsBtn?.addEventListener('click', () => parametersModal.classList.add('hidden'));

addTaskBtn?.addEventListener('click', () => {
    addTaskModal.classList.remove('hidden');
    addTaskModal.classList.add('flex');
    newTaskTitle.value = '';
    newTaskService.value = currentService.toString();
    populateAddTaskEmployee();
});
cancelAddTaskBtn?.addEventListener('click', () => addTaskModal.classList.add('hidden'));
newTaskService?.addEventListener('change', populateAddTaskEmployee);
confirmAddTaskBtn?.addEventListener('click', () => {
    const title = newTaskTitle.value.trim();
    const svc = parseInt(newTaskService.value) || 1;
    const empId = parseInt(newTaskEmployee.value);
    if (!title || !empId) {
        alert('Please fill in task title and assign to an employee.');
        return;
    }
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const task = {
        id: `s${svc}-t${++taskIdCounter}`,
        title,
        assignedTo: emp.id,
        assignedToName: emp.name,
        status: 'pending',
        service: svc,
        fileUploaded: false,
        poked: false,
        privateTask: false
    };
    tasks[svc].push(task);
    addTaskModal.classList.add('hidden');
    currentService = svc;
    updateUI();
});

addEmployeeBtn.addEventListener('click', () => {
    const name = newEmployeeName.value.trim();
    const svc = parseInt(newEmployeeService?.value || 1);
    if (!name) return;
    const currentCount = employees.filter(e => e.service === svc).length;
    const maxCount = EMPLOYEE_COUNTS[svc] || 6;
    if (currentCount >= maxCount) {
        alert(`Service ${svc} is full (max ${maxCount} employees).`);
        return;
    }
    employees.push({ id: Math.max(...employees.map(e => e.id), 0) + 1, name, role: 'employee', service: svc });
    newEmployeeName.value = '';
    renderEmployeeList();
});
addFileBtn.addEventListener('click', () => {
    const name = newFileName.value.trim();
    if (!name) return;
    adminFiles.push(name);
    newFileName.value = '';
    renderFileList();
});

cancelDeclineBtn?.addEventListener('click', () => {
    declineModal.classList.add('hidden');
    declineTaskId = null;
    declineJustification.value = '';
});
confirmDeclineBtn?.addEventListener('click', () => {
    const justification = declineJustification.value.trim();
    if (!justification) {
        alert('Please provide a written justification.');
        return;
    }
    if (declineTaskId) declineTask(declineTaskId, justification);
});

// Initialize - show login screen, app hidden until login
doLogout();
