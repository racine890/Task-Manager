/** Here you might define custom services. 
 * Keep in mind that each service method is based on an api.
 * Make as much methods to query backend apis.
 * 
 * And always use them to send requests.
 * They must all extends Service (wich means you have to include Service in the same page using a <script> tag.)
 * Please take a look at fetchAResource method to see how it works.
 * */
class searchService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async searchUser(term){
        return super.fetchAResource(`/api/search/user/${term}`, "GET");
    }
    
	async searchProject(term){
        return super.fetchAResource(`/api/search/project/${term}`, "GET");
    }

	async searchTask(term){
        return super.fetchAResource(`/api/search/task/${term}`, "GET");
    }
}
