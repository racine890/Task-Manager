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
		if (show)
			appLoader.show();
		else
			appLoader.hide();
	}
}

let globalLoaderComponent = null;
document.addEventListener('DOMContentLoaded', () => {

	const loader = new LoaderComponent();
	globalLoaderComponent = loader;

});
