class TableComponent extends Component {

	constructor(id = null, args = {}){
		super('TableComponent', id, args);

		this.rows = [];
		this.lastDisplayed = 0;
		this.loadedPages = [];
		this.forward = true;
		this.serviceManager = null;
		this.onLoadColumns = this.getArgValue('onLoadColumns');
		this.onLoadData = this.getArgValue('onLoadData');
		this.onLoadAction = this.getArgValue('onLoadAction');

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

	showColumns(){
		// onLoadColumns shall return a value with format ["Username", "E-Mail", "..."]
		const columns = window[this.onLoadColumns]();

		let result = "";
		columns.forEach((column)=>{
			result += `<th>${column}</th>`;
		});
		result += `<th>Actions</th>`;

		return result;
	}

	fillActions(row){
		let html = "";
		// allActions shall take an index of an object and return an object with function, param, and text
		row.forEach((action)=>{
			html += `<button onclick="${action.func}(${action.arg})">${action.name}</button>`;
		});
		return html;
	}

	fillRow(row){
		let html = '';
		row.forEach((col)=>{
			html += `<td>${col}</td>`;
		});
		
		return html;
	}

	fillArray(elements, list){
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

	display(){
		const list = this.getChild('my-table');

		if(this.forward){
			// this.serviceManager.get(this.lastDisplayed).then((items))=>{
			getCategories(this.lastDisplayed).then((items)=>{
				if(items.length > 0){
					this.allItems = items;
					this.fillArray(items, list);
				}  else if(this.loadedPages.length != 0) {
					this.loadedPages.pop();
					alert("No more data behind!");
				}
			});
		} else if(this.loadedPages.length > 0) {
			this.allItems = this.loadedPages.pop();
			fillArray(this.allItems, list);
		} else {
			alert("No more data before!");
		}
	}

	render(){
		super.render();

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

document.addEventListener('DOMContentLoaded', () => {
	const containers = document.querySelectorAll('TableComponent');

    containers.forEach(container => {
		const table = new TableComponent(container.id);
        table.render();
    });

});