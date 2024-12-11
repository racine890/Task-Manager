let lastDisplayed = 0;
let allProjects = [];
let loadedPages = [];
appDataManager.remvar("form.project.id");
appDataManager.remvar("form.idea.id");

function fillArray(projects, projectList){
    projectList.innerHTML = '';
    projects.forEach(project => {

        const row = `<tr>
            <td>${project.id}</td>
            <td>${project.name}</td>
            <td>${project.description}</td>
            <td>
                <button onclick="displayProject(${project.id})">See</button>
                <button onclick="editProject(${project.id})">Edit</button>
                <button onclick="deleteProject(${project.id})">Delete</button>
            </td>
        </tr>`;
        lastDisplayed = project.id;
        projectList.innerHTML += row;
    });
}

function displayProjects(forward=true) {
    const projectList = document.getElementById('my-table');

    if(forward == true){
        getProjects(lastDisplayed).then((projects)=>{
            if(projects.length > 0){
                allProjects = projects;
                fillArray(projects, projectList);
            } else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allProjects = loadedPages.pop();
        fillArray(allProjects, projectList);
    } else {
        alert("No more data before!");
    }

}

function editProject(id) {
    appDataManager.setvar("form.project.id", id);
    redirect("projectForm.html");
}

function displayProject(id) {
    appDataManager.setvar("form.project.id", id);
    redirect("projectDetails.html");
}

function openRandomProject(){
    displayProject(allProjects[Math.floor(Math.random() * allProjects.length)].id);
}

function deleteProject(id) {
    const confirme = confirm("Do you want to remove that Project ?");
	if (confirme) {
        removeProject(id).then(() => {
            displayProjects();
        });
	}
}

document.getElementById('next').onclick = () => {
    loadedPages.push(allProjects);
    displayProjects();
};

document.getElementById('prev').onclick = () => {
    displayProjects(false);
};

async function getProjects(){
    
    try{
        // And let the service save the constructed user.
        // It's asynchronous, so you have to await it.
        let response = await appProjectService.get_paginated(lastDisplayed);

        if(response != null){
            let gotProjects = [];
			response.forEach((gotProject)=>{
				let tmp = new project();
				tmp.map(gotProject);
				gotProjects.push(
					tmp
				)
			})

			return gotProjects;
        }

    } catch(Error){
        alert("An error occured!");
    }
}

async function removeProject(id){
    
    try{
        // And let the service save the constructed user.
        // It's asynchronous, so you have to await it.
        await appProjectService.delete(id);

    } catch(Error){
        alert("An error occured!");
    }
}

function printProjects(){
    setTimeout(function() {
        const options = {
            filename: 'projects-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    displayProjects();
});