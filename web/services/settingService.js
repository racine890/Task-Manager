class settingService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/config/${last}`, "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/config/get/${id}`, "GET");
    }

    async update(payload){
        return super.fetchAResource(`/api/config`, "PATCH", {}, payload);
    }

}
