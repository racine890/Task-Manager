class TableComponent extends Component {

	constructor(id = null, args = {}) {
		super('TableComponent', id, args);

		this.rows = [];
		this.allItems = [];
		this.currentPage = [];
		this.backwardStack = [];
		this.forwardStack = [];
		this.offset = 0;
		this.pageSize = 20;
		this.loading = false;
		this.serviceManager = null;
		this.filters = [];
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
            <button id="prev">Previous</button>
            <button id="next">Next</button>
        </div>
		`;
	}

	showColumns() {
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
			const str = (col !== null && col !== undefined) ? col.toString() : '';
			const truncated = str.length > 100 ? str.slice(0, 100) + '...' : str;
			html += `<td>${truncated}</td>`;
		});

		return html;
	}

	fillArray(elements, list) {
		list.innerHTML = '';
		this.allItems = elements;
		this.currentPage = elements;
		elements.forEach(element => {

			const row = `<tr>
				${this.fillRow(window[this.onLoadData](element))}
				<td>
				${this.fillActions(window[this.onLoadAction](element))}
				</td>
			</tr>`;
			list.innerHTML += row;
		});
	}

	setFilters(filters) {
		this.filters = filters;
		this.resetPagination();
	}

	resetPagination() {
		this.backwardStack = [];
		this.forwardStack = [];
		this.currentPage = [];
		this.allItems = [];
		this.offset = 0;
		this.loading = false;
	}

	display(restartPagination = false) {
		if (this.loading)
			return;

		const list = this.getChild('my-table');

		if (restartPagination)
			this.resetPagination();

		if (this.forwardStack.length > 0) {
			const entry = this.forwardStack.pop();
			this.offset = entry.offset + entry.items.length;
			this.fillArray(entry.items, list);
			return;
		}

		if (this.currentPage.length > 0) {
			this.backwardStack.push({
				items: this.currentPage,
				offset: this.offset - this.currentPage.length
			});
		}

		this.loading = true;
		window[this.paginationMethod](this.offset, this.filters)
			.then((items) => {
				this.loading = false;

				if (Array.isArray(items) && items.length > 0) {
					this.offset += items.length;
					this.fillArray(items, list);
				} else if (this.backwardStack.length > 0) {
					this.backwardStack.pop();
					alert("No more data ahead!");
				} else {
					this.fillArray([], list);
				}
			})
			.catch((error) => {
				this.loading = false;
				if (this.backwardStack.length > 0)
					this.backwardStack.pop();
				console.error('Pagination error:', error);
				alert("An error occurred while loading data.");
			});
	}

	goBack() {
		if (this.loading)
			return;

		const list = this.getChild('my-table');

		this.forwardStack.push({
			items: this.currentPage,
			offset: this.offset - this.currentPage.length
		});

		if (this.backwardStack.length > 0) {
			const entry = this.backwardStack.pop();
			this.offset = entry.offset;
			this.fillArray(entry.items, list);
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
			this.goBack();
		};

		next.onclick = () => {
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
