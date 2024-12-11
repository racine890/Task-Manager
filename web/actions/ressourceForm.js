let ressource_id = null;
let lastUploadedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    if(appDataManager.checkvar("form.ressource.id")){
        getRessource(appDataManager.getvar("form.ressource.id")).then((ressource)=>{
            document.getElementById("title").value = ressource.title;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('file').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgPreview = document.getElementById('preview');
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        uploadRessource(file).then((path)=>{
            lastUploadedFile = path;
            console.log(path);
        })
    });

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.ressource.id")){
            const name = document.getElementById('title').value;

            updateRessource(appDataManager.getvar("form.ressource.id"), name, lastUploadedFile);
            appDataManager.remvar("form.ressource.id");
        } else {
            const name = document.getElementById('title').value;

            saveRessource(name, lastUploadedFile);
        }
    });
});