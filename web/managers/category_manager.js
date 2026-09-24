function normalizeCategory(item) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
        item.allowed_statuses = item.allowed_statuses ? item.allowed_statuses.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
        item.initial_status = item.initial_status != null ? parseInt(item.initial_status) : 0;
        return item;
    }
    const normalized = {
        id: item[0],
        name: item[1],
        description: item[2],
        target: item[3] || "both"
    };
    if (item[4] !== undefined) {
        normalized.active = item[4] == 1;
    }
    if (item[5] !== undefined) {
        normalized.initial_status = parseInt(item[5]);
    }
    if (item[6] !== undefined) {
        normalized.allowed_statuses = item[6] ? item[6].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
    }
    return normalized;
}

async function getCategories(lastDisplayed) {
    let response = await appCategoryService.get_paginated(lastDisplayed);
    if (Array.isArray(response)) {
        return response.map(normalizeCategory);
    }
    return response;
}

async function getAllCategories() {
    try {
        let response = await appCategoryService.get();
        if (Array.isArray(response)) {
            return response.map(normalizeCategory);
        }
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
        if (response && Array.isArray(response)) {
            return normalizeCategory(response[0]);
        }
        if (response && typeof response === 'object') {
            return normalizeCategory(response);
        }
        return response;

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function saveCategory(title, description, target = "both", initial_status = 0, allowed_statuses = '0,1,2,3,4,5,6,7,8') {

    try {
        let response = await appCategoryService.save({
            name: title,
            description: description,
            target: target,
            initial_status: initial_status,
            allowed_statuses: allowed_statuses
        });

        if (response != null) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateCategory(id, title, description, target, initial_status, allowed_statuses) {

    try {
        let response = await appCategoryService.update(id, {
            name: title,
            description: description,
            target: target,
            initial_status: initial_status,
            allowed_statuses: allowed_statuses
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