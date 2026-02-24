const filters = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
};

// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Label", "Description"]; }

function onLoadData(category) { return [category.id, category.name, category.description]; }

function onLoadAction(category) {
    return [
        { name: "View", func: "viewTask", arg: category.id },
        { name: "Edit", func: "editTask", arg: category.id },
        { name: "Delete", func: "deleteTask", arg: category.id, color: "danger" }
    ];
}

function editTask(id) {
    redirect("taskForm.html", false, [["no", id]]);
}

function deleteTask(id) {
    const confirme = confirm("Do you want to remove that Task ?");
    if (confirme) {
        removeTask(id).then(() => {
            alert("Task removed !");
            location.reload();
        });
    }
}

function viewTask(id) {
    redirect("taskDetails.html", false, [["no", id]]);
}

// Header buttons
function openRandomTask() {
    viewTask(tableMap.get("taskTable").allTasks[Math.floor(Math.random() * tableMap.get("taskTable").allTasks.length)].id);
}

function printTasks() {
    setTimeout(function () {
        const options = {
            filename: 'tasks-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        html2pdf().set(options).from(element).save();
    }, 2000);
}

function filterTasks() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', (event) => {
            filters[event.target.value] = event.target.checked;
            tableMap.get("taskTable").display(true);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = false;
    });
    filterTasks();
});