document.addEventListener("DOMContentLoaded", loadTasks);

function newElement() {
  const inputValue = document.getElementById("myInput").value;
  const deadlineValue = document.getElementById("deadlineInput").value;

  if (inputValue === "" || deadlineValue === "") {
    alert("You must write a task and select a deadline!");
    return;
  }

  const li = document.createElement("li");
  const daysLeft = calculateDaysLeft(deadlineValue);

  li.innerHTML = `
    <span class="task-title">${inputValue}</span>
    <span class="deadline-countdown ${daysLeft > 0 ? "green" : "red"}">${
    daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"
  }</span>
    <span class="close" onclick="removeTask(this)">×</span>
  `;

  li.addEventListener("click", toggleTaskCompletion);
  document.getElementById("myUL").appendChild(li);
  saveTask(inputValue, deadlineValue, false); // добавляем статус невыполненной задачи
  document.getElementById("myInput").value = "";
  document.getElementById("deadlineInput").value = "";
}

function toggleTaskCompletion(event) {
  const task = event.currentTarget;
  task.classList.toggle("checked");

  const taskTitle = task.querySelector(".task-title").innerText;
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  // Обновляем статус выполнения в Local Storage
  tasks = tasks.map((t) => {
    if (t.title === taskTitle) {
      return { ...t, completed: !t.completed };
    }
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTask(title, deadline, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ title, deadline, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const li = document.createElement("li");
    const daysLeft = calculateDaysLeft(task.deadline);

    li.innerHTML = `
      <span class="task-title">${task.title}</span>
            <span class="deadline-countdown ${daysLeft > 0 ? "green" : "red"}">
        ${daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
      </span>
      <span class="close" onclick="removeTask(this)">×</span>
    `;

    // Добавляем класс `checked`, если задача была выполнена
    if (task.completed) {
      li.classList.add("checked");
    }

    // Добавляем обработчик для отметки выполнения
    li.addEventListener("click", toggleTaskCompletion);
    document.getElementById("myUL").appendChild(li);
  });
}

function calculateDaysLeft(deadline) {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate - currentDate;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function removeTask(element) {
  const taskTitle =
    element.parentElement.querySelector(".task-title").innerText;
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((task) => task.title !== taskTitle);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  element.parentElement.remove();
}

function filterTasks(status) {
  const allTasks = document.querySelectorAll("#myUL li");
  allTasks.forEach((task) => {
    const isCompleted = task.classList.contains("checked");
    if (
      status === "all" ||
      (status === "completed" && isCompleted) ||
      (status === "uncompleted" && !isCompleted)
    ) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
}
