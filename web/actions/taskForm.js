document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlProjectId = params.get('project');
    const urlTaskId = params.get('no');
    const urlIdeaId = params.get('idea');

    getAllCategories().then((categories) => {
        let select = document.getElementById("category");
        categories.forEach((category) => {
            if (category.target === 'task' || category.target === 'both') {
                let option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            }
        });
    })

    appProjectService.getAll().then((projects) => {
        let select = document.getElementById("project");
        const searchInput = document.getElementById("project-search");
        let allProjects = projects || [];
        let currentSelected = null;

        allProjects.forEach((project) => {
            let option = document.createElement("option");
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });

        if (urlTaskId) {
            getTask(urlTaskId).then((task) => {
                document.getElementById("title").value = task.name;
                document.getElementById("description").value = task.description;
                document.getElementById("start-date").value = task.start_date;
                document.getElementById("end-date").value = task.end_date;
                if (task.evaluated_hours) {
                    document.getElementById("evaluated-hours").value = task.evaluated_hours;
                }
                document.getElementById("submission").innerHTML = "Update";
                if (task.project_id) {
                    select.value = task.project_id;
                    currentSelected = task.project_id;
                }
            });
        } else if (urlIdeaId) {
            getIdea(urlIdeaId).then((idea) => {
                document.getElementById("title").value = idea.name;
                document.getElementById("description").value = idea.description;
                document.getElementById("submission").innerHTML = "Create from Idea";
                if (idea.project_id) {
                    select.value = idea.project_id;
                    currentSelected = idea.project_id;
                }

                const now = new Date();
                const formattedNow = now.getFullYear() + '-' +
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + 'T' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0');
                document.getElementById("start-date").value = formattedNow;
                document.getElementById("end-date").value = formattedNow;
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

            if (urlProjectId) {
                select.value = urlProjectId;
                currentSelected = urlProjectId;
            }
        }

        searchInput.addEventListener('input', () => {
            const term = searchInput.value.trim().toLowerCase();
            select.innerHTML = '<option value="">-- Select a project --</option>';

            let filtered = allProjects;
            if (term) {
                filtered = allProjects.filter(p => (p.name || '').toLowerCase().includes(term));
            }

            filtered.forEach((project) => {
                let option = document.createElement("option");
                option.value = project.id;
                option.textContent = project.name;
                select.appendChild(option);
            });

            if (currentSelected && filtered.some(p => p.id === currentSelected)) {
                select.value = currentSelected;
            }
        });

        select.addEventListener('change', () => {
            currentSelected = select.value || null;
        });
    })

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const selected_project_id = document.getElementById("project").value;
        const evaluated_hours = document.getElementById('evaluated-hours').value || null;

        if (urlTaskId) {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;

            updateTask(urlTaskId, title, description, category_id, start_date, end_date, selected_project_id, evaluated_hours);
        } else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;
            const end_date = document.getElementById('end-date').value;
            const start_date = document.getElementById('start-date').value;

            saveTask(title, description, category_id, start_date, end_date, urlIdeaId || null, selected_project_id, evaluated_hours);
        }
    });
});
