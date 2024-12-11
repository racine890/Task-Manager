class categoryService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/category", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/category/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/category`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/category/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/category/${id}`, "DELETE");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/category/${last}`, "GET");
    }

}
