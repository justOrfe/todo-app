// Select DOM elements
const taskInput = document.getElementById("task-input");
const timeInput = document.getElementById("time-input");
const titleInput = document.getElementById("title-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Function to create a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskTime = timeInput.value;
    const taskTitle = titleInput.value.trim();

    if (taskText === "" || taskTime === "" || taskTitle === "") return;

    let titleGroup = document.getElementById(taskTitle);

    // If the title group does not exist, create it
    if (!titleGroup) {
        titleGroup = document.createElement("div");
        titleGroup.id = taskTitle;
        titleGroup.classList.add("task-group");
        titleGroup.style.left = Math.random() * 70 + "%";
        titleGroup.style.top = Math.random() * 70 + "%";

        const titleHeader = document.createElement("h3");
        titleHeader.textContent = taskTitle;
        titleHeader.classList.add("task-title");

        titleGroup.appendChild(titleHeader);
        document.body.appendChild(titleGroup);

        // Make the entire group draggable
        enableDrag(titleGroup);
    }

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent = `${taskText} (${taskTime})`;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        titleGroup.removeChild(taskItem);
        if (titleGroup.childNodes.length === 1) {
            document.body.removeChild(titleGroup);
        }
    };
    taskItem.appendChild(deleteBtn);

    titleGroup.appendChild(taskItem);

    // Clear input fields
    taskInput.value = "";
    timeInput.value = "";
    titleInput.value = "";

    // Set a reminder for the task
    const taskTimeDate = new Date();
    const [hours, minutes] = taskTime.split(":").map(Number);
    taskTimeDate.setHours(hours);
    taskTimeDate.setMinutes(minutes);
    taskTimeDate.setSeconds(0);

    const timeUntilTask = taskTimeDate.getTime() - new Date().getTime();
    if (timeUntilTask > 0) {
        setTimeout(() => {
            alert(`Reminder: ${taskText} is due at ${taskTime}!`);
        }, timeUntilTask);
    }
}

// Make elements draggable
function enableDrag(element) {
    element.style.position = "absolute";
    element.onmousedown = function (event) {
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + "px";
            element.style.top = pageY - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        element.onmouseup = function () {
            document.removeEventListener("mousemove", onMouseMove);
            element.onmouseup = null;
        };
    };
    element.ondragstart = function () {
        return false;
    };
}

addTaskBtn.addEventListener("click", addTask);

// Optional: Allow 'Enter' key to add task
[taskInput, timeInput, titleInput].forEach(input => {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
