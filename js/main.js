// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Массив данных задач
let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функции
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Получаем текст задачи из поля ввода

	const taskText = taskInput.value;

	const newTask = {
		id: generate_uuidv4(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask);

	saveToLocalStorage();

	renderTask(newTask);

	// Очищаем поле ввода и возвращаем на него фокус

	taskInput.value = '';
	taskInput.focus();
	checkEmptyList();
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return;

	const parentNode = event.target.closest('.list-group-item');

	const id = String(parentNode.id);
	tasks = tasks.filter(task => task.id !== id);

	saveToLocalStorage();

	parentNode.remove();
	checkEmptyList();
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	const id = String(parentNode.id);
	const task = tasks.find(task => task.id === id);
	task.done = !task.done;

	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
		<div class="empty-list__title">Список дел пуст</div>
	</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Формируем разметку для новой задачи

	const taskHTML = `
	<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18" />
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18" />
        </button>
    </div>
    </li>`;

	// Добавляем задачу на страницу

	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function generate_uuidv4() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}
