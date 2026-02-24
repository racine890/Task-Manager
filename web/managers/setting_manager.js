async function getSettings(lastDisplayed) {
    let response = await appSettingService.get_paginated(lastDisplayed);

    return response;
}

async function getSetting(id) {
    try {
        let response = await appSettingService.getByID(id);
        return response;
    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateSetting(key, value) {

    try {
        let response = await appSettingService.update({
            key: key,
            value: value
        });

        if (response != null) {
            let newTask = new setting();
            newTask.mapLite(response);
            alert("Setting " + newTask.key + " has been updated !");
        }

    } catch (Error) {
        console.log(Error);
        alert("An error occured!");
    }
}