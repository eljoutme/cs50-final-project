// DOM Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAll = document.getElementById("clearAll");
const completedText = document.getElementById("completedCount");

// Load tasks on page load
window.onload = function () {
  const tasks = getTasks();
  tasks.forEach(displayTask);
  updateCount();
};

// Add task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  displayTask(task);
  taskInput.value = "";
  updateCount();
}

function displayTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <div class="task-actions">
      <button class="complete-btn">✅</button>
      <button class="delete-btn">❌</button>
    </div>
  `;

  li.querySelector(".complete-btn").addEventListener("click", function () {
    li.classList.toggle("completed");
    updateTaskStatus(task.text, li.classList.contains("completed"));
    updateCount();
  });

  li.querySelector(".delete-btn").addEventListener("click", function () {
    li.remove();
    deleteTask(task.text);
    updateCount();
  });

  taskList.appendChild(li);
}

function updateCount() {
  const allTasks = taskList.getElementsByTagName("li");
  const total = allTasks.length;

  let completed = 0;
  for (let task of allTasks) {
    if (task.classList.contains("completed")) {
      completed++;
    }
  }

  taskCount.textContent = `${total - completed} work${(total - completed) !== 1 ? "s" : ""} pending...`;

  if (completed > 0) {
    completedText.textContent = `✔️ ${completed} task${completed > 1 ? "s" : ""} completed`;
  } else {
    completedText.textContent = "";
  }
}

// Clear all
clearAll.addEventListener("click", function () {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
  updateCount();
});

// LocalStorage Helpers
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(text) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.text !== text);
  saveTasks(tasks);
}

function updateTaskStatus(text, completed) {
  const tasks = getTasks();
  const updated = tasks.map(task =>
    task.text === text ? { ...task, completed } : task
  );
  saveTasks(updated);
}
