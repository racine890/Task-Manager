class LoaderComponent extends Component {

	constructor() {
		super('LoaderComponent');

		this.html = `
					    <div class="loader" id="loader">
							<div class="loader-spinner"></div>
						</div>
					`;

	}
	
	render(show = false){
		super.render();

		const loader = this.getChild("loader");
		loader.classList.toggle("show", show);
	}
}

let globalLoaderComponent = null;
document.addEventListener('DOMContentLoaded', () => {

	const loader = new LoaderComponent();
	loader.render();
	globalLoaderComponent = loader;

});
