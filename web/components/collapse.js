class CollapseComponent extends Component {

	constructor(id = null, args = {}) {
    super('CollapseComponent', id, args);

		this.name = this.getArgValue('name');
		this.title = this.getArgValue('title');

		this.html = `
			  <div class="tab">
			    <input type="checkbox" name="${this.name}" id="cb_${this.id}">
			    <label for="cb_${this.id}" class="tab__label">${this.title}</label>
			    <div class="tab__content">
			      @CONTENT
			    </div>
			  </div>
					`;
	}

	render() {
		super.render();

		const container = document.querySelector(`#${this.id}`);
    const input = container.querySelector('input[type="checkbox"]');
    const content = container.querySelector('.tab__content');

    input.addEventListener('change', () => {
        if (input.checked) {
            content.style.height = `${content.scrollHeight}px`;
        } else {
            content.style.height = `${content.scrollHeight}px`;

            requestAnimationFrame(() => {
                content.style.height = '0px';
            });
        }
    });

    content.addEventListener('transitionend', () => {
        if (input.checked) {
            content.style.height = 'auto';
        }
    });
	}
}

document.addEventListener('DOMContentLoaded', () => {

	const containers = document.querySelectorAll('CollapseComponent');

	containers.forEach(container => {
		const collapse = new CollapseComponent(container.id);
		collapse.render();
	});

});
