class ressource extends Model {

	constructor() {
		super();
		this.id = null;
		this.title = "";
		this.path = "";
		this.creator = null;
		this.create_date = null;
	}
	
	map(jsonObject){
		this.id = jsonObject[0];
		this.title = jsonObject[1];
		this.path = jsonObject[2];
		this.creator = jsonObject[3];
		this.create_date = jsonObject[4];
	}

	mapLite(jsonObject){
		this.title = jsonObject[0];
		this.path = jsonObject[1];
	}
	
	unMap(){
		return {
			title: this.title,
			path: this.path,
			create_date: this.create_date.toISOString().split('T')[0]
		}
	}
}
