class setting extends Model {
    constructor() {
        super();
        this.id = null;
        this.key = "";
        this.value = "";
    }
    
    map(jsonObject){
        this.id = jsonObject[0];
        this.key = jsonObject[1];
		this.value = jsonObject[2];
    }

    mapLite(jsonObject){
        this.key = jsonObject[1];
		this.value = jsonObject[0];
    }

	unMap(){
        return {
            key: this.key,
            value: this.value
        }
    }
}
