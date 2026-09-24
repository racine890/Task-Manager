class category extends Model {
    constructor() {
        super();
        this.id = null;
        this.name = "";
        this.description = "";
        this.target = "both";
        this.create_date = new Date();
        this.active = false;
        this.initial_status = 0;
        this.allowed_statuses = [];
    }

    map(jsonObject){
        this.id = jsonObject[0];
        this.name = jsonObject[1];
        this.description = jsonObject[2];
        this.target = jsonObject[3] || "both";
        this.create_date = new Date(jsonObject[4]);
        this.active = jsonObject[5] == 1 ? true : false;
        this.initial_status = jsonObject[6] != null ? parseInt(jsonObject[6]) : 0;
        this.allowed_statuses = jsonObject[7] ? jsonObject[7].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
    }

    mapLite(jsonObject){
        this.name = jsonObject[0];
        this.description = jsonObject[1];
        this.target = jsonObject[2] || "both";
    }
    
    unMap(){
        return {
            name: this.name,
            description: this.description,
            target: this.target,
            initial_status: this.initial_status,
            allowed_statuses: this.allowed_statuses.join(','),
            password: this.password,
            create_date: this.create_date.toISOString().split('T')[0],
        }
    }
}
