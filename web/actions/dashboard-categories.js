// Updated. Those are just the actions for the table component
function onLoadColumns() { return ["Id", "Label", "Description"]; }

function onLoadData(category) { return [category.id, category.name, category.description]; }

function onLoadAction(category) {
    return [
        { name: "Edit", func: "editCategory", arg: category.id, right: "update_category" },
        { name: "Delete", func: "deleteCategory", arg: category.id, color: "danger", right: "delete_category" }
    ];
}

function editCategory(id) {
    redirect("categoryForm.html", false, [["no", id]]);
}

function deleteCategory(id) {
    const confirme = confirm("Do you want to remove that Category ?");
    if (confirme) {
        removeCategory(id).then(() => {
            alert("Category removed !");
            location.reload();
        });
    }
}