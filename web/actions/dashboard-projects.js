// Updated. Those are just the actions for the table component
const filters = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
};

function onLoadColumns() { return ["Id", "Label", "Description"]; }

function onLoadData(project) { return [project.id, project.name, project.description]; }

function onLoadAction(project) {
    return [
        { name: "View", func: "viewProject", arg: project.id, right: "read_project" },
        { name: "Edit", func: "editProject", arg: project.id, right: "update_project" },
        { name: "Delete", func: "deleteProject", arg: project.id, color: "danger", right: "delete_project" }
    ];
}

function editProject(id) {
    redirect("projectForm.html", false, [["no", id]]);
}

function deleteProject(id) {
    const confirme = confirm("Do you want to remove that Project ?");
    if (confirme) {
        removeProject(id).then(() => {
            alert("Project removed !");
            location.reload();
        });
    }
}

function viewProject(id) {
    redirect("projectDetails.html", false, [["no", id]]);
}

// Header buttons
function openRandomProject() {
    viewProject(tableMap.get("projectTable").allProjects[Math.floor(Math.random() * tableMap.get("projectTable").allProjects.length)].id);
}

function printProjects() {
    setTimeout(function () {
        const options = {
            filename: 'projects-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        html2pdf().set(options).from(element).save();
    }, 2000);
}

function filterProjects() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', (event) => {
            filters[event.target.value] = event.target.checked;
            tableMap.get("projectTable").display(true);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = false;
    });
    filterProjects();
});