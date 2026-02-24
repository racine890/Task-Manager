async function getCategories(lastDisplayed) {
    let response = await appCategoryService.get_paginated(lastDisplayed);

    return response;
}

async function getAllCategories() {
    try {
        let response = await appCategoryService.get();
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function removeCategory(id) {

    try {
        await appCategoryService.delete(id);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function getCategory(id) {
    try {
        let response = await appCategoryService.getByID(id);

        return response;

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function saveCategory(title, description) {

    try {
        let response = await appCategoryService.save({
            name: title,
            description: description
        });

        if (response != null) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateCategory(id, title, description) {

    try {
        let response = await appCategoryService.update(id, {
            name: title,
            description: description
        });

        if (response != null) {
            let newIdea = new category();
            newIdea.mapLite(response);
            alert("Category " + newIdea.name + " has been updated !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}