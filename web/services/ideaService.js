/** Here you might define custom services. 
 * Keep in mind that each service method is based on an api.
 * Make as much methods to query backend apis.
 * 
 * And always use them to send requests.
 * They must all extends Service (wich means you have to include Service in the same page using a <script> tag.)
 * Please take a look at fetchAResource method to see how it works.
 * */
class ideaService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/idea", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/idea/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/idea`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/idea/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/idea/${id}`, "DELETE");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/idea/${last}`, "GET");
    }

}
