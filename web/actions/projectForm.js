let current_project_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_project_id = params.get('no');
    const parent_project_id_param = params.get('project');

    getAllCategories().then((categories) => {
        let select = document.getElementById("category");
        categories.forEach((category) => {
            if (category.target === 'project' || category.target === 'both') {
                let option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            }
        });
    })

    appProjectService.getAll().then((projects) => {
        let select = document.getElementById("parent-project");
        const searchInput = document.getElementById("parent-project-search");
        let allProjects = projects || [];
        let currentSelected = null;

        allProjects.forEach((project) => {
            let option = document.createElement("option");
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        })

        if (parent_project_id_param) {
            currentSelected = parent_project_id_param;
            select.value = parent_project_id_param;
        }

        searchInput.addEventListener('input', () => {
            const term = searchInput.value.trim().toLowerCase();
            select.innerHTML = '<option value="">-- No parent --</option>';

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

            if (currentSelected && filtered.some(p => p.id == currentSelected)) {
                select.value = currentSelected;
            }
        });

        select.addEventListener('change', () => {
            currentSelected = select.value || null;
        });
    })

    if (current_project_id) {
        getProject(current_project_id).then((project) => {
            document.getElementById("title").value = project.name;
            document.getElementById("description").value = project.description;
            document.getElementById("start-date").value = project.start_date;
            document.getElementById("end-date").value = project.end_date;
            document.getElementById("submission").innerHTML = "Update";
            if (project.hourly_rate) {
                document.getElementById("hourly-rate").value = project.hourly_rate;
            }
            if (project.external) {
                document.getElementById("external").checked = true;
            }
            if (project.parent) {
                document.getElementById("parent-project").value = project.parent;
            }
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

        const parent_project_id = document.getElementById('parent-project').value;
        const hourly_rate = document.getElementById('hourly-rate').value || null;
        const external = document.getElementById('external').checked ? 1 : 0;

        if (current_project_id) {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            updateProject(current_project_id, title, description, start_date, end_date, category_id, parent_project_id, hourly_rate, external);
        } else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            saveProject(title, description, start_date, end_date, category_id, parent_project_id, hourly_rate, external);
        }
    });
});
