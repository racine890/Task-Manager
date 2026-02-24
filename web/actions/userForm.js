let lastUploadedFile = null;
let user_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    user_id = params.get('no');

    if (user_id) {
        getUser(user_id).then((user) => {
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("password").removeAttribute('required');
            document.getElementById("passwordGroup").remove();
            document.getElementById("roleGroup").remove();
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('profile-photo').addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgPreview = document.getElementById('img-preview');
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        uploadRessource(file).then((path) => {
            lastUploadedFile = path;
        })

    });

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (user_id) {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;

            updateUser(user_id, username, email, lastUploadedFile);
        } else {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            saveUser(username, email, password, role, lastUploadedFile);
        }
    });
});