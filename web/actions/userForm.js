let project_id = null;
let lastUploadedFile = null;

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }

    if(appDataManager.checkvar("form.user.id")){
        getUser(appDataManager.getvar("form.user.id")).then((user)=>{
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("password").removeAttribute('required');
            document.getElementById("password").remove();
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('profile-photo').addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgPreview = document.getElementById('img-preview');
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        uploadRessource(file).then((path)=>{
            lastUploadedFile = path;
        })
        
    });

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if(appDataManager.checkvar("form.user.id")){
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;

            updateUser(appDataManager.getvar("form.user.id"), username, email, lastUploadedFile);
            appDataManager.remvar("form.user.id");
        } else {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            saveUser(username, email, password, lastUploadedFile);
        }
    });
});