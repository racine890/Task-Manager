class Action {
	constructor(formId = "", form = null, submitName = "submit") {
		this.formId = formId;
		this.form = form;
		this.params = new URLSearchParams(window.location.search);
		this.submitName = submitName;
	}

	init() {
	}

	exec() {
		if (this.form != null) {

			this.init();

			this.form.preload();

			document.getElementById(this.formId).addEventListener('submit', (event) => {
				event.preventDefault();

				if (this.form.isValid()) {
					this.submit();
				} else {
					alert(this.form.errormsg);
				}
			});
		}
	}

	submit() {
	}
}