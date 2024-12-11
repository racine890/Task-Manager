document.addEventListener('DOMContentLoaded', () => {

    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    if(appDataManager.checkvar("form.idea.id")){
        getIdea(appDataManager.getvar("form.idea.id")).then((idea)=>{
            document.getElementById("title").value = idea.name;
            document.getElementById("description").value = idea.description;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    /** Specifies addUser() as the action of userForm, just like php action thing */
    document.getElementById('ideaForm').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.idea.id")){
            updateIdea(appDataManager.getvar("form.idea.id"));
            appDataManager.remvar("form.idea.id");
        } else {
            saveIdea();
        }
    });
});
