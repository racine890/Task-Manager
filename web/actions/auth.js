/**
 * Auth action : Check if the username and the password are correct
 */
class authAction extends Action{
	// The submit action 

	submit(){
		// Get user input first
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		// Try authentication.
		authenticate(username, password).then((user)=>{
			if(user != null){
				// If a user is found, greet him and pass
				alert("Welcome, "+user.username+"!");
				redirect("dashboard-projects.html");
			}
			else{
				// Just notify
				alert("Incorrect credentials!");
			}
		});
	}

}

document.addEventListener('DOMContentLoaded', () => {
	let auth_action = new authAction(
		// The form id
		'authForm', 
		// The form fields (field id, default value, validator, error message) for each of them
		// Text only won't accept numbers or special chars
		// Password strong will only accept passwords with 12 mixed chars or more
		new Form([
			['username', null, VALIDATORS.TEXT_ONLY, "Username should only contain text."],
			['password', null, VALIDATORS.PASSWORD_STRONG, "Password should have a mixed 12 chars."],
		])
	);

	// Will ensure the validators are matching until the form is submitted
	auth_action.exec();
});