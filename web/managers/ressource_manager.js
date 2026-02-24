async function getRessources(lastDisplayed) {

    let response = await appRessourceService.get_paginated(lastDisplayed);

    return response;
}

async function removeRessource(id) {

    try {
        await appRessourceService.delete(id);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function getRessource(id) {
    try {
        let response = await appRessourceService.getByID(id);

        return response;

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function saveRessource(name, path) {

    try {
        let response = await appRessourceService.save({
            name: name,
            path: path
        });

        if (response != null) {
            alert("Ressource has been saved !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateRessource(id, name, path) {

    try {
        let response = await appRessourceService.update(id, {
            name: name,
            path: path
        });

        if (response != null) {
            let newIdea = new ressource();
            newIdea.mapLite(response);
            alert("Category " + newIdea.title + " has been updated !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function uploadRessource(file) {
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:6102/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const text = await response.json();
                return text.file;
            }
        } catch (Error) {
            console.log(Error);
            alert("An error occured!");
        }
    }
}

async function downloadRessource(filename) {
    if (filename) {
        try {
            const response = await fetch(`http://localhost:6102/download/${filename}`, {
                method: 'GET'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert("An error occured!");
        }
    }
}

async function getRessourceUrl(filename) {
    if (filename) {
        try {
            const response = await fetch(`http://localhost:6102/download/${filename}`, {
                method: 'GET'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                return url;
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert("An error occured!");
        }
    }
}