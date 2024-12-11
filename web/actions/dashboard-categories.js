class dashboardCategoriesAction extends Action{

    // The method to run when starting your browser page
    exec(){

        // First, check if the user is correctly authentified.
        check_auth().then((user)=>{
            // If not, leave the app
            if(user == null) redirect("auth.html");

            // Mother exec for form validators check
            super.exec();

            appDataManager.remvar("form.category.id")
        })
    }

    submit(){
        if(appDataManager.checkvar("form.category.id")){
            // Form get method allows to get a control value using its id
            const title = this.form.get('title');
            const description = this.form.get('description');

            // this requires the category service and the category manager
            updateCategory(appDataManager.getvar("form.category.id"), title, description);
            appDataManager.remvar("form.category.id");
        } else {
            const title = this.form.get('title');
            const description = this.form.get('description');

            saveCategory(title, description);
        }
    }

}

function onLoadColumns(){ return ["Id", "Label", "Description"]; }
    
function onLoadData(category){ return [category.id, category.name, category.description]; }

function onLoadAction(category){
    return [
        {name: "Edit", func: "editCategory", arg: category.id},
        {name: "Delete", func: "removeCategory", arg: category.id}
    ];
}

function editCategory(id) {
    appDataManager.setvar("form.category.id", id);
    redirect("categoryForm.html");
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

document.addEventListener('DOMContentLoaded', () => {
	let dc_action = new dashboardCategoriesAction();
	dc_action.exec();
});