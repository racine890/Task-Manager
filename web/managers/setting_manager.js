async function getSettings(lastDisplayed){
    
    try{
        let response = await appSettingService.get_paginated(lastDisplayed);

        if(response != null){
            let gotTasks = [];
			response.forEach((gotTask)=>{
				let tmpTask = new setting();
				tmpTask.map(gotTask);
				gotTasks.push(
					tmpTask
				)
			})

			return gotTasks;
        }

    } catch(Error){
        console.error(Error);
    }
}

async function getSetting(key){
    try{
        let response = await appSettingService.getByID(key);
        if(response != null){
            let nproject = new setting();
            nproject.map(response);
            return nproject;
        }
    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateSetting(key, value){
    
    try{
        let response = await appSettingService.update({
            key: key,
            value: value
        });

        if(response != null){
            let newTask = new setting();
            newTask.mapLite(response);
			alert("Setting "+newTask.key+" has been updated !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}