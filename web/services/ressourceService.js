class ressourceService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/ressource", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/ressource/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/ressource`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/ressource/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/ressource/${id}`, "DELETE");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/ressource/${last}`, "GET");
    }

    async upload(payload){
        return super.fetchAResource(`/api/ressource/upload`, "POST", {'Content-Type': 'application/octet-stream'}, payload);
    }

    async download(){
        return super.fetchAResource(`/api/ressource/download`, "GET");
    }

}
