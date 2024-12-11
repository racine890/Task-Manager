class NavBarComponent extends Component{
	
	constructor(){
		super('NavBarComponent');

		let Title = this.getArgValue('Title');
		
		this.html = `
					<nav class="navbar">
						<h1>${Title}</h1>
						<ul class="menu">
							<li><a href="#" onclick="redirect('dashboard-projects.html')">Home</a></li>
							<li>
								<a href="#">Projects</a>
								<ul class="submenu">
									<li><a href="dashboard-ideas.html">Ideas</a></li>
									<li><a href="dashboard-projects.html">Projects</a></li>
									<li><a href="dashboard-tasks.html">Tasks</a></li>
								</ul>
							</li>
							<li>
								<a href="#">Administration</a>
								<ul class="submenu">
									<li><a href="dashboard-users.html">Profiles</a></li>
									<li><a href="dashboard-categories.html">Categories</a></li>
									<li><a href="dashboard-ressources.html">Files</a></li>
									<li><a href="dashboard-settings.html">Settings</a></li>
								</ul>
							</li>
							<li><a href="#" onclick="logout()">Logout</a></li>
						</ul>
						<input type="text" id="search" placeholder="Search an idea...">
					</nav>
						`
	}
}

document.addEventListener('DOMContentLoaded', () => {

    const navbar = new NavBarComponent();
	navbar.render();

	document.getElementById('search').oninput = (e) => {
		const query = e.target.value.toLowerCase();
		const filteredIdeas = allIdeas.filter(idea => 
			idea.name.toLowerCase().includes(query) || 
			idea.description.toLowerCase().includes(query)
		);
		fillArray(filteredIdeas, document.getElementById('my-table'));
	};
});