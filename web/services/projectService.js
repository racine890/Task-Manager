/** Here you might define custom services. 
 * Keep in mind that each service method is based on an api.
 * Make as much methods to query backend apis.
 * 
 * And always use them to send requests.
 * They must all extends Service (wich means you have to include Service in the same page using a <script> tag.)
 * Please take a look at fetchAResource method to see how it works.
 * */
class projectService extends Service {
    constructor(){
        super();
        this.initConfig('../core/app.config.json');
    }

    async get(){
        return super.fetchAResource("/api/project", "GET");
    }
    
    async getByID(id){
        return super.fetchAResource(`/api/project/get/${id}`, "GET");
    }
    
    async save(payload){
        return super.fetchAResource(`/api/project`, "POST", {}, payload);
    }

    async update(id, payload){
        return super.fetchAResource(`/api/project/${id}`, "PATCH", {}, payload);
    }
    
    async delete(id){
        return super.fetchAResource(`/api/project/${id}`, "DELETE");
    }

    async get_paginated(last){
        return super.fetchAResource(`/api/project/${last}`, "GET");
    }

    async get_workers(id){
        return super.fetchAResource(`/api/project/workers/${id}`, "GET");
    }

    async get_sub_projects(id){
        return super.fetchAResource(`/api/project/sub-projects/${id}`, "GET");
    }

    async get_tasks(id){
        return super.fetchAResource(`/api/project/tasks/${id}`, "GET");
    }

    async add_worker(pid, wid){
        return super.fetchAResource(`/api/project/workers/${pid}/${wid}`, "POST");
    }

    async add_sub_project(pid, spid){
        return super.fetchAResource(`/api/project/sub-projects/${pid}/${spid}`, "POST");
    }

    async add_task(pid, tid){
        return super.fetchAResource(`/api/project/tasks/${pid}/${tid}`, "POST");
    }

    async delete_workers(pid, wid){
        return super.fetchAResource(`/api/project/workers/${pid}/${wid}`, "DELETE");
    }

    async delete_project(id){
        return super.fetchAResource(`/api/project/sub-projects/${id}`, "DELETE");
    }

    async delete_task(id){
        return super.fetchAResource(`/api/project/tasks/${id}`, "DELETE");
    }

    async change_status(id, status){
        return super.fetchAResource(`/api/project/status/${id}/${status}`, "POST");
    }

    async assign_last_resource(id){
        return super.fetchAResource(`/api/project/assign-last/${id}`, "POST");
    }

    async get_resources(id){
        return super.fetchAResource(`/api/project/resources/${id}`, "GET");
    }

    async deleteResource(id, rid){
        return super.fetchAResource(`/api/project/resources/${id}/${rid}`, "DELETE");
    }

    async export(id, format){
        return super.fetchAResource(`/api/project/export/${id}/${format}`, "POST");
    }

}
