let current_ressource_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_ressource_id = params.get('no');

    if (current_ressource_id) {
        getRessource(current_ressource_id).then((ressource) => {
            document.getElementById("title").value = ressource.title;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgPreview = document.getElementById('preview');
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

        if (current_ressource_id) {
            const name = document.getElementById('title').value;

            updateRessource(current_ressource_id, name, lastUploadedFile);
        } else {
            const name = document.getElementById('title').value;

            saveRessource(name, lastUploadedFile);
        }
    });
});