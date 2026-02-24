let current_idea_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_idea_id = params.get('idea');

    if (current_idea_id) {
        getIdea(current_idea_id).then((idea) => {
            document.getElementById("title").value = idea.name;
            document.getElementById("description").value = idea.description;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    /** Specifies addUser() as the action of userForm, just like php action thing */
    document.getElementById('ideaForm').addEventListener('submit', (event) => {
        event.preventDefault();

        if (current_idea_id) {
            updateIdea(current_idea_id);
        } else {
            saveIdea();
        }
    });
});
