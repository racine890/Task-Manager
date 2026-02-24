current_user_id = null;

document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    current_user_id = params.get('no');

    if (current_user_id) {
        getUserRights(current_user_id).then((rights) => {

            rights.forEach(right => {
                preloadRight(right);
            });
        });
    }
});

function preloadRight(right) {
    const li = document.createElement('li');
    li.setAttribute('data-id', right.id);

    li.innerHTML = `
        ${right.name}
        <i class="fas fa-trash icon" title="Delete" onclick="removeRight(this.parentElement)"></i>
    `;

    let list = document.getElementById("permissions-list");
    list.appendChild(li);
}


function removeRight(element) {
    let rightId = element.getAttribute('data-id');
    dropUserRight(current_user_id, rightId);
    const ul = element.parentElement;
    ul.removeChild(element);
}

function validateRight(element) {
    if (element.selectedItem) {
        addUserRight(current_user_id, element.selectedItem);

        const li = document.createElement('li');
        li.setAttribute('data-id', element.selectedItem);
        li.innerHTML = `
            ${element.selectedValue}
            <i class="fas fa-trash icon" title="Delete" onclick="removeRight(this.parentElement)"></i>
        `;

        let rightList = document.getElementById("permissions-list");
        rightList.appendChild(li);

        element.popup.style.display = 'none';
        element.searchInput.value = '';
        element.resultList.innerHTML = '';
        element.selectedItem = null;
    } else {
        alert("Veuillez sélectionner un élément.");
    }
}