export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(method, path, data = null) {
        const headers = {
            "Content-Type": "application/json",
        };

        const options = {
            method,
            headers,
            credentials: "include", // send cookies with request
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const res = await fetch(`${this.baseUrl}${path}`, options);
        const contentType = res.headers.get("Content-Type");

        let responseData = null;
        if (contentType && contentType.includes("application/json")) {
            responseData = await res.json();
        } else {
            responseData = await res.text();
        }

        if (!res.ok) {
            throw new Error(responseData.message || res.statusText);
        }

        return responseData;
    }

    // Auth
    async login(data) {
        return await this.request("POST", "/users/login", data);
    }

    async register(data) {
        return await this.request("POST", "/users/register", data);
    }

    async getMe() {
        return await this.request("GET", "/users/me");
    }

    // Forms
    async getForms() {
        return await this.request("GET", "/forms");
    }

    async getForm(id) {
        return await this.request("GET", `/forms/${id}`);
    }

    async createForm(data) {
        return await this.request("POST", "/forms", data);
    }

    async submitForm(data) {
        return await this.request("POST", "/forms/submissions", data);
    }

    async getMySubmissions() {
        return await this.request("GET", "/forms/submissions");
    }

    async getSubmission(id) {
        return await this.request("GET", `/forms/submissions/${id}`);
    }
}

export const api = new ApiService("/api");
