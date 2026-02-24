class DetailsComponent extends Component {

	constructor(id = null, args = {}) {
		super('DetailsComponent', id, args);

		this.title = this.getArgValue('title');
		this.id = this.getArgValue('id');

		this.html = `
		<details>
			<summary>${this.title}</summary>
			<p>
				@CONTENT
			</p>
		</details>
		`;
	}

	render() {
		super.render();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const containers = document.querySelectorAll('DetailsComponent');

	containers.forEach(container => {
		const details = new DetailsComponent(container.id);
		details.render();
	});

});