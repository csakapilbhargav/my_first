const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const notify = (msg, isError = false) => {
    const el = document.getElementById('notification');
    el.textContent = msg;
    el.style.borderColor = isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 3000);
};

const fetchTasks = async () => {
    try {
        const res = await fetch("/api/tasks", {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const tasks = await res.json();
            renderTasks(tasks);
        } else if (res.status === 401) {
            window.location.href = "login.html";
        }
    } catch (err) {
        notify("Failed to load tasks", true);
    }
};

const renderTasks = (tasks) => {
    const grid = document.getElementById("taskGrid");
    if (tasks.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted); border: 2px dashed var(--glass-border); border-radius: 1rem;">
                <p>No tasks found. Click "Add New Task" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = tasks.map(task => `
        <div class="glass-card task-card">
            <h3>${task.title}</h3>
            <p>${task.description || 'No description provided'}</p>
            <div class="task-footer">
                <button onclick="deleteTask('${task._id}')" class="btn btn-danger btn-icon" title="Delete Task">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        </div>
    `).join('');
};

const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: "DELETE",
            headers: { "Authorization": token }
        });
        if (res.ok) {
            notify("Task deleted");
            fetchTasks();
        }
    } catch (err) {
        notify("Error deleting task", true);
    }
};

// Modal Logic
const modal = document.getElementById("taskModal");
document.getElementById("addTaskBtn").onclick = () => modal.classList.add("active");
document.getElementById("closeModal").onclick = () => modal.classList.remove("active");

document.getElementById("taskForm").onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDesc").value;

    try {
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ title, description })
        });

        if (res.ok) {
            notify("Task created successfully!");
            modal.classList.remove("active");
            document.getElementById("taskForm").reset();
            fetchTasks();
        } else {
            notify("Error creating task", true);
        }
    } catch (err) {
        notify("Connection error", true);
    }
};

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
};

// Initial load
fetchTasks();
