class category extends Model {
    constructor() {
        super();
        this.id = null;
        this.name = "";
        this.description = "";
        this.create_date = new Date();
        this.active = false;
    }

    map(jsonObject){
        this.id = jsonObject[0];
        this.name = jsonObject[1];
        this.description = jsonObject[2];
        this.create_date = new Date(jsonObject[3]);
        this.active = jsonObject[4] == 1 ? true : false;
    }

    mapLite(jsonObject){
        this.name = jsonObject[0];
        this.description = jsonObject[1];
    }
    
    unMap(){
        return {
            name: this.name,
            description: this.description,
            password: this.password,
            create_date: this.create_date.toISOString().split('T')[0],
        }
    }
}
