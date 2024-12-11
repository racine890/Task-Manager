let project_id = null;
let lastUploadedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    if(appDataManager.checkvar("form.setting.key")){
        getSetting(appDataManager.getvar("form.setting.key")).then((setting)=>{
            document.getElementById("key").value = setting.key;
            document.getElementById("value").value = setting.value;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.setting.key")){
            const key = document.getElementById('key').value;
            const value = document.getElementById('value').value;

            updateSetting(key, value);
            appDataManager.remvar("form.setting.key");
        }
    });
});