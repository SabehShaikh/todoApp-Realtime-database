import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, set, remove, update, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYe28GX4SaUpVxIu94pPEvQ8qjRaMxQm4",
    authDomain: "todo-app-17670.firebaseapp.com",
    databaseURL: "https://todo-app-17670-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todo-app-17670",
    storageBucket: "todo-app-17670.appspot.com",
    messagingSenderId: "386829734243",
    appId: "1:386829734243:web:47f23723bc6fa132ba8356"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Reference to the Firebase Realtime Database
const database = getDatabase(app);

// Function to add a todo
function addTodo() {
    const todoInput = document.getElementById("todo");
    const todoValue = todoInput.value;
    const timestamp = new Date().toLocaleString();
    const newTodoRef = push(ref(database, "todos"));
    set(newTodoRef, {
        value: todoValue,
        time: timestamp
    });
    todoInput.value = "";
}

// Function to delete a todo
function deleteTodo(id) {
    remove(ref(database, `todos/${id}`));
}

// Function to edit a todo
function editTodo(e, id) {
    const todoInput = e.parentNode.childNodes[1];
    const editButton = e.parentNode.childNodes[5];
    if (editButton.innerText === "Edit") {
        todoInput.disabled = false;
        todoInput.focus();
        editButton.innerText = "Update";
    } else {
        todoInput.disabled = true;
        todoInput.blur();
        editButton.innerText = "Edit";
        update(ref(database, `todos/${id}`), {
            value: todoInput.value
        });
    }
}

// Function to delete all todos
function deleteAll() {
    remove(ref(database, "todos"));
}

// Event listener for real-time updates
onValue(ref(database, "todos"), function (snapshot) {
    const todos = snapshot.val();
    const list = document.getElementById("list");
    list.innerHTML = "";
    for (let key in todos) {
        if (todos.hasOwnProperty(key)) {
            const todo = todos[key];
            const li = document.createElement("li");
            li.innerHTML = `
        <input class='todo-input' type='text' value='${todo.value}' disabled/>
        ${todo.time}
        <button onclick='deleteTodo("${key}")'>Delete</button> 
        <button onclick='editTodo(this,"${key}")'>Edit</button>
      `;
            list.appendChild(li);
        }
    }
});
window.addTodo = addTodo;
window.deleteTodo = deleteTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;
