// Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event
addTaskBtn.addEventListener('click', addTask);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = '';
}

// Add task to DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
        <span>${task.text}</span>
        <span>
            <button class="completeBtn">✔️</button>
            <button class="deleteBtn">❌</button>
        </span>
    `;

    taskList.appendChild(li);
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

// Task completion and delete event delegation
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('completeBtn')) {
        toggleTaskCompletion(e.target.parentElement.parentElement);
    } else if (e.target.classList.contains('deleteBtn')) {
        deleteTask(e.target.parentElement.parentElement);
    }
});

// Toggle task completion
function toggleTaskCompletion(taskItem) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.id == taskItem.getAttribute('data-id')) {
            task.completed = !task.completed;
            taskItem.classList.toggle('completed');
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task
function deleteTask(taskItem) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id != taskItem.getAttribute('data-id'));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskItem.remove();
}