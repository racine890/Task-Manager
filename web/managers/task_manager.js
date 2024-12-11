async function getTasks(lastDisplayed){
    
    try{
        let response = await appTaskService.get_paginated(lastDisplayed);

        if(response != null){
            let gotTasks = [];
			response.forEach((gotTask)=>{
				let tmpTask = new task();
				tmpTask.map(gotTask);
				gotTasks.push(
					tmpTask
				)
			})

			return gotTasks;
        }

    } catch(Error){
        alert("An error occured!");
    }
}

async function removeTask(id){
    
    try{
        await appTaskService.delete(id);

    } catch(Error){
        alert("An error occured!");
    }
}

async function dropTaskResource(id, rid){
    
    try{
        await appTaskService.deleteResource(id, rid);

    } catch(Error){
        alert("An error occured!");
    }
}

async function dropNote(id, nid){
    
    try{
        await appTaskService.deleteNote(id, nid);

    } catch(Error){
        alert("An error occured!");
    }
}

async function saveTask(title, description, category_id, mother_idea = null, project_id = null) {

    try{
        let response = await appTaskService.save({
            name: title,
            description: description,
            mother_idea: mother_idea,
            project_id: project_id,
            category_id: category_id
        });

        if(response != null){
            let newTask = new task();
            newTask.mapLite(response);
			alert("Task "+newTask.name+" has been saved !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getTask(id){
    try{
        let response = await appTaskService.getByID(id);

        if(response != null){
            let nproject = new task();
            nproject.map(response);
            return nproject;
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateTask(id, title, description, category_id){
    
    try{
        let response = await appTaskService.update(id, {
            name: title,
            description: description,
            category_id: category_id
        });

        if(response != null){
            let newTask = new task();
            newTask.mapLite(response);
			alert("Project "+newTask.name+" has been updated !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function getWorkersByTask(id){
    try{
        let response = await appTaskService.get_workers(id);

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

async function getNotesByTask(id){
    try{
        let response = await appTaskService.get_notes(id);
        
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

async function getResourcesByTask(id){
    try{
        let response = await appTaskService.get_resources(id);
        
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

async function affectWorkerToTask(id, tid){
    try{
        await appTaskService.add_worker(id, tid);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function addNoteToTask(tid, note) {
    try{
        let response = await appTaskService.add_note(tid, {
            note: note
        });
        if(response != null){
            let tmpTask = new search();
            tmpTask.map(response);
            return tmpTask;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function changeTaskStatus(id, status){
    try{
        await appTaskService.change_status(id, status);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function assignLastResourceToTask(id){
    try{
        await appTaskService.assign_last_resource(id);
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}