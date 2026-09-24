class NavBarComponent extends Component {

	constructor() {
		super('NavBarComponent');

		let Title = this.getArgValue('Title');

		this.rights = appDataManager.getvar('rights');
		let rnames = [];
		if (hasRight('admin')) {
			rnames.push('read_idea');
			rnames.push('read_project');
			rnames.push('read_task');
			rnames.push('read_user');
			rnames.push('read_category');
			rnames.push('read_resource');
			rnames.push('read_settings');
		}

		this.rights.forEach(element => {
			rnames.push(element.name);
		});

	let projectMenus = `<li>
							<a href="#">Projects</a>
							<ul class="submenu">`;
	if (rnames.includes('read_project'))
		projectMenus += `<li id='projects'><a href="dashboard-projects.html">Projects</a></li>`;
	if (rnames.includes('read_task'))
		projectMenus += `<li id='tasks'><a href="dashboard-tasks.html">Tasks</a></li>`;
	projectMenus += `</ul>
					</li>`;

		let administrationMenus = `<li>
								<a href="#">Administration</a>
								<ul class="submenu">`;
		if (rnames.includes('read_user'))
			administrationMenus += `<li id='users'><a href="dashboard-users.html">Profiles</a></li>`;
		if (rnames.includes('read_category'))
			administrationMenus += `<li id='categories'><a href="dashboard-categories.html">Categories</a></li>`;
		if (rnames.includes('read_resource'))
			administrationMenus += `<li id='ressources'><a href="dashboard-ressources.html">Files</a></li>`;
		if (rnames.includes('read_settings'))
			administrationMenus += `<li id='settings'><a href="dashboard-settings.html">Settings</a></li>`;
		administrationMenus += `</ul>
							</li>`;

		let pinnedTasks = [];
		try {
			pinnedTasks = JSON.parse(localStorage.getItem('pinnedTasks')) || [];
		} catch(e) {
			pinnedTasks = [];
		}

		let pinnedMenu = '';
		if (pinnedTasks.length > 0) {
			pinnedMenu += `<li>
								<a href="#">Pinned</a>
								<ul class="submenu">`;
			pinnedTasks.forEach(task => {
				pinnedMenu += `<li><a href="taskDetails.html?no=${task.id}">${task.name}</a></li>`;
			});
			pinnedMenu += `</ul>
							</li>`;
		}

		this.html = `
					<nav class="navbar">
						<h1>${Title}</h1>
						<ul class="menu">
							<li><a href="#" onclick="redirect('dashboard-projects.html')">Home</a></li>
							${pinnedMenu}
							${rnames.includes('read_idea') || rnames.includes('read_project') || rnames.includes('read_task') ? projectMenus : ''}
							${rnames.includes('read_user') || rnames.includes('read_category') || rnames.includes('read_ressource') || rnames.includes('read_setting') ? administrationMenus : ''}
							${rnames.includes('read_project') || rnames.includes('read_task') || rnames.includes('read_idea') ? `<li><a href="search.html"><i class="fas fa-search"></i> Search</a></li>` : ''}
							<li>
								<a href="#">Account</a>
								<ul class="submenu">
									<li><a href="account.html">My Account</a></li>
									<li><a href="#" onclick="logout()">Logout</a></li>
								</ul>
							</li>
						</ul>
                        <!--div class="search-container">
						    <input type="text" id="search" placeholder="Search...">
                        </div-->
					</nav>
					`;

	}
}

document.addEventListener('DOMContentLoaded', () => {

	const navbar = new NavBarComponent();
	navbar.render();
});
