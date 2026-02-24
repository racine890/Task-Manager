// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Label", "Description"]; }

function onLoadData(idea) { return [idea.id, idea.name, idea.description]; }

function onLoadAction(idea) {
    return [
        { name: "Edit", func: "editIdea", arg: idea.id, right: "update_idea" },
        { name: "Delete", func: "deleteIdea", arg: idea.id, color: "danger", right: "delete_idea" },
        { name: "Create Project", func: "validate", arg: idea.id, color: "success", right: "create_project" }
    ];
}

function editIdea(id) {
    redirect("ideaForm.html", false, [["idea", id]]);
}

function deleteIdea(id) {
    const confirme = confirm("Do you want to remove that Idea ?");
    if (confirme) {
        removeIdea(id).then(() => {
            alert("Idea removed !");
            location.reload();
        });
    }
}

function printIdeas() {
    setTimeout(function () {
        const options = {
            filename: 'ideas-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        html2pdf().set(options).from(element).save();
    }, 2000);
}

function validate(id) {
    const confirme = confirm("Do you want to create a project from this idea ?");
    if (confirme) {
        redirect("projectForm.html", false, [["idea", id]]);
    }
}