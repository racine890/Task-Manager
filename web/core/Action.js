class Action{
	constructor(formId = "", form=null){
		this.formId = formId;
		this.form = form;
	}

	exec(){
		if(this.form != null){
			this.form.preload();

			document.getElementById(this.formId).addEventListener('submit', (event) => {
				event.preventDefault();

				if(this.form.isValid()){
					this.submit();
				} else {
					alert(this.form.errormsg);
				}
			});
		}
	}

	submit(){
	}
}