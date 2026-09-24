class userService extends Service {
    constructor() {
        super();
        this.initConfig('../core/app.config.json');
    }

    async get() {
        return super.fetchAResource("/api/user", "GET");
    }

    async getByID(id) {
        return super.fetchAResource(`/api/user/get/${id}`, "GET");
    }

    async getRightsByID(id) {
        return super.fetchAResource(`/api/user/rights/${id}`, "GET");
    }

    async save(payload) {
        return super.fetchAResource(`/api/user`, "POST", {}, payload);
    }

    async update(id, payload) {
        return super.fetchAResource(`/api/user/${id}`, "PATCH", {}, payload);
    }

    async delete(id) {
        return super.fetchAResource(`/api/user/${id}`, "DELETE");
    }

    async auth(payload) {
        return super.fetchAResource(`/api/auth`, "POST", {}, payload);
    }

    async logout() {
        return super.fetchAResource(`/api/logout`, "POST");
    }

    async get_paginated(last) {
        return super.fetchAResource(`/api/user/${last}`, "GET");
    }

    async enable(id) {
        return super.fetchAResource(`/api/user/enable/${id}`, "PATCH");
    }

    async dropRight(id, rightId) {
        return super.fetchAResource(`/api/user/rights/${id}/${rightId}`, "DELETE");
    }

    async addRight(id, rightId) {
        return super.fetchAResource(`/api/user/rights/${id}/${rightId}`, "POST");
    }

    async updateMe(payload) {
        return super.fetchAResource(`/api/user/me`, "PATCH", {}, payload);
    }

    async getMe() {
        return super.fetchAResource(`/api/user/me`, "GET");
    }

    async updatePassword(payload) {
        return super.fetchAResource(`/api/user/me/password`, "PATCH", {}, payload);
    }

    async getAssignations(id) {
        return super.fetchAResource(`/api/user/assignations/${id}`, "GET");
    }

    async getAssignationsPaginated(id, start) {
        return super.fetchAResource(`/api/user/assignations/${id}/${start}`, "POST");
    }

}
