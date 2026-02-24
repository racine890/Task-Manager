let lastUploadedFile = null;

class accountAction extends Action {

    init() {
        getMe().then((me) => {
            document.getElementById("username").value = me.username;
            document.getElementById("email").value = me.email;

            getRessourceUrl(me.profile_pic).then((url) => {
                if (me.profile_pic.endsWith('.jpg') || me.profile_pic.endsWith('.jpeg') || me.profile_pic.endsWith('.png') || me.profile_pic.endsWith('.gif') || me.profile_pic.endsWith('.webp')) {
                    const img = document.getElementById('img-preview');
                    img.src = url;
                    img.style.width = '100%';
                    img.style.display = 'block';
                }
            });

            document.getElementById("submission").innerHTML = "Update";
        });

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
    }

    submit() {
        const submitValue = { ...this.form.getAll(), pic: lastUploadedFile };

        updateMe(submitValue.username, submitValue.email, submitValue.pic);
    }

}

class passwdAction extends Action {

    submit() {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword != confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        updatePassword(oldPassword, newPassword);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const account_action = new accountAction(
        'accountForm',
        new Form([
            ['username', null, VALIDATORS.TEXT_ONLY, "Username should only contain text."],
            ['email', null, VALIDATORS.EMAIL, "Email should be valid."],
            ['profile-photo', null, VALIDATORS.PATH, "Profile pic should be valid."],
        ]),
        'submission'
    );

    account_action.exec();

    const pwd_action = new passwdAction(
        'passwdForm',
        new Form([
            ['old-password', null, VALIDATORS.PASSWORD_LOW, "Password should only contain text."],
            ['new-password', null, VALIDATORS.PASSWORD_LOW, "Password should only contain text."],
            ['confirm-password', null, VALIDATORS.PASSWORD_LOW, "Password should only contain text."],
        ]),
        'changePassword'
    );

    pwd_action.exec();
});
