class taskService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/task", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/task/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/task`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/task/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/task/${id}`, "DELETE");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/task/${last}`, "GET");
    }

    async get_workers(id){
        return super.fetchAResource(`/api/task/workers/${id}`, "GET");
    }

    async add_worker(pid, tid){
        return super.fetchAResource(`/api/task/workers/${pid}/${tid}`, "POST");
    }

    async add_note(tid, payload){
        return super.fetchAResource(`/api/task/notes/${tid}`, "POST", {}, payload);
    }

    async get_notes(id){
        return super.fetchAResource(`/api/task/notes/${id}`, "GET");
    }

    async change_status(id, status){
        return super.fetchAResource(`/api/task/status/${id}/${status}`, "POST");
    }

    async assign_last_resource(id){
        return super.fetchAResource(`/api/task/assign-last/${id}`, "POST");
    }

    async get_resources(id){
        return super.fetchAResource(`/api/task/resources/${id}`, "GET");
    }

    async deleteResource(id, rid){
        return super.fetchAResource(`/api/task/resources/${id}/${rid}`, "DELETE");
    }
    
    async deleteNote(id, nid){
        return super.fetchAResource(`/api/task/notes/${id}/${nid}`, "DELETE");
    }
}
