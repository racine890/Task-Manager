/** Here you might define custom models. 
 * Here they are not really used, but you may need them in complex app.
 * Note that the attributes need to match your backend objects.
 * 
 * They must all extends Model (wich means you have to include Model in the same page using a <script> tag.)
 * */
class idea extends Model {
    constructor() {
        super();
        this.id = null;
        this.creator = null;
        this.name = "";
        this.description = "";
        this.create_date = new Date();
        this.active = false;
    }
    
    map(jsonObject){
        this.id = jsonObject[0];
        this.creator = jsonObject[1];
        this.name = jsonObject[2];
        this.description = jsonObject[3];
        this.create_date = new Date(jsonObject[4]);
        this.active = jsonObject[5] == 1 ? true : false;
    }

    mapLite(jsonObject){
        this.name = jsonObject[0];
        this.description = jsonObject[1];
    }
    
    unMap(){
        return {
            creator: this.creator,
            name: this.name,
            description: this.description,
            create_date: this.create_date.toISOString().split('T')[0],
        }
    }
}
