/** 
 * You can just keep the core folder for your projects if you use js
 * And make custom scripts that will inherit that one.
 * 
 * Don't directly use this, even if you can.
 * 
 * @author Yesenia Vazquez
 * @version 1.0
 * @date 2026-01-30
 */
class Service {
    constructor() {
        this.config = null;
    }

    /**
     * Initialize the config file.
     * 
     * @param {string} configFile - The path to the config file.
     */
    async initConfig(configFile = 'core/app.config.json') {
        if (!appDataManager.checkvar('config')) {
            await fetch(configFile)
                .then((response) => response.json())
                .then((json) => {
                    this.config = json;

                    if (!window.location.href.includes('localhost')
                        && !window.location.href.includes('127.0.0.1')) {
                        this.config.server_url = window.location.href.split('/').slice(0, 3).join('/');
                    }

                    appDataManager.setvar('config', json);
                });
        } else {
            this.config = appDataManager.getvar('config');
        }
    }

    /**
     * That method you will more likely use.
     * 
     * @param {string} resourceAPI - The API endpoint.
     * @param {string} providedMethod - The HTTP method.
     * @param {Object} providedHeaders - The headers.
     * @param {Object} providedBody - The body.
     */
    async fetchAResource(resourceAPI, providedMethod = "GET", providedHeaders = { 'Content-Type': 'application/json' }, providedBody = null) {
        try {

            let _headers = {
                ...providedHeaders
            };

            // If token exists in localStorage, add it to the headers
            if (appDataManager.checkvar('token')) {
                const token = appDataManager.getvar('token');
                if (token) {
                    _headers.Authorization = `Bearer ${token}`;
                }
            }

            if (providedBody != null)
                providedBody = JSON.stringify(providedBody);

            const response = await fetch(`${this.config.server_url + resourceAPI}`, {
                method: providedMethod,
                headers: _headers,
                body: providedBody
            });

            if (!appDataManager.checkvar('token') || appDataManager.getvar('token') == null) {
                if (response.status == 401) {
                    appDataManager.setvar('token', null);
                    redirect('auth.html');
                }
            }

            if (response.status == 403) {
                const errorBody = await response.json();
                throw new Error(errorBody.msg || 'Forbidden');
            }

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.msg || 'An error occured!');
            }

            const object = await response.json();
            return object;
        } catch (error) {
            throw error;
        }
    }

}
