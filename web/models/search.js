/** Here you might define custom models. 
 * Here they are not really used, but you may need them in complex app.
 * Note that the attributes need to match your backend objects.
 * 
 * They must all extends Model (wich means you have to include Model in the same page using a <script> tag.)
 * */

class search extends Model {
    constructor() {
        super();
        this.key = "";
        this.value = "";
    }
    
    map(jsonObject){
        this.key = jsonObject[0];
		this.value = jsonObject[1];
    }

	unMap(){
        return {
            key: this.key,
            value: this.value
        }
    }
}
