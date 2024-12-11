class SelectionComponent extends Component{
	
	constructor(id = null, args = {}){
		super('SelectionComponent', id, args);

		this.object = this.getArgValue('object');
		this.id = this.getArgValue('id');
		this.title = this.getArgValue('title');
		this.container = this.getArgValue('container');
		this.editAction = this.getArgValue('editAction');
		this.deleteAction = this.getArgValue('deleteAction');
		this.searchAction = this.getArgValue('searchAction');
		this.validateAction = this.getArgValue('validateAction');
		this.selectedItem = null;
		this.selectedValue = null;
		this.popup = null;
		this.searchInput = null;
		this.resultList = null;
		
		this.html = `
					<i class="fas fa-plus icon" title="add" id="openPopup"></i>
					<div id="popup" class="popup">
						<div class="popup-content">
							<span class="close" id="closePopup">&times;</span>
							<h2>${this.title}</h2>
							<input type="text" id="searchInput" placeholder="Recherchez un élément...">
							<ul id="resultList"></ul>
							<button id="validateSelection">Valider</button>
						</div>
					</div>
					<script src="../actions/selection.js"></script>
		`;
	}

	render(){
		super.render();

		const openPopup = this.getChild('openPopup');
		const closePopup = this.getChild('closePopup');
		this.popup = this.getChild('popup');
		this.searchInput = this.getChild('searchInput');
		this.resultList = this.getChild('resultList');
		const validateSelection = this.getChild('validateSelection');
	
		closePopup.addEventListener('click', () => {
			this.popup.style.display = 'none';
		});

		openPopup.addEventListener('click', () => {
			this.popup.style.display = 'block';
		});
	
		window.addEventListener('click', (event) => {
			if (event.target === this.popup) {
				this.popup.style.display = 'none';
			}
		});
	
		this.searchInput.addEventListener('input', () => {
			
			const query = this.searchInput.value.toLowerCase();
			this.resultList.innerHTML = '';
	
			if (query) {
				selectionSearch(this.object, query).then((filteredItems)=>{
					filteredItems.forEach(item => {
						const li = document.createElement('li');
						li.textContent = item.value;
						li.setAttribute('data-id', item.key);
						li.addEventListener('click', () => {
							this.selectedItem = item.key;
							this.selectedValue = item.value;
							this.resultList.innerHTML = '';
							this.searchInput.value = item.value;
						});
						this.resultList.appendChild(li);
					});
				});
			}
		});
	
		validateSelection.addEventListener('click', () => {
			const func = window[this.validateAction];

			if (typeof func === "function") {
				func(this);
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const containers = document.querySelectorAll('SelectionComponent');

    containers.forEach(container => {
		const selection = new SelectionComponent(container.id);
        selection.render();
    });

});