let lastDisplayed = 0;
let allIdeas = [];
let loadedPages = [];

function fillArray(ideas, ideaList){
    ideaList.innerHTML = '';
    ideas.forEach(idea => {

        const row = `<tr>
            <td>${idea.id}</td>
            <td>${idea.name}</td>
            <td>${idea.description}</td>
            <td>
                <button onclick="editIdea(${idea.id})">Edit</button>
                <button onclick="deleteIdea(${idea.id})">Delete</button>
                <button onclick="validate(${idea.id})">Create Project</button>
            </td>
        </tr>`;
        lastDisplayed = idea.id;
        ideaList.innerHTML += row;
    });
}

function displayIdeas(forward=true) {
    const ideaList = document.getElementById('my-table');

    if(forward == true){
        getIdeas(lastDisplayed).then((ideas)=>{
            if(ideas.length > 0){
                allIdeas = ideas;
                fillArray(ideas, ideaList);
            }  else if(loadedPages.length != 0) {
                loadedPages.pop();
                alert("No more data behind!");
            }
        });
    } else if(loadedPages.length > 0) {
        allIdeas = loadedPages.pop();
        fillArray(allIdeas, ideaList);
    } else {
        alert("No more data before!");
    }

}

function editIdea(id) {
    appDataManager.setvar("form.idea.id", id);
    redirect("ideaForm.html");
}

function deleteIdea(id) {
    const confirme = confirm("Do you want to remove that Idea ?");
	if (confirme) {
        removeIdea(id).then(() => {
            displayIdeas();
        });
	}
}

function validate(id) {
    const confirme = confirm("Do you want to create a project from this idea ?");
	if (confirme) {
        appDataManager.setvar("form.idea.id", id);
        redirect("projectForm.html");
	}
}

function printIdeas(){
    setTimeout(function() {
        const options = {
            filename: 'ideas-list.pdf',
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
    loadedPages.push(allIdeas);
    displayIdeas();
};

document.getElementById('prev').onclick = () => {
    displayIdeas(false);
};

document.addEventListener('DOMContentLoaded', () => {
    try{
        check_auth();
    } catch {
        redirect("auth.html");
    }
    displayIdeas();
});
