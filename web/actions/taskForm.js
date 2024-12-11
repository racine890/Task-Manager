let project_id = null;

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
        project_id = appDataManager.getvar("form.project.id");
    }

    if(appDataManager.checkvar("form.task.id")){
        getTask(appDataManager.getvar("form.task.id")).then((task)=>{
            document.getElementById("title").value = task.name;
            document.getElementById("description").value = task.description;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.task.id")){
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;

            updateTask(appDataManager.getvar("form.task.id"), title, description, category_id);
            appDataManager.remvar("form.task.id");
        } else if(appDataManager.checkvar("form.project.id")){
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;

            saveTask(title, description, category_id, null, project_id);
            appDataManager.remvar("form.project.id");
        } else {
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const category_id = document.getElementById('category').value;

            saveTask(title, description, category_id);
        }
    });
});