async function logout() {
	response = await appUserService.logout();
	redirect('auth.html');
}

async function check_auth() {
    try{
        response = await appUserService.check_auth();
        return response;
    } catch(Error){
		console.error(Error);
        return null;
    }
}

async function authenticate(username, password) {

    /** The required payload is a user object, so construct one of them */
    const newUser = new user();
    newUser.username = username;
    newUser.password = password;
    
    try{
        // And let the service save the constructed user.
        // It's asynchronous, so you have to await it.
        let response = await appUserService.auth({
            username: username,
            password: password
        });

        if(response != null){
            let newUser = new user();
            newUser.map(response);
            return newUser;
        }

    } catch(Error){
        console.log(Error);
        return null;
    }
}

async function getUsers(lastDisplayed){
    
    try{
        let response = await appUserService.get_paginated(lastDisplayed);

        if(response != null){
            let gotTasks = [];
			response.forEach((gotTask)=>{
				let tmpTask = new user();
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

async function getUser(id){
    try{
        let response = await appUserService.getByID(id);
        if(response != null){
            let nproject = new user();
            nproject.map(response);
            return nproject;
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function saveUser(username, email, password, pic) {

    try{
        let response = await appUserService.save({
            username: username,
            email: email,
            password: password,
            pic: pic
        });
        if(response != null){
            let newuser = new user();
            newuser.mapLite(response);
			alert("User "+newuser.username+" has been saved !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateUser(id, username, email, pic){
    
    try{
        let response = await appUserService.update(id, {
            username: username,
            email: email,
            pic: pic
        });

        if(response != null){
            let newTask = new user();
            newTask.mapLite(response);
			alert("User "+newTask.username+" has been updated !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function disableUserAccount(id){
    
    try{
        await appUserService.delete(id);

    } catch(Error){
        alert("An error occured!");
    }
}

async function enableUserAccount(id){
    
    try{
        await appUserService.enable(id);

    } catch(Error){
        alert("An error occured!");
    }
}