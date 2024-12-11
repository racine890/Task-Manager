/** 
 * You can just keep the core folder for your projects if you use js
 * And make custom scripts that will inherit that one.
 * 
 * Don't directly use this, even if you can.
 */
class Service {
    constructor(){
        this.config = null;
    }

    // Please be sure you have that your app.config.json is correctly set
    async initConfig(configFile = 'core/app.config.json'){
        if(!appDataManager.checkvar('config')){
            await fetch(configFile)
            .then((response) => response.json())
            .then((json) => {
                this.config = json;
                appDataManager.setvar('config', json);
            });
        } else {
            this.config = appDataManager.getvar('config');
        }
        
    }

    // That method you will more likely use.
    // Takes the api, the method, and optionaly some additionnal headers and a json body (payload)
    async fetchAResource(resourceAPI, providedMethod="GET", providedHeaders={'Content-Type': 'application/json'}, providedBody=null) {
        try {

            let _headers = {
                ...providedHeaders
            };

            if (this.config.server_authentication == 'basic') {
                const base64Credentials = btoa(`${this.config.server_username}:${this.config.server_password}`);
                _headers['Authorization'] = `Basic ${base64Credentials}`;
            }

            if(providedBody != null)
                providedBody = JSON.stringify(providedBody);

            const response = await fetch(`${this.config.server_url + resourceAPI}`, {
                method: providedMethod,
                headers: _headers,
                body: providedBody
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const object = await response.json();
            return object;
        } catch (error) {
            console.log(error);
            throw new Error(`Failled to send the request : `, error);
        }
    }

}
