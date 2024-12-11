let lastDisplayed = 0;
let allUsers = [];
let loadedPages = [];

function fillArray(users, userList){
    userList.innerHTML = '';
    users.forEach(user => {
        const row = `<tr>
            <td>${user.id}</td>
            <td>${user.key}</td>
            <td>${user.value}</td>
            <td>
                <button onclick="editSetting('${user.key}')">Edit</button>
            </td>
        </tr>`;
        lastDisplayed = user.id;
        userList.innerHTML += row;
    });
}

function displaySettings(forward=true) {
    const settingList = document.getElementById('my-table');

    if(forward == true){
        getSettings(lastDisplayed).then((settings)=>{
            if(settings.length > 0){
                allUsers = settings;
                fillArray(settings, settingList);
            } else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allUsers = loadedPages.pop();
        fillArray(allUsers, settingList);
    } else {
        alert("No more data before!");
    }

}

function editSetting(key) {
    appDataManager.setvar("form.setting.key", key);
    redirect("settingForm.html");
}

function deleteSetting(id) {
    const confirme = confirm("Do you want to remove that Setting ?");
	if (confirme) {
		deleteSetting(id).then(()=>{
            lastDisplayed = 0;
			displaySettings()
        });
	}
}

function printSettings(){
    setTimeout(function() {
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

document.getElementById('next').onclick = () => {
    loadedPages.push(allUsers);
    displaySettings();
};

document.getElementById('prev').onclick = () => {
    displaySettings(false);
};

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    appDataManager.remvar("form.setting.key");
    displaySettings();
});
