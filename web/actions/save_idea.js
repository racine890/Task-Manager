let current_idea_id = null;
let current_project_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_idea_id = params.get('idea');
    current_project_id = params.get('project');

    if (current_idea_id) {
        getIdea(current_idea_id).then((idea) => {
            document.getElementById("title").value = idea.name;
            document.getElementById("description").value = idea.description;
            document.getElementById("submission").innerHTML = "Update";

            if (idea.project_id) {
                current_project_id = idea.project_id;
            }

            document.getElementById("convert-btn").style.display = "inline-block";
        });
    }

    if (current_project_id) {
        document.getElementById("project-id").value = current_project_id;
        getProject(current_project_id).then((project) => {
            document.getElementById("project-link").innerText = project.name;
        });
    }

    document.getElementById('ideaForm').addEventListener('submit', (event) => {
        event.preventDefault();

        if (current_idea_id) {
            updateIdea(current_idea_id);
        } else if (current_project_id) {
            saveIdea(current_project_id);
        } else {
            alert("An idea must belong to a project.");
        }
    });
});

function convertToTask() {
    if (current_idea_id) {
        redirect("taskForm.html", true, [["idea", current_idea_id]]);
    }
}

function openProject(projectId) {
    redirect("projectDetails.html", true, [["no", projectId]]);
}
