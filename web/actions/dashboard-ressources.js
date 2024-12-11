let lastDisplayed = 0;
let allRessources = [];
let loadedPages = [];

function fillArray(elements, list){
    list.innerHTML = '';
    elements.forEach(element => {

        const row = `<tr>
            <td>${element.id}</td>
            <td>${element.title}</td>
            <td>${element.path}</td>
            <td>
                <button onclick="viewRessource('${element.path}')">See</button>
                <button onclick="editRessource(${element.id})">Edit</button>
                <button onclick="deleteRessource(${element.id})">Delete</button>
                <button onclick="download('${element.path}')">Download</button>
            </td>
        </tr>`;
        lastDisplayed = element.id;
        list.innerHTML += row;
    });
}

function displayRessources(forward=true) {
    const list = document.getElementById('my-table');

    if(forward == true){
        getRessources(lastDisplayed).then((elements)=>{
            if(elements.length > 0){
                allRessources = elements;
                fillArray(elements, list);
            } else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allRessources = loadedPages.pop();
        fillArray(allRessources, list);
    } else {
        alert("No more data before!");
    }

}

function editRessource(id) {
    appDataManager.setvar("form.ressource.id", id);
    redirect("ressourceForm.html");
}

function viewRessource(path) {
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
    })
}

function download(path) {
    downloadRessource(path);
}

function deleteRessource(id) {
	lastDisplayed = 0;
    const confirme = confirm("Do you want to remove that Ressource ?");
	if (confirme) {
        removeRessource(id).then(() => {
            displayRessources();
        });
	}
}

document.getElementById('next').onclick = () => {
    loadedPages.push(allRessources);
    displayRessources();
};

document.getElementById('prev').onclick = () => {
    displayRessources(false);
};

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    
    appDataManager.remvar("form.ressource.id");
    displayRessources();
});