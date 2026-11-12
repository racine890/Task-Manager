const filters = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
};

// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Label", "Description"]; }

function onLoadData(category) { return [category.id, category.name, category.description]; }

function onLoadAction(category) {
    const actions = [
        { name: "View", func: "viewTask", arg: category.id },
    ];

    const isOwner = category.creator == getCurrentUserId();

    if (hasRight('update_task') || (hasRight('update_my_task') && isOwner)) {
        actions.push({ name: "Edit", func: "editTask", arg: category.id });
    }

    if (hasRight('delete_task') || (hasRight('delete_my_task') && isOwner)) {
        actions.push({ name: "Delete", func: "deleteTask", arg: category.id, color: "danger" });
    }

    return actions;
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
    const table = tableMap.get("taskTable");
    if (!table) {
        return;
    }
    const items = table.allItems || [];
    if (items.length === 0) {
        return;
    }
    const filtered = items.filter(item => {
        const status = item.status !== undefined && item.status !== null ? parseInt(item.status) : null;
        if (status !== null && filters[status] === true) {
            return false;
        }
        return true;
    });
    const pool = filtered.length > 0 ? filtered : items;
    const weights = pool.map(item => {
        const priority = item.priority !== undefined && item.priority !== null ? parseInt(item.priority) : 0;
        const p = isNaN(priority) ? 0 : Math.max(0, Math.min(4, priority));
        return 1 + p;
    });
    let totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) {
        viewTask(pool[Math.floor(Math.random() * pool.length)].id);
        return;
    }
    let r = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i++) {
        r -= weights[i];
        if (r <= 0) {
            viewTask(pool[i].id);
            return;
        }
    }
    viewTask(pool[pool.length - 1].id);
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
            const table = tableMap.get("taskTable");
            table.setFilters(filters);
            table.display(true);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = false;
    });
    filterTasks();
});
