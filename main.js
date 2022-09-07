const STORAGE_KEY = 'TODO_APPS';
const RENDER_EVENT = 'render_todoapps';
const SAVED_EVENT = 'save_data';

let todos = [];
let tempTodos = [];

function isStorageExist() {
    if(typeof (Storage) !== undefined) return true;

    alert('Storage tidak tersedia');
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelector('#loading').remove();
        }, 600);
    const submitForm = document.getElementById('inputTodo');
    loadDataStorage();
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodos();
        saveLocalStorage();
    });
    document.addEventListener(SAVED_EVENT, function(){
        loadDataStorage();
    })
});

function desCending(){
    todos.sort((a,b) => b.id - a.id);
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function addTodos() {
    const title = document.getElementById('inputTodoTitle').value;
    const description = document.getElementById('inputTodoDescription').value;
    const time = document.getElementById('inputTodoTime').value;
    const isComplete = document.getElementById('inputIscomplete').checked;

    const generatedId = generateId();
    const todosObject = generateTodoObject(generatedId, title, description, time, isComplete);
    todos.push(todosObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId(){
   return Date.now();
}

function generateTodoObject(id, title, description, time, isComplete){
    return {
        id,
        title,
        description,
        time,
        isComplete
    }
}

function makeTodo(todosObject){
    const TextTitle = document.createElement('h4');
    TextTitle.innerText = todosObject.title;

    const TextDescription = document.createElement('p');
    TextDescription.classList.add('description')
    TextDescription.innerText = todosObject.description;

    const TextTime = document.createElement('p');
    TextTime.classList.add('time');
    TextTime.innerText = todosObject.time;

    const container = document.createElement('div');
    container.classList.add('card');
    container.append(
        TextTitle,
        TextDescription,
        TextTime
    );
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('card-body');
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('btn', 'btn-danger', 'py-2', 'px-3');
    buttonDelete.innerText= 'Delete';
    buttonDelete.addEventListener('click', function(){
        let confirmDelete = confirm(
            "Are you sure you want to delete the book '" + todosObject.title + "'?"
        );
        if(confirmDelete){
            removeTodos(todosObject.id);
        }
    });

    const buttonFinished = document.createElement('button');
    buttonFinished.classList.add('btn', 'btn-success', 'py-2', 'px-3');
    buttonFinished.innerText = 'Finished';
    buttonFinished.addEventListener('click', function() {
        completedTodoList(todosObject.id);
    });
    
    if(todosObject.isComplete){
        buttonFinished.innerText = 'Not Finished';
        buttonFinished.classList.add('btn', 'btn-dark', 'py-2', 'px-3');
        buttonFinished.addEventListener('click', function(){
            undoTodoCompleted(todosObject.id);
        });
    }
    else {
        buttonFinished.innerText = 'Finished';
    }

    buttonContainer.append(buttonFinished, buttonDelete);
    container.append(buttonContainer);
    return container;
}

document.addEventListener(RENDER_EVENT, function() {
    const incompletedTodoList = document.getElementById('incompleteTodoList');
    incompletedTodoList.innerHTML ='';
    const completeTodoList = document.getElementById('completeTodoList');
    completeTodoList.innerHTML ='';

    for(const TodoItem of todos){
        const todoElement = makeTodo(TodoItem);
        if(!TodoItem.isComplete){
            incompletedTodoList.append(todoElement);
        }else {
            completeTodoList.append(todoElement);
        }
    }
});

function undoTodoCompleted(todoId){
    const todoTaget = findTodo(todoId);
        if(todoTaget == null) return;

        todoTaget.isComplete = false;
        saveLocalStorage();
        document.dispatchEvent(new Event(RENDER_EVENT));
}

function completedTodoList(todoId){
    const todoTarget = findTodo(todoId);

    if(todoTarget == null) return;

    todoTarget.isComplete = true;
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTodos(todoId){
    const todoTaget = findDataIndex(todoId);
    if(todoTaget === -1) return;
    todos.splice(todoTaget, 1);
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId){
    for(const TodoItem of todos){
        if(TodoItem.id === todoId){
            return TodoItem;
        }
    }
    return null;
}

function findDataIndex(todoId){
    for(const index in todos){
        if(todos[index].id === todoId){
            return index;
        }
    }
    return -1;
}

function saveLocalStorage(){
    const jsonStringify = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, jsonStringify);
    document.dispatchEvent(new Event(SAVED_EVENT));
}

function loadDataStorage(){
    if(!isStorageExist()) return;

    const serializeData = localStorage.getItem(STORAGE_KEY);
    const todoSave = JSON.parse(serializeData);

    if(todoSave == null) return;

    todos = [];
    tempTodos = [];
    todoSave.map((todosObject) => {
        desCending();
        todos.push(todosObject);
        tempTodos.push(todosObject);
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
}


