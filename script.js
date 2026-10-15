/* =====================================================
   To-Do List: script.js
   Flow: load saved tasks -> draw them -> react to clicks
   ===================================================== */

// ---------- 1. Grab elements from the HTML ----------
// document.getElementById finds an element by its id so JS can read or change it.
const form       = document.getElementById("task-form");
const input      = document.getElementById("task-input");
const errorMsg   = document.getElementById("error-message");
const taskList   = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount  = document.getElementById("task-count");

// ---------- 2. App data ----------
// localStorage only stores text, so we use a "key" name to find our data later.
const STORAGE_KEY = "todo-tasks";

// Our tasks live in an array of objects, e.g.
// [{ id: 1700000000000, text: "Buy milk", completed: false }]
let tasks = loadTasks();

// ---------- 3. localStorage helpers ----------
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY); // Returns text, or null if nothing saved yet
    // JSON.parse turns the saved text back into a real JS array
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    // If storage is blocked or the data is corrupted, start fresh instead of crashing
    console.error("Could not load tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    // JSON.stringify turns our array into text so localStorage can store it
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// ---------- 4. Build one task on the page ----------
// Creates the <li> for a task using DOM methods (createElement, appendChild).
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  if (task.completed) li.classList.add("completed");

  // Label wraps the checkbox and text, so clicking the text also toggles the checkbox
  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;

  const text = document.createElement("span");
  text.className = "task-text";
  // textContent (not innerHTML) treats the text as plain text, which blocks
  // anyone from injecting HTML or scripts through a task title.
  text.textContent = task.text;

  label.append(checkbox, text);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.setAttribute("aria-label", `Delete task: ${task.text}`);
  // A small inline SVG trash icon, so no icon library is needed
  deleteBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>
    </svg>`;

  // Event listeners: run a function when the user does something
  checkbox.addEventListener("change", () => toggleTask(task.id, li, checkbox.checked));
  deleteBtn.addEventListener("click", () => deleteTask(task.id, li));

  li.append(label, deleteBtn);
  return li;
}

// ---------- 5. Draw everything ----------
// Runs once on page load to show the saved tasks.
function renderTasks() {
  taskList.innerHTML = "";                 // Clear the list first
  tasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
  updateUI();
}

// Updates the empty message and the "tasks left" counter.
function updateUI() {
  const remaining = tasks.filter((task) => !task.completed).length;

  emptyState.classList.toggle("hidden", tasks.length > 0); // Hide when there are tasks
  taskCount.classList.toggle("hidden", tasks.length === 0);

  if (remaining === 0) {
    taskCount.textContent = "All done. Nice work!";
  } else {
    taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  }
}

// ---------- 6. Add a task ----------
function addTask(event) {
  event.preventDefault();                  // Stop the form from reloading the page

  const value = input.value.trim();        // trim() removes spaces at the start and end

  // Validation: an empty (or all-spaces) value is not allowed
  if (value === "") {
    showError("Type a task before adding it.");
    return;
  }
  clearError();

  const newTask = {
    id: Date.now(),                        // Current time in ms works as a simple unique id
    text: value,
    completed: false,
  };

  tasks.push(newTask);                     // 1. Update the data
  saveTasks();                             // 2. Save to localStorage

  const li = createTaskElement(newTask);   // 3. Update the page
  li.classList.add("is-new");              // Start invisible...
  taskList.appendChild(li);
  requestAnimationFrame(() => {            // ...then on the next frame remove the class,
    requestAnimationFrame(() => li.classList.remove("is-new")); // so CSS animates it in
  });

  input.value = "";                        // Clear the input box
  input.focus();                           // Ready for the next task
  updateUI();
}

// ---------- 7. Toggle completed ----------
function toggleTask(id, li, isChecked) {
  // Find the matching task in the array and update it
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = isChecked;

  li.classList.toggle("completed", isChecked); // Adds/removes the strikethrough style
  saveTasks();
  updateUI();
}

// ---------- 8. Delete a task ----------
function deleteTask(id, li) {
  li.classList.add("is-removing");         // Starts the fade-out animation in CSS

  // Wait for the animation (250ms) to finish, then really remove it
  setTimeout(() => {
    // filter() builds a new array without the deleted task
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    li.remove();                           // Remove the <li> from the page
    updateUI();
  }, 250);
}

// ---------- 9. Validation message helpers ----------
function showError(message) {
  errorMsg.textContent = message;
  input.classList.remove("invalid");
  void input.offsetWidth;                  // Forces a reflow so the shake can replay
  input.classList.add("invalid");
}

function clearError() {
  errorMsg.textContent = "";
  input.classList.remove("invalid");
}

// ---------- 10. Start the app ----------
// "submit" fires when the Add button is clicked OR Enter is pressed in the input.
form.addEventListener("submit", addTask);
// Hide the error as soon as the user starts typing
input.addEventListener("input", clearError);

renderTasks();                             // Show saved tasks on page load
