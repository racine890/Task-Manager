let lastDisplayed = 0;
let allUsers = [];
let loadedPages = [];

function fillArray(users, userList){
    userList.innerHTML = '';
    users.forEach(user => {
        eod = "disableUser";
        eodt = "Disable";
        if(!user.active) {
            eod = "enableUser";
            eodt = "Enable";
        }

        const row = `<tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="${eod}(${user.id})">${eodt}</button>
            </td>
        </tr>`;
        lastDisplayed = user.id;
        userList.innerHTML += row;
    });
}

function displayUsers(forward=true) {
    const userList = document.getElementById('my-table');

    if(forward == true){
        getUsers(lastDisplayed).then((users)=>{
            if(users.length > 0){
                allUsers = users;
                fillArray(users, userList);
            } else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allUsers = loadedPages.pop();
        fillArray(allUsers, userList);
    } else {
        alert("No more data before!");
    }

}

function editUser(id) {
    appDataManager.setvar("form.user.id", id);
    redirect("userForm.html");
}

function disableUser(id) {
    const confirme = confirm("Do you want to remove that User ?");
	if (confirme) {
		disableUserAccount(id).then(()=>{
            lastDisplayed = 0;
			displayUsers()
        });
	}
}

function enableUser(id) {
    const confirme = confirm("Do you want to enable that account ?");
	if (confirme) {
        enableUserAccount(id).then(()=>{
            lastDisplayed = 0;
			displayUsers()
        });
	}
}

function printUsers(){
    setTimeout(function() {
        const options = {
            filename: 'users-list.pdf',
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
    displayUsers();
};

document.getElementById('prev').onclick = () => {
    displayUsers(false);
};

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    appDataManager.remvar("form.user.id");
    displayUsers();
});
