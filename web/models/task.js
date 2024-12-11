const STATUS = {
    NEW: 0,
    TODO: 1,
    STARTED: 2,
    PAUSED: 3,
    TESTING: 4,
    FINISHED: 5,
    ABANDONED: 6
}

class task extends Model {
    constructor() {
        super();
        this.id = null;
        this.creator = null;
        this.mother_idea = null;
        this.project_id = null;
        this.name = "";
        this.description = "";
        this.status = STATUS.NEW;
        this.category_id = null;
        this.create_date = new Date();
        this.active = 1;
    }
    
    map(jsonObject){
        this.id = jsonObject[0];
        this.creator = jsonObject[1];
        this.mother_idea = jsonObject[2];
        this.project_id = jsonObject[3];
        this.name = jsonObject[4];
        this.description = jsonObject[5];
        this.status = jsonObject[6];
        this.category_id = jsonObject[7];
        this.create_date = new Date(jsonObject[8]);
        this.active = jsonObject[9] == 1 ? true : false;
    }

    mapLite(jsonObject){
        this.creator = jsonObject[2];
        this.mother_idea = jsonObject[4];
        this.project_id = jsonObject[3];
        this.name = jsonObject[0];
        this.description = jsonObject[1];
    }
    
    unMap(){
        return {
            creator: this.creator,
            name: this.name,
            description: this.description,
            create_date: this.create_date.toISOString().split('T')[0],
            mother_idea: this.mother_idea,
            project_id: this.project_id
        }
    }
}
