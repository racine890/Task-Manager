let project_id = null;
let current_task_id = null;

document.addEventListener('DOMContentLoaded', () => {
    getAllCategories().then((categories) => {
        let select = document.getElementById("category");
        categories.forEach((category) => {
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    })

    const params = new URLSearchParams(window.location.search);
    project_id = params.get('project');

    const params2 = new URLSearchParams(window.location.search);
    current_task_id = params.get('no');

    if (current_task_id) {
        getTask(current_task_id).then((task) => {
            document.getElementById("title").value = task.name;
            document.getElementById("description").value = task.description;
            document.getElementById("start-date").value = task.start_date;
            document.getElementById("end-date").value = task.end_date;
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

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (current_task_id) {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;

            updateTask(current_task_id, title, description, category_id, start_date, end_date);
        } else if (project_id) {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;
            const end_date = document.getElementById('end-date').value;
            const start_date = document.getElementById('start-date').value;

            saveTask(title, description, category_id, start_date, end_date, null, project_id);
        } else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;
            const end_date = document.getElementById('end-date').value;
            const start_date = document.getElementById('start-date').value;

            saveTask(title, description, category_id, start_date, end_date);
        }
    });
});
