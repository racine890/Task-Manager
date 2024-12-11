class userService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/user", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/user/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/user`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/user/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/user/${id}`, "DELETE");
    }

    async auth(payload){
        return super.fetchAResource(`/api/auth`, "POST", {}, payload);
    }

    async check_auth(){
        return super.fetchAResource(`/api/check-auth`, "POST");
    }

    async logout(){
        return super.fetchAResource(`/api/logout`, "POST");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/user/${last}`, "GET");
    }

    async enable(id){
        return super.fetchAResource(`/api/user/enable/${id}`, "PATCH");
    }
}
