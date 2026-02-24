let current_category_id = null;

class categoryFormAction extends Action {

    // The method to run when starting your browser page
    exec() {
        // Mother exec for form validators check
        super.exec();

        current_category_id = this.params.get("no");
        // Patch the form if in edit mode (which means that form.category.id exists)
        if (current_category_id) {
            getCategory(current_category_id).then((category) => {

                // SetAll sets each control of the form object with corresponding value
                this.form.setAll({
                    title: category.name,
                    description: category.description
                });

                // Updates submission button style
                document.getElementById("submission").innerHTML = "Update";
            });
        }
    }

    submit() {
        if (current_category_id) {
            // Form get method allows to get a control value using its id
            const title = this.form.get('title');
            const description = this.form.get('description');

            // this requires the category service and the category manager
            updateCategory(current_category_id, title, description);
        } else {
            const title = this.form.get('title');
            const description = this.form.get('description');

            saveCategory(title, description);
        }
    }

}


document.addEventListener('DOMContentLoaded', () => {
    let cf_action = new categoryFormAction(
        // The form id
        'my-form',
        // The form fields (field id, default value, validator, error message) for each of them
        // No xss won't accept xss strings
        new Form([
            ['title', null, VALIDATORS.NO_XSS, "Title should not contain xss strings."],
            ['description', null, VALIDATORS.NO_XSS, "Description should not contain xss strings."],
        ])
    );

    // Will ensure the validators are matching until the form is submitted
    cf_action.exec();
});
