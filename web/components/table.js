class TableComponent extends Component {

	constructor(id = null, args = {}) {
		super('TableComponent', id, args);

		this.rows = [];
		this.lastDisplayed = 0;
		this.loadedPages = [];
		this.forward = true;
		this.serviceManager = null;
		this.onLoadColumns = this.getArgValue('onLoadColumns');
		this.createBtn = this.getArgValue('createBtn') || 'createBtn';
		this.createPermission = this.getArgValue('createPermission');
		this.onLoadData = this.getArgValue('onLoadData');
		this.onLoadAction = this.getArgValue('onLoadAction');
		this.paginationMethod = this.getArgValue('paginationMethod');

		this.html = `
		<table id="tm_table">
            <thead>
                <tr>
                    ${this.showColumns()}
                </tr>
            </thead>

            <tbody id="my-table">
            </tbody>
        </table>
		<div class="pagination">
            <button id="prev">Précédent</button>
            <button id="next">Suivant</button>
        </div>
		`;
	}

	showColumns() {
		// onLoadColumns shall return a value with format ["Username", "E-Mail", "..."]
		const columns = window[this.onLoadColumns]();

		let result = "";
		columns.forEach((column) => {
			result += `<th>${column}</th>`;
		});
		result += `<th>Actions</th>`;

		return result;
	}

	fillActions(row) {
		let html = "";
		// allActions shall take an index of an object and return an object with function, param, and text
		row.forEach((action) => {
			let color = 'primary';

			if ('color' in action)
				color = action.color;

			if ('right' in action && hasRight(action.right))
				html += `<button class="btn btn-` + color + `" onclick="${action.func}('${action.arg}')">${action.name}</button>`;

			else if (!('right' in action))
				html += `<button class="btn btn-` + color + `" onclick="${action.func}(${action.arg})">${action.name}</button>`;

		});
		return html;
	}

	fillRow(row) {
		let html = '';
		row.forEach((col) => {
			html += `<td>${col.toString().substr(0, 100)}${col.length > 100 ? '...' : ''}</td>`;
		});

		return html;
	}

	fillArray(elements, list) {
		list.innerHTML = '';
		elements.forEach(element => {

			const row = `<tr>
				${this.fillRow(window[this.onLoadData](element))}
				<td>
				${this.fillActions(window[this.onLoadAction](element))}
				</td>
			</tr>`;
			this.lastDisplayed = element.id;
			list.innerHTML += row;
		});
	}

	display(restartPagination = false) {
		const list = this.getChild('my-table');

		if (this.forward) {
			// filters might be undefined...
			if (restartPagination) {
				this.lastDisplayed = 0;
			}

			window[this.paginationMethod](this.lastDisplayed, filters).then((items) => {
				if (items.length > 0) {
					this.allItems = items;
					this.fillArray(items, list);
				} else if (this.loadedPages.length != 0) {
					this.loadedPages.pop();
					alert("No more data behind!");
				} else {
					this.allItems = [];
					this.fillArray(this.allItems, list);
				}
			});
		} else if (this.loadedPages.length > 0) {
			this.allItems = this.loadedPages.pop();
			fillArray(this.allItems, list);
		} else {
			alert("No more data before!");
		}
	}

	render() {
		super.render();

		if (this.createBtn) {
			const createBtn = document.getElementById('createBtn');
			if (!hasRight(this.createPermission)) {
				createBtn.hidden = true;
			};
		}

		const prev = this.getChild('prev');
		const next = this.getChild('next');

		prev.onclick = () => {
			this.forward = false;
			this.display();
		};

		next.onclick = () => {
			this.loadedPages.push(this.allItems);
			this.display();
		};

		this.display();
	}

}

const tableMap = new Map();
document.addEventListener('DOMContentLoaded', () => {
	const containers = document.querySelectorAll('TableComponent');

	containers.forEach(container => {
		const table = new TableComponent(container.id);
		table.render();
		tableMap.set(container.id, table);
	});
});