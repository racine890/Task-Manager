async function saveProject(title, description, start_date, end_date, category_id) {

    try {
        let response = await appProjectService.save({
            name: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            category_id: category_id
        });

        if ('msg' in response) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getProject(id) {
    let response = await appProjectService.getByID(id);

    return response;
}

async function getProjects(lastDisplayed, filters = []) {

    let response = await appProjectService.get_paginated(lastDisplayed, filters);

    if (response != null) {
        return response;
    }

}

async function updateProject(id, title, description, start_date, end_date, category_id) {

    try {
        let response = await appProjectService.update(id, {
            name: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            category_id: category_id
        });

        if ('msg' in response) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectWorker(id, wid) {
    try {
        await appProjectService.add_worker(id, wid);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectSubProject(id, pid) {
    try {
        await appProjectService.add_sub_project(id, pid);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropWorker(id, wid) {
    try {
        await appProjectService.delete_workers(id, wid);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropSubProject(id) {
    try {
        await appProjectService.delete_project(id);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropTask(id) {
    try {
        await appProjectService.delete_task(id);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getWorkersByProject(id) {
    try {
        let response = await appProjectService.get_workers(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getProjectsByProject(id) {
    try {
        let response = await appProjectService.get_sub_projects(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getTasksByProject(id) {
    try {
        let response = await appProjectService.get_tasks(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectTask(id, tid) {
    try {
        await appProjectService.add_task(id, tid);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function changeProjectStatus(id, status) {
    try {
        await appProjectService.change_status(id, status);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getResourcesByProject(id) {
    try {
        let response = await appProjectService.get_resources(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropProjectResource(id, rid) {

    try {
        await appProjectService.deleteResource(id, rid);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function assignLastResourceToProject(id) {
    try {
        await appProjectService.assign_last_resource(id);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function exportProject(id, format = 'tmpro') {
    try {
        let response = await appProjectService.export(id, format);

        if (response != null) {
            let notes = [];
            response.forEach(element => {
                let newNote = new search();
                newNote.map(element);
                notes.push(newNote);
            });
            return notes;
        }
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}