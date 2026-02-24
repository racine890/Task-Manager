async function saveIdea() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        let response = await appIdeaService.save({
            name: title,
            description: description
        });

        if (response != null) {
            alert("Idea has been saved !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getIdea(id) {
    try {
        let response = await appIdeaService.getByID(id);

        return response;

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateIdea(id) {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        let response = await appIdeaService.update(id, {
            name: title,
            description: description
        });

        if (response != null) {
            let newIdea = new idea();
            newIdea.mapLite(response);
            alert("Idea " + newIdea.name + " has been updated !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getIdeas(lastDisplayed) {

    let response = await appIdeaService.get_paginated(lastDisplayed);

    if (response != null) {
        return response;
    }

}

async function removeIdea(id) {

    try {
        await appIdeaService.delete(id);

    } catch (Error) {
        alert("An error occured!");
    }
}