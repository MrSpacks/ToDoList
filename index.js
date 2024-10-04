document.addEventListener("DOMContentLoaded", loadTasks);

function newElement() {
  var inputValue = document.getElementById("myInput").value;
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    createTaskElement(inputValue);
    saveTask(inputValue);
  }
  document.getElementById("myInput").value = "";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    newElement();
  }
});

function createTaskElement(taskText, isChecked = false) {
  var li = document.createElement("li");
  var t = document.createTextNode(taskText);
  li.appendChild(t);
  if (isChecked) {
    li.classList.add("checked");
  }

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  document.getElementById("myUL").appendChild(li);

  span.onclick = function () {
    deleteTask(taskText);
    li.style.display = "none";
  };

  li.addEventListener("dblclick", function () {
    editTask(li, taskText);
  });

  li.addEventListener("click", function (ev) {
    if (ev.target.tagName === "LI") {
      ev.target.classList.toggle("checked");
      toggleTaskStatus(taskText);
    }
  });
}

function saveTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, checked: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    createTaskElement(task.text, task.checked);
  });
}

function toggleTaskStatus(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    if (task.text === taskText) {
      task.checked = !task.checked;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(li, oldText) {
  var input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  li.innerHTML = "";
  li.appendChild(input);
  input.focus();

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      var newText = input.value;
      if (newText === "") {
        alert("You must write something!");
        return;
      }

      li.innerHTML = newText;
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

      updateTask(oldText, newText);

      span.onclick = function () {
        deleteTask(newText);
        li.style.display = "none";
      };

      li.addEventListener("dblclick", function () {
        editTask(li, newText);
      });

      li.addEventListener("click", function (ev) {
        if (ev.target.tagName === "LI") {
          ev.target.classList.toggle("checked");
          toggleTaskStatus(newText);
        }
      });
    }
  });
}

function updateTask(oldText, newText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    if (task.text === oldText) {
      task.text = newText;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(filter) {
  let tasks = document.querySelectorAll("li");

  tasks.forEach((task) => {
    switch (filter) {
      case "all":
        task.style.display = "list-item";
        break;
      case "completed":
        if (task.classList.contains("checked")) {
          task.style.display = "list-item";
        } else {
          task.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!task.classList.contains("checked")) {
          task.style.display = "list-item";
        } else {
          task.style.display = "none";
        }
        break;
    }
  });
}
