///////////////// Select some important stuff
const todoForm = document.querySelector('.todo__form');
const todoTasksInput = todoForm.querySelector('input[name="title"]');
const todoTasksSubmit = todoForm.querySelector('button[name="submit"]');
const todoTasks = document.querySelector('.todo__tasks');
const todoTasksCheckbox = todoTasks.querySelectorAll('input[type="checkbox"]');
const todoTasksIncomplete = todoTasks.querySelector(
  '.todo__tasks__type--incomplete ul'
);
const todoTasksComplete = todoTasks.querySelector(
  '.todo__tasks__type--complete ul'
);

///////////////// Set important global variables
// Build task array of objects from localStorage, otherwise create empty array
const tasks = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];
// Set idNum to previous localStorage value if it exists, otherwise set to 0
let idNum = localStorage.getItem('idNum') ? localStorage.getItem('idNum') : 0;

///////////////// Do the things
const addTask = function () {
  // Push new task to tasks array
  tasks.push({
    id: `${++idNum}`,
    title: `${todoTasksInput.value}`,
    isChecked: false,
  });

  // Update tasks array in localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // Update idNum in localStorage
  localStorage.setItem('idNum', idNum);

  // Display the new task
  const html = `
    <li class="task">
      <input type="checkbox" id="task-${idNum}" name="task-${idNum}" class="task__checkbox" />
      <label for="task-${idNum}" class="task__title">${todoTasksInput.value}</label>
      <a href="#" title="Move to Trash"><img src="trash.svg" class="task__trash" alt="Move to Trash" /></a>
    </li>
  `;
  todoTasksIncomplete.innerHTML += html;

  // Clear new task input field
  todoTasksInput.value = '';
};

const displayTasks = function () {
  // Filter tasks array for INCOMPLETE tasks, store as new array, then show them as HTML
  tasks
    .filter(task => task.isChecked === false)
    .map(task => {
      const html = `
        <li class="task">
          <input type="checkbox" id="task-${task.id}" name="task-${task.id}" class="task__checkbox" />
          <label for="task-${task.id}" class="task__title">${task.title}</label>
          <a href="#" title="Move to Trash"><img src="trash.svg" class="task__trash" alt="Move to Trash" /></a>
        </li>
      `;
      todoTasksIncomplete.innerHTML += html;
    });

  // Filter tasks array for COMPLETE tasks, store as new array, then show them as HTML
  tasks
    .filter(task => task.isChecked === true)
    .map(task => {
      const html = `
        <li class="task">
          <input type="checkbox" id="task-${task.id}" name="task-${task.id}" class="task__checkbox" checked />
          <label for="task-${task.id}" class="task__title">${task.title}</label>
          <a href="#" title="Move to Trash"><img src="trash.svg" class="task__trash" alt="Move to Trash" /></a>
        </li>
      `;
      todoTasksComplete.innerHTML += html;
    });
};

const toggleTask = function (e) {
  // If target isn't our checkbox, do nothing
  if (!e.target.classList.contains('task__checkbox')) return;

  // If checkbox is checked...
  if (e.target.checked === true) {
    // Move task to Completed Tasks list
    todoTasksComplete.append(e.target.parentNode);

    // Select same task in tasks object and then change isChecked to true
    const task = tasks.find(task => task.id === e.target.id.slice(5));
    task.isChecked = true;

    // Update tasks array in localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // If checkbox is NOT checked...
  if (e.target.checked === false) {
    // Move task to Incompleted Tasks list
    todoTasksIncomplete.append(e.target.parentNode);

    // Select same task in tasks object and then change isChecked to false
    const task = tasks.find(task => task.id === e.target.id.slice(5));
    task.isChecked = false;

    // Update tasks array in localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

const deleteTask = function (e) {
  e.preventDefault();

  // If target isn't our trash can, do nothing
  if (e.target.classList.contains('task__trash')) {
    // Find closest list item to the trash icon element
    const listItem = e.target.closest('li');
    // Delete HTML list item
    listItem.remove();

    // Match list item with task from tasks array
    const task = tasks.find(
      task => task.id === listItem.querySelector('.task__checkbox').id.slice(5)
    );
    // Get index of our matched array task item
    const taskIndex = tasks.indexOf(task);
    // Remove task item from tasks array
    tasks.splice(taskIndex, 1);

    // Update tasks array in localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    // Return and exit function if target is not trash can
    return;
  }
};

///////////////// Event Listeners
todoTasksSubmit.addEventListener('click', e => {
  e.preventDefault();
  addTask(tasks);
});
todoTasks.addEventListener('change', toggleTask);
todoTasks.addEventListener('mouseup', deleteTask);

///////////////// Display any existing tasks on load
displayTasks(tasks);

/******************* TO DO ********************/
// v1. Basic todo list (CHECK)
// v2. Localstorage (CHECK)
// v3. Status messages (task added, task removed, etc.)
// v4. Nicer looking UI
// v5. Drag and drop elements?
