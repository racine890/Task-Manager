// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Nom", "Valeur"]; }

function onLoadData(setting) { return [setting.id, setting.key, setting.value]; }

function onLoadAction(setting) {
    return [
        { name: "Edit", func: "editSetting", arg: setting.id, right: "update_settings" },
    ];
}

function editSetting(id) {
    redirect("settingForm.html", false, [["no", id]]);
}

function printSettings() {
    setTimeout(function () {
        const options = {
            filename: 'settings-list.pdf',
            margin: 1,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        var element = document.getElementById("to-print");
        var worker = html2pdf().set(options).from(element).save();
    }, 2000);
}
