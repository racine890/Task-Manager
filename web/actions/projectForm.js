let current_project_id = null;
let parent_idea_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_project_id = params.get('no');
    parent_idea_id = params.get('idea');

    getAllCategories().then((categories) => {
        let select = document.getElementById("category");
        categories.forEach((category) => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        })
    })

    if (current_project_id) {
        getProject(current_project_id).then((project) => {
            document.getElementById("title").value = project.name;
            document.getElementById("description").value = project.description;
            document.getElementById("start-date").value = project.start_date;
            document.getElementById("end-date").value = project.end_date;
            document.getElementById("submission").innerHTML = "Update";
        });
    } else {
        const now = new Date();

        const formattedNow = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + 'T' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        document.getElementById("start-date").value = formattedNow;
        document.getElementById("end-date").value = formattedNow;
    }

    if (parent_idea_id) {
        getIdea(parent_idea_id).then((idea) => {
            document.getElementById("title").value = idea.name;
            document.getElementById("description").value = idea.description;
        });
    }

    /** Specifies addUser() as the action of userForm, just like php action thing */
    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (current_project_id) {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            updateProject(current_project_id, title, description, start_date, end_date, category_id);
        } else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            saveProject(title, description, start_date, end_date, category_id);
            if (parent_idea_id) {
                removeIdea(parent_idea_id);
            };
        }
    });
});
