const projects = [
    { id: 1, name: 'Projet Alpha', description: 'Description du projet Alpha' },
    { id: 2, name: 'Projet Beta', description: 'Description du projet Beta' },
    // Ajoutez plus de projets ici
];

let currentPage = 1;
const itemsPerPage = 5;

function displayProjects() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    projects.slice(start, end).forEach(project => {
        const row = `<tr>
            <td>${project.id}</td>
            <td>${project.name}</td>
            <td>${project.description}</td>
            <td>
                <button onclick="editProject(${project.id})">Éditer</button>
                <button onclick="deleteProject(${project.id})">Supprimer</button>
            </td>
        </tr>`;
        projectList.innerHTML += row;
    });
}

function editProject(id) {
    alert(`Édition du projet ${id}`);
}

function deleteProject(id) {
    alert(`Suppression du projet ${id}`);
}

document.getElementById('next').onclick = () => {
    currentPage++;
    displayProjects();
};

document.getElementById('prev').onclick = () => {
    currentPage = Math.max(1, currentPage - 1);
    displayProjects();
};

document.getElementById('search').oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query)
    );
    displayFilteredProjects(filteredProjects);
};

function displayFilteredProjects(filteredProjects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    
    filteredProjects.forEach(project => {
        const row = `<tr>
            <td>${project.id}</td>
            <td>${project.name}</td>
            <td>${project.description}</td>
            <td>
                <button onclick="editProject(${project.id})">Éditer</button>
                <button onclick="deleteProject(${project.id})">Supprimer</button>
            </td>
        </tr>`;
        projectList.innerHTML += row;
    });
}

// Initial display
displayProjects();
