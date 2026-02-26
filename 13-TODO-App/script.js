// TODO App - Main Script
// Author: Portfolio Project
// Features: Add/Edit/Delete, Categories, Filters, LocalStorage, Drag&Drop, Dark Mode, Priority, Due Dates, Search

// State
let tasks = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentPriority = 'all';
let currentSort = 'date';
let editingTaskId = null;

// DOM Elements
const tasksContainer = document.getElementById('tasksContainer');
const emptyState = document.getElementById('emptyState');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const overlay = document.getElementById('overlay');
const taskForm = document.getElementById('taskForm');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const clearCompleted = document.getElementById('clearCompleted');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
    attachEventListeners();
    renderTasks();
    updateCounts();
});

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('todoAppTasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('todoAppTasks', JSON.stringify(tasks));
}

// Load theme preference
function loadTheme() {
    const theme = localStorage.getItem('todoAppTheme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Event Listeners
function attachEventListeners() {
    // Add Task Button
    addTaskBtn.addEventListener('click', openAddModal);
    
    // Modal Close
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Form Submit
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Clear Completed
    clearCompleted.addEventListener('click', handleClearCompleted);
    
    // Filter Listeners
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            setFilter(filter);
        });
    });
    
    // Category Listeners
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            setCategory(category);
        });
    });
    
    // Priority Listeners
    document.querySelectorAll('.priority-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const priority = e.currentTarget.dataset.priority;
            setPriority(priority);
        });
    });
    
    // Sort Listeners
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sort = e.currentTarget.dataset.sort;
            setSort(sort);
        });
    });
    
    // Set minimum date to today
    const dateInput = document.getElementById('taskDueDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Open Add Modal
function openAddModal() {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Nowe Zadanie';
    taskForm.reset();
    taskModal.classList.add('active');
    overlay.classList.add('active');
    document.getElementById('taskTitle').focus();
}

// Open Edit Modal
function openEditModal(taskId) {
    editingTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    document.getElementById('modalTitle').textContent = 'Edytuj Zadanie';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.dueDate || '';
    
    taskModal.classList.add('active');
    overlay.classList.add('active');
}

// Close Modal
function closeModal() {
    taskModal.classList.remove('active');
    overlay.classList.remove('active');
    editingTaskId = null;
    taskForm.reset();
}

// Handle Form Submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
    };
    
    if (!taskData.title) {
        alert('Tytuł zadania jest wymagany!');
        return;
    }
    
    if (editingTaskId) {
        // Update existing task
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new task
        const newTask = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
    }
    
    saveTasks();
    renderTasks();
    updateCounts();
    closeModal();
}

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
        updateCounts();
    }
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateCounts();
    }
}

// Handle Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    renderTasks(query);
}

// Set Filter
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-item').forEach(item => {
        item.classList.toggle('active', item.dataset.filter === filter);
    });
    renderTasks();
}

// Set Category
function setCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === category);
    });
    renderTasks();
}

// Set Priority
function setPriority(priority) {
    currentPriority = priority;
    document.querySelectorAll('.priority-item').forEach(item => {
        item.classList.toggle('active', item.dataset.priority === priority);
    });
    renderTasks();
}

// Set Sort
function setSort(sort) {
    currentSort = sort;
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sort);
    });
    renderTasks();
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('todoAppTheme', isDark ? 'dark' : 'light');
}

// Clear Completed Tasks
function handleClearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('Brak ukończonych zadań do usunięcia.');
        return;
    }
    
    if (confirm(`Czy na pewno chcesz usunąć ${completedCount} ukończonych zadań?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateCounts();
    }
}

// Filter Tasks
function filterTasks(searchQuery = '') {
    let filtered = [...tasks];
    
    // Filter by completion status
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(t => t.category === currentCategory);
    }
    
    // Filter by priority
    if (currentPriority !== 'all') {
        filtered = filtered.filter(t => t.priority === currentPriority);
    }
    
    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchQuery) ||
            (t.description && t.description.toLowerCase().includes(searchQuery))
        );
    }
    
    return filtered;
}

// Sort Tasks
function sortTasks(tasks) {
    const sorted = [...tasks];
    
    switch (currentSort) {
        case 'date':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'name':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    return sorted;
}

// Render Tasks
function renderTasks(searchQuery = '') {
    const filtered = filterTasks(searchQuery);
    const sorted = sortTasks(filtered);
    
    if (sorted.length === 0) {
        tasksContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tasksContainer.innerHTML = sorted.map(task => createTaskCard(task)).join('');
    
    // Attach event listeners to task cards
    sorted.forEach(task => {
        const taskCard = document.querySelector(`[data-task-id="${task.id}"]`);
        
        // Checkbox
        const checkbox = taskCard.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));
        
        // Edit Button
        const editBtn = taskCard.querySelector('.task-btn.edit');
        editBtn.addEventListener('click', () => openEditModal(task.id));
        
        // Delete Button
        const deleteBtn = taskCard.querySelector('.task-btn.delete');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // Drag and Drop
        taskCard.draggable = true;
        taskCard.addEventListener('dragstart', handleDragStart);
        taskCard.addEventListener('dragend', handleDragEnd);
        taskCard.addEventListener('dragover', handleDragOver);
        taskCard.addEventListener('drop', handleDrop);
    });
}

// Create Task Card HTML
function createTaskCard(task) {
    const categoryColors = {
        work: '#3b82f6',
        personal: '#10b981',
        shopping: '#f59e0b',
        health: '#ef4444'
    };
    
    const categoryLabels = {
        work: 'Praca',
        personal: 'Osobiste',
        shopping: 'Zakupy',
        health: 'Zdrowie'
    };
    
    const priorityIcons = {
        high: '<i class="fas fa-angle-double-up"></i>',
        medium: '<i class="fas fa-angle-up"></i>',
        low: '<i class="fas fa-angle-down"></i>'
    };
    
    const priorityLabels = {
        high: 'Wysoki',
        medium: 'Średni',
        low: 'Niski'
    };
    
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    return `
        <div class="task-card ${task.completed ? 'completed' : ''}" 
             data-task-id="${task.id}"
             style="border-left-color: ${categoryColors[task.category]}">
            <div class="task-header">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-btn edit" title="Edytuj" aria-label="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete" title="Usuń" aria-label="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-footer">
                <div class="task-category">
                    <span class="category-color" style="background: ${categoryColors[task.category]};"></span>
                    ${categoryLabels[task.category]}
                </div>
                <div class="task-priority ${task.priority}">
                    ${priorityIcons[task.priority]}
                    ${priorityLabels[task.priority]}
                </div>
                ${task.dueDate ? `
                    <div class="task-date ${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(task.dueDate)}
                        ${isOverdue ? '(Przekroczony!)' : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Update Counts
function updateCounts() {
    const all = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    // Update header count
    document.querySelector('.task-count').textContent = `${all} ${all === 1 ? 'zadanie' : all < 5 ? 'zadania' : 'zadań'}`;
    
    // Filter counts
    document.getElementById('countAll').textContent = all;
    document.getElementById('countActive').textContent = active;
    document.getElementById('countCompleted').textContent = completed;
    
    // Category counts
    document.getElementById('catAll').textContent = all;
    document.getElementById('catWork').textContent = tasks.filter(t => t.category === 'work').length;
    document.getElementById('catPersonal').textContent = tasks.filter(t => t.category === 'personal').length;
    document.getElementById('catShopping').textContent = tasks.filter(t => t.category === 'shopping').length;
    document.getElementById('catHealth').textContent = tasks.filter(t => t.category === 'health').length;
    
    // Priority counts
    document.getElementById('prioAll').textContent = all;
    document.getElementById('prioHigh').textContent = tasks.filter(t => t.priority === 'high').length;
    document.getElementById('prioMedium').textContent = tasks.filter(t => t.priority === 'medium').length;
    document.getElementById('prioLow').textContent = tasks.filter(t => t.priority === 'low').length;
}

// Drag and Drop Handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.currentTarget;
    e.currentTarget.classList.add('dragging');
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    tasksContainer.classList.remove('drag-over');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(tasksContainer, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (afterElement == null) {
        tasksContainer.appendChild(dragging);
    } else {
        tasksContainer.insertBefore(dragging, afterElement);
    }
    
    tasksContainer.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    
    // Reorder tasks array based on DOM order
    const newOrder = Array.from(tasksContainer.querySelectorAll('.task-card')).map(card => {
        return tasks.find(t => t.id === parseInt(card.dataset.taskId));
    });
    
    tasks = newOrder;
    saveTasks();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Dzisiaj';
    if (diffDays === 1) return 'Jutro';
    if (diffDays === -1) return 'Wczoraj';
    if (diffDays < 0) return `${Math.abs(diffDays)} dni temu`;
    if (diffDays < 7) return `Za ${diffDays} dni`;
    
    return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Console log
console.log('TODO App loaded successfully!');
console.log(`Total tasks: ${tasks.length}`);
