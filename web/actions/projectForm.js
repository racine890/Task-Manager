document.addEventListener('DOMContentLoaded', () => {

    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    getAllCategories().then((categories)=>{
        let select = document.getElementById("category");
        categories.forEach((category)=>{
            let option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        })
    })

    if(appDataManager.checkvar("form.project.id")){
        getProject(appDataManager.getvar("form.project.id")).then((project)=>{
            document.getElementById("title").value = project.name;
            document.getElementById("description").value = project.description;
            document.getElementById("start-date").value = project.start_date.toISOString().slice(0, 19);
            document.getElementById("end-date").value = project.end_date.toISOString().slice(0, 19);
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    if(appDataManager.checkvar("form.idea.id")){
        getIdea(appDataManager.getvar("form.idea.id")).then((idea)=>{
            document.getElementById("title").value = idea.name;
            document.getElementById("description").value = idea.description;
        });
    }

    /** Specifies addUser() as the action of userForm, just like php action thing */
    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.project.id")){
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            updateProject(appDataManager.getvar("form.project.id"), title, description, start_date, end_date, category_id);
            appDataManager.remvar("form.project.id");
        }  else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const start_date = document.getElementById('start-date').value;
            const end_date = document.getElementById('end-date').value;
            const category_id = document.getElementById('category').value;

            saveProject(title, description, start_date, end_date, category_id);
            if(appDataManager.checkvar("form.idea.id")) appDataManager.remvar("form.idea.id");
        }
    });
});
