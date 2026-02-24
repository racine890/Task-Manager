current_project_id = null;

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('export-options').style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    current_project_id = params.get('no');

    if (current_project_id) {
        getProject(current_project_id).then((project) => {
            const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Abandoned"];

            document.getElementById("title").innerText = project.name;
            document.getElementById("description").innerText = project.description;
            document.getElementById("start-date").innerText = project.start_date;
            document.getElementById("end-date").innerText = project.end_date;
            document.getElementById("status").innerText = statuses[project.status];
            document.getElementById("status").classList.add(statuses[project.status]);

            refreshPrismStyles();

            getCategory(project.category_id).then((category) => {
                document.getElementById("category").innerText = category.name;
            })

            getWorkersByProject(current_project_id).then((workers) => {
                workers.forEach(worker => {
                    preloadUser(worker);
                });
            });

            getProjectsByProject(current_project_id).then((projects) => {
                projects.forEach(project => {
                    preloadProject(project);
                });
            });

            getTasksByProject(current_project_id).then((tasks) => {
                tasks.forEach(task => {
                    preloadTask(task);
                });
            });

            getResourcesByProject(current_project_id).then((resources) => {
                resources.forEach(resource => {
                    preloadResource(resource);
                });
            });

            todo_btn = document.getElementById("todo");
            abandon_btn = document.getElementById("abandon");
            start_btn = document.getElementById("start");
            pause_btn = document.getElementById("pause");
            test_btn = document.getElementById("test");
            finish_btn = document.getElementById("finish");

            if (project.status == STATUS.NEW) {
                todo_btn.style.display = 'block';
                start_btn.style.display = 'block';
            } else if (project.status == STATUS.PAUSED) {
                start_btn.style.display = 'block';
            } else if (project.status == STATUS.STARTED) {
                pause_btn.style.display = 'block';
                start_btn.style.display = 'block';
                abandon_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (project.status == STATUS.TESTING) {
                start_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (project.status == STATUS.TODO) {
                start_btn.style.display = 'block';
            }

            document.getElementById("todo").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.TODO).then(() => {
                    location.reload();
                })
            });

            document.getElementById("abandon").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.ABANDONED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("start").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.STARTED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("pause").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.PAUSED).then(() => {
                    location.reload();
                })
            });

            document.getElementById("test").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.TESTING).then(() => {
                    location.reload();
                })
            });

            document.getElementById("finish").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.FINISHED).then(() => {
                    location.reload();
                })
            });

        });
    }
});

function download(path) {
    downloadRessource(path);
}

function preloadResource(resource) {
    const li = document.createElement('li');
    li.setAttribute('data-id', resource.id);

    const seer = `<i class="fas fa-eye icon" title="Edit" onclick="seeResource(this.parentElement)"></i>
    <i class="fas fa-download icon" title="Download" onclick="download('${resource.path}')"></i>`;
    const delr = `<i class="fas fa-trash icon" title="Delete" onclick="removeResource(this.parentElement)"></i>`;
    li.innerHTML = `
        ${resource.path}
        ${hasRight('read_ressource') ? seer : ''}
        ${hasRight('delete_ressource') ? delr : ''}
    `;

    let list = document.getElementById("ressources-list");
    list.appendChild(li);
}

function preloadUser(user) {
    const li = document.createElement('li');
    li.setAttribute('data-id', user.id);
    const editu = `<i class="fas fa-edit icon" title="Edit" onclick="editUser(this.parentElement)"></i>`;
    const delu = `<i class="fas fa-trash icon" title="Delete" onclick="removeUser(this.parentElement)"></i>`;
    li.innerHTML = `
        ${user.username}
        ${hasRight('update_user') ? editu : ''}
        ${hasRight('delete_user') ? delu : ''}
    `;
    let userList = document.getElementById("users-list");
    userList.appendChild(li);
}

function seeResource(element) {
    let resId = element.getAttribute('data-id');

    getRessource(resId).then((resource) => {
        path = resource.path;
        getRessourceUrl(path).then((url) => {
            const popup = window.open('', 'popup', 'width=600,height=400,scrollbars=yes');
            if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.webp')) {
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '100%';
                popup.document.body.appendChild(img);
            } else if (path.endsWith('.pdf')) {
                const canvas = document.createElement('canvas');
                canvas.id = 'pdf-canvas';
                const context = canvas.getContext('2d');

                function renderPage(pdf, pageNum) {
                    pdf.getPage(pageNum).then(page => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });

                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        popup.document.body.appendChild(canvas);

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext);
                    });

                }

                pdfjsLib.getDocument(url).promise.then(pdf => {
                    const numPages = pdf.numPages;

                    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                        renderPage(pdf, pageNum);
                    }
                }).catch(error => {
                    console.error('Erreur lors du chargement du PDF :', error);
                });
            } else {
                fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onload = function () {
                            const pre = document.createElement("pre");

                            const code = document.createElement("code");
                            code.classList.add('language-javascript');
                            code.textContent = reader.result;
                            Prism.highlightElement(code);

                            pre.appendChild(code);
                            pre.style.background = 'white';
                            pre.style.color = 'black';
                            popup.document.body.appendChild(pre);
                        };
                        reader.readAsText(blob);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération du fichier texte :", error);
                    });
            }
        });
    })
}

function removeResource(element) {
    let resId = element.getAttribute('data-id');
    dropProjectResource(current_project_id, resId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function preloadProject(project) {
    const li = document.createElement('li');
    li.setAttribute('data-id', project.id);
    const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editProject(this.parentElement)"></i>`;
    const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeProject(this.parentElement)"></i>`;
    li.innerHTML = `
        ${project.name}
        ${hasRight('update_project') ? editp : ''}
        ${hasRight('delete_project') ? delp : ''}
    `;
    let projectList = document.getElementById("projects-list");
    projectList.appendChild(li);
}

function preloadTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editTask(this.parentElement)"></i>`;
    const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeTask(this.parentElement)"></i>`;
    li.innerHTML = `<a href="#" onclick="openTask(${task.id})">
        ${task.name}</a>
        ${hasRight('update_task') ? editp : ''}
        ${hasRight('delete_task') ? delp : ''}
    `;
    let taskList = document.getElementById("tasks-list");
    taskList.appendChild(li);
}

function validateUser(element) {
    if (element.selectedItem) {
        affectWorker(current_project_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        const editu = `<i class="fas fa-edit icon" title="Edit" onclick="${element.editAction}(this.parentElement)"></i>`;
        const delu = `<i class="fas fa-trash icon" title="Delete" onclick="${element.deleteAction}(this.parentElement)"></i>`;
        li.innerHTML = `
            ${element.selectedValue}
            ${hasRight('update_user') ? editu : ''}
            ${hasRight('delete_user') ? delu : ''}
        `;

        let userList = document.getElementById("users-list");
        userList.appendChild(li);

        element.popup.style.display = 'none';
        element.searchInput.value = '';
        element.resultList.innerHTML = '';
        element.selectedItem = null;
    } else {
        alert("Veuillez sélectionner un élément.");
    }
}

function editUser(element) {
    let userId = element.getAttribute('data-id');
}

function removeUser(element) {
    let userId = element.getAttribute('data-id');
    dropWorker(current_project_id, userId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function validateProject(element) {
    if (element.selectedItem) {
        affectSubProject(current_project_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        const editp = `<i class="fas fa-edit icon" title="Edit" onclick="${element.editAction}(this.parentElement)"></i>`;
        const delp = `<i class="fas fa-trash icon" title="Delete" onclick="${element.deleteAction}(this.parentElement)"></i>`;
        li.innerHTML = `
            ${element.selectedValue}
            ${hasRight('update_project') ? editp : ''}
            ${hasRight('delete_project') ? delp : ''}
        `;

        let projectList = document.getElementById("projects-list");
        projectList.appendChild(li);

        element.popup.style.display = 'none';
        element.searchInput.value = '';
        element.resultList.innerHTML = '';
        element.selectedItem = null;
    } else {
        alert("Veuillez sélectionner un élément.");
    }
}

function editProject(element) {
    let id = element.getAttribute('data-id');

    redirect("projectForm.html", true, [["no", id]]);
}

function removeProject(element) {
    let projectId = element.getAttribute('data-id');
    dropSubProject(projectId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function validateTask(element) {
    if (element.selectedItem) {
        affectTask(current_project_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        const editp = `<i class="fas fa-edit icon" title="Edit" onclick="${element.editAction}(this.parentElement)"></i>`;
        const delp = `<i class="fas fa-trash icon" title="Delete" onclick="${element.deleteAction}(this.parentElement)"></i>`;
        li.innerHTML = `<a href="#" onclick="openTask(${element.selectedItem})">
            ${element.selectedValue}</a>
            ${hasRight('update_task') ? editp : ''}
            ${hasRight('delete_task') ? delp : ''}
        `;

        let taskList = document.getElementById("tasks-list");
        taskList.appendChild(li);

        element.popup.style.display = 'none';
        element.searchInput.value = '';
        element.resultList.innerHTML = '';
        element.selectedItem = null;
    } else {
        alert("Veuillez sélectionner un élément.");
    }
}

function editTask(element) {
    let id = element.getAttribute('data-id');

    redirect("taskForm.html", true, [["no", id]]);
}

function removeTask(element) {
    let taskId = element.getAttribute('data-id');
    dropTask(taskId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function createTask() {
    redirect("taskForm.html", true, [["project", current_project_id]]);
}

function openTask(taskId) {
    redirect("taskDetails.html", true, [["no", taskId]]);
}

function uploadFileAsResource() {
    document.getElementById('fileInput').click();
}

function printProject() {
    setTimeout(function () {
        const options = {
            filename: `project-${current_project_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}

function exportMenu() {
    document.getElementById('export-options').style.display = 'block';
}

function exportAs(format) {
    if (format === "tmpro") {

    }
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];

    uploadRessource(file).then((path) => {
        saveRessource('pr-' + current_project_id, path).then(() => {
            assignLastResourceToProject(current_project_id).then(() => {
                alert("Resource successfully added !");
                location.reload();
            })
        })
    })
});

function refreshPrismStyles() {
    // To highlight all elements with the 'language-' class
    Prism.highlightAll();

    const codeElements = document.querySelectorAll('.language-javascript');

    codeElements.forEach(el => {
        el.classList.add('my-class');
    });
}
