import { v4 as uuidV4 } from "uuid";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input?.value == "" || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input.value = "";
});
function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("button");

  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  span.textContent = task.title;
  span.style.textDecoration = task.completed ? "line-through" : "none";

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    span.style.textDecoration = task.completed ? "line-through" : "none";
    saveTasks();
  });

  deleteBtn.textContent = "🗑️";
  deleteBtn.style.marginLeft = "auto";
  deleteBtn.style.borderBlockStyle = "none";
  deleteBtn.style.background = "none";
  deleteBtn.style.border = "none";
  deleteBtn.addEventListener("click", () => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks.splice(index, 1);
      saveTasks();
      item.remove();
    }
  });

  label.append(checkbox, span);
  item.append(label, deleteBtn);
  list?.append(item);
}


function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
