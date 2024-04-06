"use strict";

let lst = JSON.parse(localStorage.getItem("tasks")) ?? [];

const details = document.querySelector(".details");
const divTasks = document.querySelector(".tasks");
const form = document.querySelector("form");
const taskNew = form.querySelector("input");

const tasksCompleted = document.querySelectorAll(".checked");
const tasks = document.querySelectorAll(".task");

let lenTasksCompleted = tasksCompleted.length;
let lenTasks = tasks.length;

// Changing details information
const assignDetails = function(a, b) {
  details.textContent = `${a} of ${b} have been completed`;
}

const addTask = function(done, desc, ord) {
  lenTasks++;
  lenTasksCompleted += done;
  const html = `
    <div class="task" data-ord=${ord}>
      <div class="check ${done ? "checked" : ""}"></div>
      <div class="content">
        <div class="content__desc">
          ${desc}
        </div>
        <div class="content__funcs">
          <div class="view--first">
            <span class="color--linear update">UPDATE</span>
            <span class="delete">DELETE</span>
          </div>
          <div class="view--second hidden">
            <span class="color--linear save">SAVE</span>
          </div>
        </div>
      </div>
    </div>  
  `;
  divTasks.insertAdjacentHTML("beforeend", html);
};

// Loading tasks from array
const loadTasks = function() {
  lst.forEach(({done, desc}, ind) => addTask(done, desc, ind));  
  assignDetails(lenTasksCompleted, lenTasks);
}
loadTasks();

// Form submit
form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (!taskNew.value) return;
  lst.push({done: false, desc: taskNew.value});
  localStorage.setItem("tasks", JSON.stringify(lst));
  addTask(false, taskNew.value, lst.length - 1);
  assignDetails(lenTasksCompleted, lenTasks);
  form.reset();
});

// Event when the task have been checked or unchecked
divTasks.addEventListener("click", function(e) {
  const el = e.target;
  const taskEl = el.closest(".task");
  const taskOrd = +taskEl.dataset.ord;
  const desc = taskEl.querySelector(".content__desc");
  const viewFirst = taskEl.querySelector(".view--first");
  const viewSecond = taskEl.querySelector(".view--second");
  const check = taskEl.querySelector(".check");

  // Check event
  if (el.classList.contains("check")) {
    lst[taskOrd].done = !lst[taskOrd].done;
    localStorage.setItem("tasks", JSON.stringify(lst));
  
    if (!el.classList.contains("check")) return;
    el.classList.toggle("checked");
  
    if (el.classList.contains("checked")) lenTasksCompleted++;
    else lenTasksCompleted--;

    assignDetails(lenTasksCompleted, lenTasks);  
  } 
  // Update event
  else if (el.classList.contains("update")) {
    desc.setAttribute("contenteditable", true);
    desc.style.cssText = `
      padding: 10px;
      border: 1px solid red;
      border-radius: 5px;
      outline: none;
    `;
    
    viewFirst.classList.toggle("hidden");
    viewSecond.classList.toggle("hidden");
  } 
  // Delete event
  else if (el.classList.contains("delete")) {
    lst.splice(taskOrd, 1);
    localStorage.setItem("tasks", JSON.stringify(lst));
    divTasks.innerHTML = "";
    lenTasks = lenTasksCompleted = 0;
    lst.forEach(({done, desc}, ind) => addTask(done, desc, ind));  
    assignDetails(lenTasksCompleted, lenTasks);
  } 
  // Save event
  else if (el.classList.contains("save")) {
    desc.setAttribute("contenteditable", false);  
    desc.style.cssText = "";

    const descUpdated = desc.textContent.trim();
    lst[taskOrd].desc = descUpdated;

    lenTasksCompleted -= lst[taskOrd].done;
    lst[taskOrd].done = false;
    localStorage.setItem("tasks", JSON.stringify(lst));

    if (check.classList.contains("checked"))
      check.classList.toggle("checked");

    viewFirst.classList.toggle("hidden");
    viewSecond.classList.toggle("hidden");

    assignDetails(lenTasksCompleted, lenTasks);
  }
});
