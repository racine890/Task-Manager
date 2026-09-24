current_project_id = null;
current_project_external = false;
project_taks = [];

function getAllTasks(projectId, visited = new Set()) {
    return getAllTasksByProject(projectId, visited);
}

function getAllSubProjects(projectId, visited = new Set()) {
    return getAllSubProjectsByProject(projectId, visited);
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('export-options').style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    current_project_id = params.get('no');

    if (current_project_id) {

        spb = document.getElementById('create-subproject-btn');
        if (spb && !hasRight('create_project')) {
            spb.style.display = 'none';
        }

        ib = document.getElementById('create-idea-btn');
        if (ib && !hasRight('create_idea')) {
            ib.style.display = 'none';
        }

        tb = document.getElementById('create-task-btn');
        if (tb && !hasRight('create_task')) {
            tb.style.display = 'none';
        }

        getProject(current_project_id).then((project) => {
            const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];

            document.getElementById("title").innerText = project.name;
            setTimeout(() => {
                const descEl = document.getElementById("description");
                descEl.innerText = project.description;
                Prism.highlightElement(descEl);
            }, 0);
            document.getElementById("start-date").innerText = project.start_date;
            document.getElementById("end-date").innerText = project.end_date;
            document.getElementById("status").innerText = statuses[project.status];
            document.getElementById("status").classList.add(statuses[project.status]);

            current_project_external = project.external ? true : false;

            if (project.external) {
                document.getElementById("external-project").style.display = 'block';
                document.getElementById("hourly-rate").innerText = project.hourly_rate != null ? project.hourly_rate : 'Non défini';
            }

            if (project.parent) {
                const parentLink = document.getElementById("parent-project");
                parentLink.style.display = 'inline';
                parentLink.addEventListener('click', () => {
                    openProject(project.parent);
                });
            }

            refreshPrismStyles();

            if (project.category_id) {
                getCategory(project.category_id).then((category) => {
                    document.getElementById("category").innerText = category.name;

                    const allowedStatuses = category.allowed_statuses && category.allowed_statuses.length > 0
                        ? category.allowed_statuses
                        : [0, 1, 2, 3, 4, 5, 6, 7, 8];

                    const statusButtons = document.querySelectorAll('#status ~ p button');
                    if (allowedStatuses.length <= 1) {
                        statusButtons.forEach(btn => btn.style.display = 'none');
                    } else {
                        if (project.status == STATUS.NEW) {
                            if (allowedStatuses.includes(STATUS.TODO)) document.getElementById("todo").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                        } else if (project.status == STATUS.PAUSED) {
                            if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                        } else if (project.status == STATUS.STARTED) {
                            if (allowedStatuses.includes(STATUS.PAUSED)) document.getElementById("pause").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.ABANDONED)) document.getElementById("abandon").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.FINISHED)) document.getElementById("finish").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.STARTED)) { const el = document.getElementById('task-creation'); if (el) el.style.display = 'block'; }
                        } else if (project.status == STATUS.TESTING) {
                            if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.FINISHED)) document.getElementById("finish").style.display = 'block';
                        } else if (project.status == STATUS.TODO) {
                            if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                        } else if (project.status == STATUS.FINISHED) {
                            if (allowedStatuses.includes(STATUS.FEEDBACK)) document.getElementById("feedback").style.display = 'block';
                            if (allowedStatuses.includes(STATUS.DELIVERED)) document.getElementById("delivered").style.display = 'block';
                        } else if (project.status == STATUS.FEEDBACK) {
                            if (allowedStatuses.includes(STATUS.STARTED)) document.getElementById("start").style.display = 'block';
                        }
                    }
                })
            }

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

            getIdeasByProject(current_project_id).then((ideas) => {
                if (ideas && ideas.length > 0) {
                    ideas.forEach(idea => {
                        preloadIdea(idea);
                    });
                }
            });

            getTasksByProject(current_project_id).then(async (tasks) => {
				project_taks = tasks;
                tasks.forEach(task => {
                    preloadTask(task);
                });

                const allTasks = await getAllTasks(current_project_id);

                const finishedStatuses = [STATUS.FINISHED, STATUS.FEEDBACK, STATUS.DELIVERED, STATUS.ABANDONED];
                const finished = allTasks.filter(t => finishedStatuses.includes(t.status)).length;
                const total = allTasks.length;
                const progress = total > 0 ? Math.round((finished / total) * 100) : 0;

                const progressBar = document.getElementById("progress-bar");
                const progressValue = document.getElementById("progress-value");
                progressBar.style.width = progress + "%";
                progressValue.textContent = progress + "%";

                if (progress < 30) {
                    progressBar.style.background = "#ef4444";
                } else if (progress < 70) {
                    progressBar.style.background = "#f59e0b";
                } else {
                    progressBar.style.background = "#22c55e";
                }
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
            feedback_btn = document.getElementById("feedback");
            delivered_btn = document.getElementById("delivered");

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

            document.getElementById("feedback").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.FEEDBACK).then(() => {
                    location.reload();
                })
            });

            document.getElementById("delivered").addEventListener('click', () => {
                changeProjectStatus(current_project_id, STATUS.DELIVERED).then(() => {
                    location.reload();
                })
            });
        });
    }
});

function createSubProject() {
    redirect("projectForm.html", true, [["project", current_project_id]]);
}

function createIdea() {
    redirect("ideaForm.html", true, [["project", current_project_id]]);
}

function editIdea(element) {
    let id = element.getAttribute('data-id');
    redirect("ideaForm.html", true, [["idea", id]]);
}

function removeIdeaFromProject(element) {
    let ideaId = element.getAttribute('data-id');
    removeIdea(ideaId).then(() => {
        location.reload();
    });
}

function convertIdeaToTask(ideaId) {
    redirect("taskForm.html", true, [["idea", ideaId]]);
}

function preloadIdea(idea) {
    const li = document.createElement('li');
    li.setAttribute('data-id', idea.id);

    const editi = `<i class="fas fa-edit icon" title="Edit" onclick="editIdea(this.parentElement)"></i>`;
    const deli = `<i class="fas fa-trash icon" title="Delete" onclick="removeIdeaFromProject(this.parentElement)"></i>`;
    const convi = `<i class="fas fa-plus icon" title="Convert to task" onclick="convertIdeaToTask(${idea.id})"></i>`;
    li.innerHTML = `
        <a href="#" onclick="editIdea(this.parentElement)">
        ${idea.name}</a>
        ${hasRight('update_idea') ? editi : ''}
        ${hasRight('delete_idea') ? deli : ''}
        ${hasRight('create_task') ? convi : ''}
    `;
    let ideaList = document.getElementById("ideas-list");
    ideaList.appendChild(li);
}

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
    const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];
    li.setAttribute('class', statuses[project.status]);
    li.setAttribute('data-id', project.id);
    const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editProject(this.parentElement)"></i>`;
    const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeProject(this.parentElement)"></i>`;
    const externalBadge = project.external ? ' <span class="label" style="background: #6366f1; font-size: 10px; padding: 2px 6px; margin-left: 5px;">Externe</span>' : '';
    li.innerHTML = `
        <a href="#" onclick="openProject(${project.id})">${project.name}${externalBadge}</a>
        ${hasRight('update_project') ? editp : ''}
        ${hasRight('delete_project') ? delp : ''}
    `;
    let projectList = document.getElementById("projects-list");
    projectList.appendChild(li);
}

function openRandom() {
	const openable = project_taks.filter(t => t.status < 5);
	if (openable.length == 0) return;
	const ind = Math.floor(Math.random() * openable.length);
	openTask(openable[ind].id);
}

function preloadTask(task) {
    const li = document.createElement('li');
    const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];
    li.setAttribute('class', statuses[task.status]);
    li.setAttribute('data-id', task.id);
    const editp = `<i class="fas fa-edit icon" title="Edit" onclick="editTask(this.parentElement)"></i>`;
    const delp = `<i class="fas fa-trash icon" title="Delete" onclick="removeTask(this.parentElement)"></i>`;

    let evalBadge = '';
    if (current_project_external && task.evaluated_hours != null && !task.evaluation_validated) {
        evalBadge = '<i class="fas fa-exclamation-triangle icon" style="color: #f59e0b" title="Évaluation non validée"></i>';
    }
    li.innerHTML = `<a href="#" onclick="openTask(${task.id})">
        ${task.name}${evalBadge}</a>
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

function openProject(projectId) {
    redirect("projectDetails.html", true, [["no", projectId]]);
}

function openEvaluationReport() {
    redirect("evaluationReport.html", true, [["no", current_project_id]]);
}

function uploadFileAsResource() {
    document.getElementById('fileInput').click();
}

async function generateReport() {
    try {
        const project = await getProject(current_project_id);
        const allTasks = await getAllTasks(current_project_id);
        const allSubProjects = await getAllSubProjects(current_project_id);
        const workers = await getWorkersByProject(current_project_id);
        const ideas = await getIdeasByProject(current_project_id);
        const resources = await getResourcesByProject(current_project_id);

        const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Feedback", "Delivered", "Abandoned"];
        const statusColors = {
            New: '#acaa21', Todo: '#0caded', Started: '#a810f0', Paused: '#0eacec',
            Testing: '#ceaaad', Finished: '#0ada91', Feedback: '#f59e0b', Delivered: '#6366f1', Abandoned: '#900010'
        };

        const finishedStatuses = [STATUS.FINISHED, STATUS.FEEDBACK, STATUS.DELIVERED, STATUS.ABANDONED];
        const finished = allTasks.filter(t => finishedStatuses.includes(t.status)).length;
        const total = allTasks.length;
        const progress = total > 0 ? Math.round((finished / total) * 100) : 0;

        const statusCounts = {};
        statuses.forEach(s => statusCounts[s] = 0);
        allTasks.forEach(t => { statusCounts[statuses[t.status]]++; });

        const now = new Date();
        const reportDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
        const refCode = `PRJ/${current_project_id}/${now.getFullYear()}/${String(allTasks.length).padStart(4, '0')}`;

        const projectHourlyRate = project.hourly_rate != null ? parseFloat(project.hourly_rate) : null;

        const projectRateMap = { [project.id]: projectHourlyRate };
        allSubProjects.forEach(sp => {
            projectRateMap[sp.id] = sp.hourly_rate != null ? parseFloat(sp.hourly_rate) : null;
        });

        const evaluatedTasks = allTasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
        const pendingEvaluationTasks = allTasks.filter(t => t.evaluated_hours != null && !t.evaluation_validated);
        const totalEvaluatedHours = evaluatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
        const totalValidatedAmount = evaluatedTasks.reduce((sum, t) => {
            const rate = projectRateMap[t.project_id];
            const hours = parseFloat(t.evaluated_hours) || 0;
            return sum + (rate ? hours * rate : 0);
        }, 0);
        const totalPendingAmount = pendingEvaluationTasks.reduce((sum, t) => {
            const rate = projectRateMap[t.project_id];
            const hours = parseFloat(t.evaluated_hours) || 0;
            return sum + (rate ? hours * rate : 0);
        }, 0);
        const validatedHoursCount = evaluatedTasks.length;
        const pendingHoursCount = pendingEvaluationTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);

        let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Project Report - ${project.name}</title>
  <style>
    :root {
      --primary: #1a1a2e;
      --secondary: #16213e;
      --accent: #0f3460;
      --gold: #c5a572;
      --light: #f8f9fa;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; background: #e8e8e8; padding: 20px; color: var(--primary); position: relative; }
    body::before { content: 'CONFIDENTIEL'; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; font-weight: bold; color: rgba(197, 165, 114, 0.08); z-index: 0; pointer-events: none; white-space: nowrap; }
    .no-print { text-align: center; margin-bottom: 20px; }
    button { padding: 12px 30px; background: var(--accent); color: white; border: none; font-size: 16px; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    button:hover { background: var(--secondary); }
    .page { background: white; width: 210mm; min-height: 297mm; margin: 0 auto 20px; padding: 25mm 20mm; box-shadow: 0 0 15px rgba(0,0,0,0.2); position: relative; z-index: 1; page-break-after: always; }
    .official-header { border: 3px double var(--gold); padding: 20px; margin-bottom: 30px; text-align: center; background: linear-gradient(to bottom, #fff 0%, #f9f9f9 100%); }
    .official-header h1 { font-size: 16px; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 5px; }
    .official-header .subtitle { font-size: 14px; color: var(--accent); margin-bottom: 10px; }
    .official-header .divider { width: 200px; height: 2px; background: var(--gold); margin: 10px auto; }
    .doc-info { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-left: 4px solid var(--gold); flex-wrap: wrap; gap: 10px; }
    .doc-info-item { flex: 1; min-width: 120px; }
    .doc-info-item label { font-weight: bold; font-size: 11px; color: var(--accent); text-transform: uppercase; }
    .doc-info-item .value { font-size: 13px; margin-top: 3px; }
    .document-title { text-align: center; margin: 40px 0; padding: 20px; background: var(--accent); color: white; }
    .document-title h2 { font-size: 24px; letter-spacing: 1px; text-transform: uppercase; }
    .document-title .subtitle { font-size: 14px; margin-top: 10px; opacity: 0.9; }
    .section { margin-bottom: 30px; }
    .section-header { background: var(--secondary); color: white; padding: 10px 15px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
    .section-content { padding: 0 15px; text-align: justify; line-height: 1.8; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }
    th { background: var(--accent); color: white; padding: 12px 8px; text-align: left; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
    td { padding: 10px 8px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f8f9fa; }
    tr:hover { background: #e8f4f8; }
    .page-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 2px solid var(--gold); padding-top: 10px; font-size: 10px; color: #666; display: flex; justify-content: space-between; }
    .signature-block { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature { text-align: center; flex: 1; }
    .signature .title { font-weight: bold; margin-bottom: 60px; font-size: 12px; text-transform: uppercase; }
    .signature .name { border-top: 2px solid #333; padding-top: 10px; font-size: 11px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .stat-box { background: linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%); color: white; padding: 20px; text-align: center; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stat-box .number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
    .stat-box .label { font-size: 11px; opacity: 0.9; text-transform: uppercase; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 3px; color: white; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .info-table { width: 100%; margin: 20px 0; }
    .info-table td { padding: 8px 12px; border: none; }
    .info-table tr:nth-child(even) { background: transparent; }
    .info-table td:first-child { font-weight: bold; color: var(--accent); width: 40%; text-transform: uppercase; font-size: 10px; }
    ul.report-list { list-style: none; padding: 0; margin: 10px 0; }
    ul.report-list li { padding: 8px 12px; background: #f0f0f0; border-radius: 3px; margin-bottom: 6px; font-size: 12px; }
    ul.report-list li a { color: var(--accent); text-decoration: none; }
    @media print { body { background: white; padding: 0; } body::before { color: rgba(197, 165, 114, 0.05); } .no-print { display: none; } .page { margin: 0; box-shadow: none; page-break-after: always; } .page-footer { position: fixed; bottom: 15mm; } thead { display: table-header-group; } tr { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="no-print"><button onclick="window.print()">Print Report</button></div>
  <div class="page">
    <div class="official-header">
      <h1>Task Manager - Project Report</h1>
      <div class="divider"></div>
    </div>
    <div class="document-title">
      <h2>${project.name}</h2>
      <p class="subtitle">Category: ${project.category_name || project.category_id || 'N/A'}</p>
    </div>
    <div class="doc-info">
      <div class="doc-info-item"><label>Reference</label><div class="value">${refCode}</div></div>
      <div class="doc-info-item"><label>Date Issued</label><div class="value">${reportDate}</div></div>
      <div class="doc-info-item"><label>Classification</label><div class="value">Confidential</div></div>
      <div class="doc-info-item"><label>Project</label><div class="value">#${project.id}</div></div>
    </div>
    <div style="padding: 15px; background: #fff9e6; border-left: 4px solid var(--gold);">
      <p style="font-size: 11px; line-height: 1.6;"><strong>Important note:</strong> This document contains confidential information intended exclusively for project stakeholders. Unauthorized disclosure is strictly prohibited.</p>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page 1</span><span>${refCode}</span></div>
  </div>
  <div class="page">
    <div class="section">
      <div class="section-header">I. Executive Summary</div>
      <div class="section-content">
        <p style="margin-bottom: 15px;"><strong>Description:</strong> ${project.description || 'No description available.'}</p>
        <p style="margin-bottom: 15px;"><strong>Period:</strong> From ${project.start_date || 'N/A'} to ${project.end_date || 'N/A'}</p>
        <p><strong>Current Status:</strong> ${statuses[project.status] || 'N/A'}</p>
      </div>
    </div>
    <div class="section">
      <div class="section-header">II. Key Indicators</div>
      <div class="stats-grid">
        <div class="stat-box"><div class="number">${total}</div><div class="label">Total Tasks</div></div>
        <div class="stat-box"><div class="number">${finished}</div><div class="label">Completed Tasks</div></div>
        <div class="stat-box"><div class="number">${progress}%</div><div class="label">Progress</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">III. Economic Evaluation</div>
      <div class="section-content">
        <p style="margin-bottom: 15px;"><strong>Project Hourly Rate:</strong> ${projectHourlyRate != null ? projectHourlyRate.toFixed(2) + ' / hour' : 'Not defined'}</p>
        <p style="margin-bottom: 15px;"><strong>External Project:</strong> ${project.external ? 'Yes' : 'No'}</p>
        <table class="info-table">
          <tbody>
            <tr><td>Validated Evaluations</td><td>${validatedHoursCount} task(s)</td></tr>
            <tr><td>Total Evaluated Hours (validated)</td><td>${totalEvaluatedHours.toFixed(2)} h</td></tr>
            <tr><td>Estimated Cost (validated)</td><td style="font-weight: bold; color: #0f3460;">${totalValidatedAmount.toFixed(2)}</td></tr>
            <tr><td>Pending Evaluations</td><td>${pendingEvaluationTasks.length} task(s)</td></tr>
            <tr><td>Total Evaluated Hours (pending)</td><td>${pendingHoursCount.toFixed(2)} h</td></tr>
            <tr><td>Estimated Cost (pending)</td><td>${totalPendingAmount.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div class="stats-grid" style="margin-top: 20px;">
          <div class="stat-box" style="background: linear-gradient(135deg, #0ada91 0%, #0f3460 100%);"><div class="number">${totalValidatedAmount.toFixed(2)}</div><div class="label">Total Validated Amount</div></div>
          <div class="stat-box" style="background: linear-gradient(135deg, #f59e0b 0%, #a810f0 100%);"><div class="number">${totalEvaluatedHours.toFixed(2)}</div><div class="label">Total Evaluated Hours</div></div>
          <div class="stat-box" style="background: linear-gradient(135deg, #6366f1 0%, #0f3460 100%);"><div class="number">${pendingEvaluationTasks.length}</div><div class="label">Pending Evaluations</div></div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">IV. Status Distribution</div>
      <table>
        <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
        <tbody>
          ${statuses.map(s => { const count = statusCounts[s]; const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0; return `<tr><td><span class="status-badge" style="background:${statusColors[s] || '#666'}">${s}</span></td><td style="text-align:center;">${count}</td><td style="text-align:center;">${pct}%</td></tr>`; }).join('')}
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-header">V. Project Information</div>
      <table class="info-table">
        <tbody>
          <tr><td>Category</td><td>${project.category_name || 'N/A'}</td></tr>
          <tr><td>Creation Date</td><td>${project.create_date ? new Date(project.create_date).toLocaleDateString('en-US') : 'N/A'}</td></tr>
          <tr><td>Active</td><td>${project.active ? 'Yes' : 'No'}</td></tr>
          <tr><td>Parent Project</td><td>${project.parent ? `#${project.parent}` : 'N/A (root project)'}</td></tr>
          <tr><td>Effective Start Date</td><td>${project.effective_start ? new Date(project.effective_start).toLocaleDateString('en-US') : 'N/A'}</td></tr>
          <tr><td>Effective End Date</td><td>${project.effective_end ? new Date(project.effective_end).toLocaleDateString('en-US') : 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page 2</span><span>${refCode}</span></div>
  </div>`;

        let pageNum = 3;

        if (allSubProjects.length > 0) {
            html += `<div class="page">
    <div class="section">
      <div class="section-header">VI. Sub-Projects (${allSubProjects.length})</div>
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Status</th><th>Start Date</th><th>End Date</th><th>Category</th></tr></thead>
        <tbody>
          ${allSubProjects.map((sp, i) => `<tr><td>${i + 1}</td><td>${sp.name}</td><td><span class="status-badge" style="background:${statusColors[statuses[sp.status]] || '#666'}">${statuses[sp.status] || 'N/A'}</span></td><td>${sp.start_date || 'N/A'}</td><td>${sp.end_date || 'N/A'}</td><td>${sp.category_name || sp.category_id || 'N/A'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
            pageNum++;
        }

        html += `<div class="page">
    <div class="section">
      <div class="section-header">VII. Tasks (${allTasks.length})</div>
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Status</th><th>Project</th><th>Category</th><th>Evaluated Hours</th><th>Evaluation Validated</th><th>Estimated Amount</th><th>Created</th><th>Active</th></tr></thead>
        <tbody>
           ${allTasks.map((task, i) => {
                const taskRate = projectRateMap[task.project_id];
                const taskEvalHours = task.evaluated_hours != null ? (parseFloat(task.evaluated_hours) || 0) : null;
                const taskEvalValidated = task.evaluation_validated ? 'Yes' : 'No';
                const taskAmount = (taskEvalHours !== null && taskRate) ? (taskEvalHours * taskRate).toFixed(2) : '-';
                const taskEvalHoursDisplay = taskEvalHours !== null ? taskEvalHours.toFixed(2) + ' h' : 'Not evaluated';
                return `<tr><td>${i + 1}</td><td>${task.name}</td><td><span class="status-badge" style="background:${statusColors[statuses[task.status]] || '#666'}">${statuses[task.status] || 'N/A'}</span></td><td>${task.project_name || task.project_id || 'N/A'}</td><td>${task.category_name || task.category_id || 'N/A'}</td><td>${taskEvalHoursDisplay}</td><td style="text-align:center;">${taskEvalValidated}</td><td style="text-align:center;">${taskAmount}</td><td>${task.create_date ? new Date(task.create_date).toLocaleDateString('en-US') : 'N/A'}</td><td style="text-align:center;">${task.active === 1 || task.active === true ? 'Yes' : 'No'}</td></tr>`;
            }).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
        pageNum++;

        const evaluatedValidatedTasks = allTasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
        const evaluatedPendingTasks = allTasks.filter(t => t.evaluated_hours != null && !t.evaluation_validated);

        html += `<div class="page">
    <div class="section">
      <div class="section-header">VIII. Economic Report (${allTasks.filter(t => t.evaluated_hours != null).length} evaluated tasks)</div>
      <div class="stats-grid">
        <div class="stat-box" style="background: linear-gradient(135deg, #0ada91 0%, var(--accent) 100%);"><div class="number">${totalValidatedAmount.toFixed(2)}</div><div class="label">Total Validated Amount</div></div>
        <div class="stat-box"><div class="number">${totalEvaluatedHours.toFixed(2)}</div><div class="label">Total Evaluated Hours</div></div>
        <div class="stat-box" style="background: linear-gradient(135deg, #f59e0b 0%, #a810f0 100%);"><div class="number">${pendingEvaluationTasks.length}</div><div class="label">Pending Evaluations</div></div>
        <div class="stat-box" style="background: linear-gradient(135deg, #6366f1 0%, var(--accent) 100%);"><div class="number">${(totalValidatedAmount + totalPendingAmount).toFixed(2)}</div><div class="label">Potential Total Cost</div></div>
      </div>

      <table>
        <thead><tr><th>#</th><th>Task Name</th><th>Project</th><th>Evaluated Hours</th><th>Hourly Rate</th><th>Amount</th><th>Status</th><th>Validated</th></tr></thead>
        <tbody>
          ${evaluatedValidatedTasks.map((task, i) => {
                const taskRate = projectRateMap[task.project_id];
                const hours = parseFloat(task.evaluated_hours) || 0;
                const amount = taskRate ? (hours * taskRate).toFixed(2) : '-';
                return `<tr><td>${i + 1}</td><td>${task.name}</td><td>${task.project_name || 'N/A'}</td><td>${hours.toFixed(2)} h</td><td>${taskRate != null ? taskRate.toFixed(2) : '-'}</td><td><strong>${amount}</strong></td><td><span class="status-badge" style="background:${statusColors[statuses[task.status]] || '#666'}">${statuses[task.status] || 'N/A'}</span></td><td style="text-align:center;">Yes</td></tr>`;
            }).join('')}
        </tbody>
      </table>

      <div class="section-header" style="margin-top: 30px;">Validated Tasks (${evaluatedValidatedTasks.length}) Summary</div>
      <table class="info-table">
        <tbody>
          <tr><td>Number of Validated Tasks</td><td>${evaluatedValidatedTasks.length}</td></tr>
          <tr><td>Total Evaluated Hours (validated)</td><td>${totalEvaluatedHours.toFixed(2)} h</td></tr>
          <tr><td>Total Estimated Cost (validated)</td><td style="font-weight: bold; color: var(--accent);">${totalValidatedAmount.toFixed(2)}</td></tr>
        </tbody>
      </table>

      ${pendingEvaluationTasks.length > 0 ? `<div class="section-header" style="margin-top: 30px;">Pending Evaluations (${pendingEvaluationTasks.length})</div>
      <table>
        <thead><tr><th>#</th><th>Task Name</th><th>Evaluated Hours</th><th>Hourly Rate</th><th>Estimated Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${pendingEvaluationTasks.map((task, i) => {
                const taskRate = projectRateMap[task.project_id];
                const hours = parseFloat(task.evaluated_hours) || 0;
                const amount = taskRate ? (hours * taskRate).toFixed(2) : '-';
                return `<tr><td>${i + 1}</td><td>${task.name}</td><td>${hours.toFixed(2)} h</td><td>${taskRate != null ? taskRate.toFixed(2) : '-'}</td><td>${amount}</td><td><span class="status-badge" style="background:${statusColors[statuses[task.status]] || '#666'}">${statuses[task.status] || 'N/A'}</span></td></tr>`;
            }).join('')}
        </tbody>
      </table>
      <table class="info-table" style="margin-top: 20px;">
        <tbody>
          <tr><td>Total Estimated Cost (pending)</td><td>${totalPendingAmount.toFixed(2)}</td></tr>
        </tbody>
      </table>` : ''}

      ${allSubProjects.length > 0 ? `<div class="section-header" style="margin-top: 30px;">Sub-Projects Breakdown</div>
      <table>
        <thead><tr><th>#</th><th>Sub-Project</th><th>Hourly Rate</th><th>Total Evaluated Hours</th><th>Validated Hours</th><th>Estimated Amount</th></tr></thead>
        <tbody>
          ${allSubProjects.map((sp, i) => {
                const spRate = sp.hourly_rate != null ? parseFloat(sp.hourly_rate) : null;
                const spTasks = allTasks.filter(t => t.project_id == sp.id);
                const spValidatedTasks = spTasks.filter(t => t.evaluated_hours != null && t.evaluation_validated);
                const spTotalHours = spTasks.filter(t => t.evaluated_hours != null).reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
                const spValidatedHours = spValidatedTasks.reduce((sum, t) => sum + (parseFloat(t.evaluated_hours) || 0), 0);
                const spAmount = spValidatedTasks.reduce((sum, t) => sum + ((parseFloat(t.evaluated_hours) || 0) * (spRate || 0)), 0);
                return `<tr><td>${i + 1}</td><td>${sp.name}</td><td>${spRate != null ? spRate.toFixed(2) : 'Not defined'}</td><td>${spTotalHours.toFixed(2)} h</td><td>${spValidatedHours.toFixed(2)} h</td><td>${spAmount.toFixed(2)}</td></tr>`;
            }).join('')}
        </tbody>
      </table>` : ''}
    </div>
    <div class="signature-block">
      <div class="signature"><div class="title">Project Manager</div><div class="name">Auto-generated</div></div>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
        pageNum++;

        if (workers && workers.length > 0) {
            html += `<div class="page">
    <div class="section">
      <div class="section-header">IX. Team (${workers.length})</div>
      <table>
        <thead><tr><th>#</th><th>Username</th><th>Email</th><th>Active</th></tr></thead>
        <tbody>
          ${workers.map((w, i) => `<tr><td>${i + 1}</td><td>${w.username || 'N/A'}</td><td>${w.email || 'N/A'}</td><td style="text-align:center;">${w.active === 1 || w.active === true ? 'Yes' : 'No'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
            pageNum++;
        }

        if (ideas && ideas.length > 0) {
            html += `<div class="page">
    <div class="section">
      <div class="section-header">X. Ideas (${ideas.length})</div>
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Description</th><th>Created</th><th>Active</th></tr></thead>
        <tbody>
          ${ideas.map((idea, i) => `<tr><td>${i + 1}</td><td>${idea.name || 'N/A'}</td><td>${(idea.description || '').substring(0, 200)}${idea.description && idea.description.length > 200 ? '...' : ''}</td><td>${idea.create_date ? new Date(idea.create_date).toLocaleDateString('en-US') : 'N/A'}</td><td style="text-align:center;">${idea.active === 1 || idea.active === true ? 'Yes' : 'No'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
            pageNum++;
        }

        if (resources && resources.length > 0) {
            html += `<div class="page">
    <div class="section">
      <div class="section-header">XI. Resources (${resources.length})</div>
      <table>
        <thead><tr><th>#</th><th>Title</th><th>Path</th><th>Created</th></tr></thead>
        <tbody>
          ${resources.map((r, i) => `<tr><td>${i + 1}</td><td>${r.title || 'N/A'}</td><td>${r.path || 'N/A'}</td><td>${r.create_date ? new Date(r.create_date).toLocaleDateString('en-US') : 'N/A'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="signature-block">
      <div class="signature"><div class="title">Project Manager</div><div class="name">Auto-generated</div></div>
    </div>
    <div class="page-footer"><span>Task Manager</span><span>Page ${pageNum}</span><span>${refCode}</span></div>
  </div>`;
        }

        html += `</body></html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
        }
    } catch (Error) {
        console.error('Error generating report:', Error);
        alert("An error occurred while generating the report!");
    }
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
