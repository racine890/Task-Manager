async function getTasks(lastDisplayed, filters = []) {

    let response = await appTaskService.get_paginated(lastDisplayed, filters);

    if (response != null) {
        return response;
    }
}

async function removeTask(id) {

    try {
        await appTaskService.delete(id);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function dropTaskResource(id, rid) {

    try {
        await appTaskService.deleteResource(id, rid);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function dropNote(id, nid) {

    try {
        await appTaskService.deleteNote(id, nid);

    } catch (Error) {
        alert("An error occured!");
    }
}

async function saveTask(title, description, category_id, start_date, end_date, mother_idea = null, project_id = null) {

    try {
        let response = await appTaskService.save({
            name: title,
            description: description,
            mother_idea: mother_idea,
            project_id: project_id,
            category_id: category_id,
            start_date: start_date,
            end_date: end_date
        });

        if ('msg' in response) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getTask(id) {
    try {
        let response = await appTaskService.getByID(id);

        return response;

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateTask(id, title, description, category_id, start_date, end_date) {

    try {
        let response = await appTaskService.update(id, {
            name: title,
            description: description,
            category_id: category_id,
            start_date: start_date,
            end_date: end_date
        });

        if ('msg' in response) {
            alert(response.msg);
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getWorkersByTask(id) {
    try {
        let response = await appTaskService.get_workers(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getNotesByTask(id) {
    try {
        let response = await appTaskService.get_notes(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function getResourcesByTask(id) {
    try {
        let response = await appTaskService.get_resources(id);

        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectWorkerToTask(id, tid) {
    try {
        await appTaskService.add_worker(id, tid);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function addNoteToTask(tid, note, ntype = 0) {
    try {
        let response = await appTaskService.add_note(tid, {
            note: note,
            type: ntype
        });
        if (response != null) {
            return response;
        }
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function changeTaskStatus(id, status) {
    try {
        await appTaskService.change_status(id, status);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function changeTaskProgress(id, progress) {
    try {
        await appTaskService.change_progress(id, progress);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function assignLastResourceToTask(id) {
    try {
        await appTaskService.assign_last_resource(id);
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}