let current_setting_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_setting_id = params.get('no');

    if (current_setting_id) {
        getSetting(current_setting_id).then((setting) => {
            document.getElementById("key").value = setting.key;
            document.getElementById("value").value = setting.value;
            document.getElementById("submission").innerHTML = "Update";
        });
    }

    document.getElementById('my-form').addEventListener('submit', (event) => {
        event.preventDefault();

        if (current_setting_id) {
            const key = document.getElementById('key').value;
            const value = document.getElementById('value').value;

            updateSetting(key, value);
        }
    });
});
