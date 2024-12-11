class user extends Model {
    constructor() {
        super();
        this.id = null;
        this.username = "";
        this.email = "";
        this.password = "";
        this.profile_pic = "";
        this.create_date = new Date();
        this.active = false;
    }
    
    map(jsonObject){
        this.id = jsonObject[0];
        this.username = jsonObject[1];
        this.email = jsonObject[4];
        this.password = jsonObject[2];
        this.create_date = new Date(jsonObject[5]);
        this.profile_pic = jsonObject[3];
        this.active = jsonObject[6] == 1 ? true : false;
    }

    mapLite(jsonObject){
        this.username = jsonObject[0];
        this.email = jsonObject[3];
        this.password = jsonObject[1];
        this.profile_pic = jsonObject[2];
    }
    
    unMap(){
        return {
            username: this.username,
            email: this.email,
            password: this.password,
            create_date: this.create_date.toISOString().split('T')[0],
            profile_pic: this.profile_pic
        }
    }
}
