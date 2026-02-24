// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Title", "Path"]; }

function onLoadData(ressource) { return [ressource.id, ressource.title, ressource.path]; }

function onLoadAction(ressource) {
    return [
        { name: "View", func: "viewRessource", arg: ressource.path, right: "read_resource" },
        { name: "Edit", func: "editRessource", arg: ressource.id, right: "update_resource" },
        { name: "Delete", func: "deleteRessource", arg: ressource.id, color: "danger", right: "delete_resource" },
        { name: "Download", func: "download", arg: ressource.path, color: "success", right: "read_resource" }
    ];
}

function editRessource(id) {
    redirect("ressourceForm.html", false, [["no", id]]);
}

function deleteRessource(id) {
    const confirme = confirm("Do you want to remove that Ressource ?");
    if (confirme) {
        removeRessource(id).then(() => {
            alert("Ressource removed !");
            location.reload();
        });
    }
}

function viewRessource(path) {

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
}

function download(path) {
    downloadRessource(path);
}
