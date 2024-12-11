const STATUS = {
    NEW: 0,
    TODO: 1,
    STARTED: 2,
    PAUSED: 3,
    TESTING: 4,
    FINISHED: 5,
    ABANDONED: 6
}

class project extends Model {

    constructor() {
        super();
        this.id = null;
        this.creator = null;
        this.name = "";
        this.description = "";
        this.create_date = new Date();
        this.active = false;
        
        this.status = STATUS.NEW;
        this.start_date = null;
        this.end_date = null;
        this.effective_start = null;
        this.effective_end = null;
        this.parent = null;
        this.category_id = null;
    }
    
    map(jsonObject){
        this.id = jsonObject[0];
        this.creator = jsonObject[3];
        this.name = jsonObject[1];
        this.description = jsonObject[2];
        this.create_date = new Date(jsonObject[11]);
        this.active = jsonObject[10] == 1 ? true : false;

        this.status = jsonObject[4];
        this.start_date = new Date(jsonObject[5]);
        this.end_date = new Date(jsonObject[6]);
        this.effective_start = new Date(jsonObject[7]);
        this.effective_end = new Date(jsonObject[8]);

        this.parent = jsonObject[9];
        this.category_id = jsonObject[10];
    }

    mapLite(jsonObject){
        this.creator = jsonObject[4];
        this.name = jsonObject[0];
        this.description = jsonObject[1];
        this.start_date = new Date(jsonObject[2]);
        this.end_date = new Date(jsonObject[3]);
    }
    
    unMap(){
        return {
            creator: this.creator,
            name: this.name,
            description: this.description,
            create_date: this.create_date.toISOString().split('T')[0],
            status: this.status,
            start_date: this.start_date.toISOString().split('T')[0],
            end_date: this.end_date.toISOString().split('T')[0],
            effective_start: this.effective_start.toISOString().split('T')[0],
            effective_end: this.effective_end.toISOString().split('T')[0],
        }
    }
}
