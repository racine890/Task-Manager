async function logout() {
    response = await appUserService.logout();
    appDataManager.setvar("token", null);
    redirect('auth.html');
}

async function authenticate(username, password) {

    /** The required payload is a user object, so construct one of them */
    const newUser = new user();
    newUser.username = username;
    newUser.password = password;

    try {
        // And let the service save the constructed user.
        // It's asynchronous, so you have to await it.
        let response = await appUserService.auth({
            username: username,
            password: password
        });

        if (response != null) {
            appDataManager.setvar("token", response.token);
            appDataManager.setvar("rights", response.rights);
            return response;
        } else {
            console.warn("Token not found in auth response");
            return null;
        }

    } catch (error) {
        alert(error);
    }
}

async function getUsers(lastDisplayed) {
    try {
        let response = await appUserService.get_paginated(lastDisplayed);
        return response;
    } catch (error) {
        alert(error);
    }
}

async function getUserAssignations(id) {
    try {
        let response = await appUserService.getAssignations(id);
        return response;
    } catch (error) {
        alert(error);
    }
}

async function getUser(id) {
    try {
        let response = await appUserService.getByID(id);
        return response;

    } catch (error) {
        alert(error);
    }
}

async function getUserRights(id) {
    try {
        let response = await appUserService.getRightsByID(id);
        return response;

    } catch (error) {
        alert(error);
    }
}

async function saveUser(username, email, password, role, pic) {

    try {
        let response = await appUserService.save({
            username: username,
            email: email,
            password: password,
            pic: pic,
            role: role
        });
        if (response != null) {
            alert("User has been saved !");
        }

    } catch (error) {
        alert(error);
    }
}

async function updateUser(id, username, email, pic) {
    try {
        let response = await appUserService.update(id, {
            username: username,
            email: email,
            pic: pic
        });

        if (response != null) {
            alert("User has been updated !");
        }

    } catch (error) {
        alert(error);
    }
}

async function disableUserAccount(id) {

    try {
        await appUserService.delete(id);

    } catch (error) {
        alert(error);
    }
}

async function enableUserAccount(id) {

    try {
        const response = await appUserService.enable(id);
        if ('msg' in response) {
            alert(response.msg);
        }
    } catch (error) {
        alert(error);
    }
}

async function dropUserRight(id, rightId) {
    try {
        let response = await appUserService.dropRight(id, rightId);
        if ('msg' in response) {
            alert(response.msg);
        }
    } catch (error) {
        alert(error);
    }
}

async function addUserRight(id, rightId) {
    try {
        let response = await appUserService.addRight(id, rightId);
        if ('msg' in response) {
            alert(response.msg);
        }
    } catch (error) {
        alert(error);
    }
}

async function getMe() {
    try {
        let response = await appUserService.getMe();
        if ('msg' in response) {
            alert(response.msg);
        }
        return response;
    } catch (error) {
        alert(error);
    }
}

async function updateMe(username, email, pic) {
    try {
        const response = await appUserService.updateMe({
            username: username,
            email: email,
            pic: pic
        });
        if ('msg' in response) {
            alert(response.msg);
        }
    } catch (error) {
        alert(error);
    }
}

async function updatePassword(oldPassword, newPassword) {
    try {
        const response = await appUserService.updatePassword({
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        if ('msg' in response) {
            alert(response.msg);
        }
    } catch (errorResponse) {
        alert(errorResponse);
    }
}
