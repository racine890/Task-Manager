let lastDisplayed = 0;
let allTasks = [];
let loadedPages = [];

function fillArray(tasks, taskList){
    taskList.innerHTML = '';
    tasks.forEach(task => {

        const row = `<tr>
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>
                <button onclick="viewTask(${task.id})">See</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        </tr>`;
        lastDisplayed = task.id;
        taskList.innerHTML += row;
    });
}

function displayTasks(forward=true) {
    const taskList = document.getElementById('my-table');

    if(forward == true){
        getTasks(lastDisplayed).then((tasks)=>{
            if(tasks.length > 0){
                allTasks = tasks;
                fillArray(tasks, taskList);
            } else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allTasks = loadedPages.pop();
        fillArray(allTasks, taskList);
    } else {
        alert("No more data before!");
    }

}

function editTask(id) {
    appDataManager.setvar("form.task.id", id);
    redirect("taskForm.html");
}

function viewTask(id) {
    appDataManager.setvar("form.task.id", id);
    redirect("taskDetails.html");
}

function deleteTask(id) {
    const confirme = confirm("Do you want to remove that Task ?");
	if (confirme) {
        removeTask(id).then(() => {
            displayTasks();
        });
	}
}

function openRandomTask(){
    viewTask(allTasks[Math.floor(Math.random() * allTasks.length)].id);
}

function printTasks(){
    setTimeout(function() {
        const options = {
            filename: 'tasks-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}

document.getElementById('next').onclick = () => {
    loadedPages.push(allTasks);
    displayTasks();
};

document.getElementById('prev').onclick = () => {
    displayTasks(false);
};

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    
    appDataManager.remvar("form.task.id");
    displayTasks();
});