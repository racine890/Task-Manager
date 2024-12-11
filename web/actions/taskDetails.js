current_task_id = null;

document.addEventListener('DOMContentLoaded', () => {

    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    document.getElementById("noteCreation").style.display = 'none';

	if(appDataManager.checkvar("form.task.id")){
        getTask(appDataManager.getvar("form.task.id")).then((task)=>{
			const statuses = ["New", "Todo", "Started", "Paused", "Testing", "Finished", "Abandoned"];

            current_task_id = task.id;
            document.getElementById("title").innerText = task.name;
            document.getElementById("description").innerText = task.description;
            document.getElementById("status").innerText = statuses[task.status];
            document.getElementById("status").classList.add(statuses[task.status]);
            getCategory(task.category_id).then((category)=>{
                document.getElementById("category").innerText = category.name;
            })

            document.getElementById("parent-project").addEventListener('click', () => {
                openProject(task.project_id);
            });

            getWorkersByTask(current_task_id).then((workers)=>{
                workers.forEach(worker => {
                    preloadUser(worker);
                });
            });

            getNotesByTask(current_task_id).then((notes)=>{
                notes.forEach(note => {
                    preloadNote(note);
                });
            });

            getResourcesByTask(current_task_id).then((resources)=>{
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

            if(task.status == STATUS.NEW){
                todo_btn.style.display = 'block';
                start_btn.style.display = 'block';
            } else if (task.status == STATUS.PAUSED){
                start_btn.style.display = 'block';
            } else if (task.status == STATUS.STARTED){
                pause_btn.style.display = 'block';
                start_btn.style.display = 'block';
                abandon_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (task.status == STATUS.TESTING){
                start_btn.style.display = 'block';
                finish_btn.style.display = 'block';
            } else if (task.status == STATUS.TODO){
                start_btn.style.display = 'block';
            }

            document.getElementById("todo").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.TODO).then(()=>{
                    location.reload();
                })
            });

            document.getElementById("abandon").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.ABANDONED).then(()=>{
                    location.reload();
                })
            });

            document.getElementById("start").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.STARTED).then(()=>{
                    location.reload();
                })
            });

            document.getElementById("pause").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.PAUSED).then(()=>{
                    location.reload();
                })
            });

            document.getElementById("test").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.TESTING).then(()=>{
                    location.reload();
                })
            });

            document.getElementById("finish").addEventListener('click', ()=>{
                changeTaskStatus(current_task_id, STATUS.FINISHED).then(()=>{
                    location.reload();
                })
            });
        });
    }
});

function preloadUser(user){
    const li = document.createElement('li');
    li.setAttribute('data-id', user.key);
    li.innerHTML = `
        ${user.value}
        <i class="fas fa-edit icon" title="Edit" onclick="editUser(this.parentElement)"></i>
        <i class="fas fa-trash icon" title="Delete" onclick="removeUser(this.parentElement)"></i>
    `;
    let userList = document.getElementById("users-list");
    userList.appendChild(li);
}

function editUser(element){
    let userId = element.getAttribute('data-id');
}

function removeUser(element){
    let userId = element.getAttribute('data-id');
    dropWorker(current_task_id, userId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function removeNote(element){
    let noteId = element.getAttribute('data-id');
    dropNote(current_task_id, noteId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function validateUser(element){
    if (element.selectedItem) {
        affectWorkerToTask(current_task_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        li.innerHTML = `
            ${element.selectedValue}
            <i class="fas fa-edit icon" title="Edit" onclick="${element.editAction}(this.parentElement)"></i>
            <i class="fas fa-trash icon" title="Delete" onclick="${element.deleteAction}(this.parentElement)"></i>
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

function openProject(id){
    appDataManager.setvar("form.project.id", id);

    redirect("projectDetails.html", true);
}

function preloadNote(note){
    const li = document.createElement('li');
    li.setAttribute('data-id', note.key);
    li.innerHTML = `
        ${note.value}
        <i class="fas fa-trash icon" title="Delete" onclick="removeNote(this.parentElement)"></i>
    `;
    let list = document.getElementById("notes-list");
    list.appendChild(li);
}

function preloadResource(resource){
    const li = document.createElement('li');
    li.setAttribute('data-id', resource.key);

    li.innerHTML = `
        ${resource.value}
        <i class="fas fa-eye icon" title="Edit" onclick="seeResource(this.parentElement)"></i>
        <i class="fas fa-download icon" title="Download" onclick="download('${resource.value}')"></i>
        <i class="fas fa-trash icon" title="Delete" onclick="removeResource(this.parentElement)"></i>
    `;

    let list = document.getElementById("ressources-list");
    list.appendChild(li);
}

function printTask(){
    setTimeout(function() {
        const options = {
            filename: `task-${current_task_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}

function download(path) {
    downloadRessource(path);
}

function saveNote(){
    let note = document.getElementById("newNote").value;
    document.getElementById("newNote").value = '';
    document.getElementById("noteCreation").style.display = 'none';
    addNoteToTask(current_task_id, note).then((note)=>{
        preloadNote(note);
    });
}

function seeResource(element){
    let resId = element.getAttribute('data-id');

    getRessource(resId).then((resource)=>{
        path = resource.path;
        getRessourceUrl(path).then((url)=>{
            const popup = window.open('', 'popup', 'width=600,height=400,scrollbars=yes');
            if(path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.webp')){
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '100%';
                popup.document.body.appendChild(img);
            } else if (path.endsWith('.pdf')){
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
                    reader.onload = function() {
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

function removeResource(element){
    let resId = element.getAttribute('data-id');
    dropTaskResource(current_task_id, resId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function createNote(){
    document.getElementById("noteCreation").style.display = 'block';
}

function uploadFileAsResource(){
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];

    uploadRessource(file).then((path)=>{
        saveRessource('tr-'+current_task_id, path).then(()=>{
            assignLastResourceToTask(current_task_id).then(()=>{
                alert("Resource successfully added !");
                location.reload();
            })
        })
    })
});