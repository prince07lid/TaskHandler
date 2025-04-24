class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.isSortedByNewest = true;

        // DOM Elements
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortBtn = document.getElementById('sortBtn');

        // Bind event listeners
        this.taskForm.addEventListener('submit', this.addTask.bind(this));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        this.sortBtn.addEventListener('click', this.toggleSort.bind(this));

        // Initial render
        this.render();
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(e) {
        e.preventDefault();
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now()
        };

        this.tasks.unshift(task);
        this.saveToLocalStorage();
        this.taskInput.value = '';
        this.render();
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveToLocalStorage();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    toggleSort() {
        this.isSortedByNewest = !this.isSortedByNewest;
        this.sortBtn.classList.toggle('oldest', !this.isSortedByNewest);
        this.sortBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/></svg>
            ${this.isSortedByNewest ? 'Newest' : 'Oldest'}
        `;
        this.render();
    }

    getFilteredAndSortedTasks() {
        let filteredTasks = this.tasks.filter(task => {
            if (this.currentFilter === 'completed') return task.completed;
            if (this.currentFilter === 'pending') return !task.completed;
            return true;
        });

        return filteredTasks.sort((a, b) =>
            this.isSortedByNewest ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
        );
    }

    render() {
        const filteredTasks = this.getFilteredAndSortedTasks();
        
        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = '<p class="empty-message">No tasks found</p>';
            return;
        }

        this.taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="checkbox" onclick="taskManager.toggleTask('${task.id}')">
                    ${task.completed ? `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><path d="M20 6 9 17l-5-5"/></svg>
                    ` : ''}
                </div>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" onclick="taskManager.deleteTask('${task.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        `).join('');
    }
}

// Initialize the task manager
const taskManager = new TaskManager();