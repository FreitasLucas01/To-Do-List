const todoInput = document.querySelector("#todo-input");
const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

function createTodo(text, done = 0, save = 1) {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;

  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodosLocalStorage({ text: text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
}

function toggleForms() {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
}

function updateTodo(text) {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((itens) => {
    let todoTitle = itens.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoTextLocalStorage(oldInputValue, text);
    }
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    createTodo(inputValue);
  }
});

function getSearchTodos(search) {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((itens) => {
    let todoTitle = itens.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    itens.style.display = "flex";

    if (!todoTitle.includes(normalizedSearch)) {
      itens.style.display = "none";
    }
  });
}

function filterTodos(filterValue) {
  const todos = document.querySelectorAll(".todo");

  if (filterValue === "all") {
    todos.forEach((itens) => (itens.style.display = "flex"));
  } else if (filterValue === "done") {
    todos.forEach((itens) =>
      itens.classList.contains("done")
        ? (itens.style.display = "flex")
        : (itens.style.display = "none")
    );
  } else {
    todos.forEach((itens) =>
      !itens.classList.contains("done")
        ? (itens.style.display = "flex")
        : (itens.style.display = "none")
    );
  }
}

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

function getTodosLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
}

function loadTodos() {
  const todos = getTodosLocalStorage();

  todos.forEach((itens) => {
    createTodo(itens.text, itens.done, 0);
  });
}

function saveTodosLocalStorage(todo) {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodoLocalStorage(todoText) {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((itens) => itens.text !== todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

function updateTodoLocalStorage(todoText) {
  const todos = getTodosLocalStorage();

  todos.map((itens) => {
    itens.text === todoText ? (itens.done = !itens.done) : null;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoTextLocalStorage(todoOldtext, todoNewText) {
  const todos = getTodosLocalStorage();

  todos.map((itens) => {
    itens.text === todoOldtext ? (itens.text = todoNewText) : null;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();
