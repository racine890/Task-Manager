async function saveProject(title, description, start_date, end_date, category_id) {
    
    try{
        let response = await appProjectService.save({
            name: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            category_id: category_id
        });

        if(response != null){
            let newProject = new project();
            newProject.mapLite(response);
			alert("Project "+newProject.name+" has been saved !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getProject(id){
    try{
        let response = await appProjectService.getByID(id);

        if(response != null){
            let nproject = new project();
            nproject.map(response);
            return nproject;
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateProject(id, title, description, start_date, end_date, category_id){
    
    try{
        let response = await appProjectService.update(id, {
            name: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            category_id: category_id
        });

        if(response != null){
            let newProject = new project();
            newProject.mapLite(response);
			alert("Project "+newProject.name+" has been updated !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectWorker(id, wid){
    try{
        await appProjectService.add_worker(id, wid);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectSubProject(id, pid){
    try{
        await appProjectService.add_sub_project(id, pid);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropWorker(id, wid){
    try{
        await appProjectService.delete_workers(id, wid);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropSubProject(id){
    try{
        await appProjectService.delete_project(id);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropTask(id){
    try{
        await appProjectService.delete_task(id);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getWorkersByProject(id){
    try{
        let response = await appProjectService.get_workers(id);

        if(response != null){
            let workers = [];
            response.forEach(element => {
                let newUser = new search();
                newUser.map(element);
                workers.push(newUser);
            });
            return workers;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getProjectsByProject(id){
    try{
        let response = await appProjectService.get_sub_projects(id);

        if(response != null){
            let projects = [];
            response.forEach(element => {
                let newUser = new search();
                newUser.map(element);
                projects.push(newUser);
            });
            return projects;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getTasksByProject(id){
    try{
        let response = await appProjectService.get_tasks(id);

        if(response != null){
            let tasks = [];
            response.forEach(element => {
                let newTask = new search();
                newTask.map(element);
                tasks.push(newTask);
            });
            return tasks;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function affectTask(id, tid){
    try{
        await appProjectService.add_task(id, tid);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function changeProjectStatus(id, status){
    try{
        await appProjectService.change_status(id, status);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getResourcesByProject(id){
    try{
        let response = await appProjectService.get_resources(id);
        
        if(response != null){
            let notes = [];
            response.forEach(element => {
                let newNote = new search();
                newNote.map(element);
                notes.push(newNote);
            });
            return notes;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function dropProjectResource(id, rid){
    
    try{
        await appProjectService.deleteResource(id, rid);

    } catch(Error){
        alert("An error occured!");
    }
}

async function assignLastResourceToProject(id){
    try{
        await appProjectService.assign_last_resource(id);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function exportProject(id, format='tmpro'){
    try{
        let response = await appProjectService.export(id, format);
        
        if(response != null){
            let notes = [];
            response.forEach(element => {
                let newNote = new search();
                newNote.map(element);
                notes.push(newNote);
            });
            return notes;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}