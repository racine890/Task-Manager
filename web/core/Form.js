const VALIDATORS = {
    NONE: 0,
    REQUIRED: 1,
    EMAIL: 2,
    PASSWORD_LOW: 3,
    PASSWORD_MEDIUM: 4,
    PASSWORD_STRONG: 5,
    NO_XSS: 6,
    TEXT_ONLY: 7
}

class Form{
	constructor(fields={}){
        this.fields = fields;
        this.invalids = [];
        this.errormsg = '';
	}

    preload(){
        this.fields.forEach(field => {
            const fieldObj = document.getElementById(field[0]);
            const fieldDefaultValue = field[1];
            if(fieldDefaultValue != null){
                fieldObj.value = fieldDefaultValue;
            }
        });
    }

    testValidity(value, validator=VALIDATORS.NONE){

        switch(validator){
            case VALIDATORS.EMAIL:
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(value);

            case VALIDATORS.NO_XSS:
                const xssRegex = /<(|\/|[^>\/bi]|\/[^>bi]|[^\/>][^>]+|\/[^>][^>]+)>/g;
                return !xssRegex.test(value);
            
            case VALIDATORS.PASSWORD_LOW:
                const passwordLowRegex = /^[a-zA-Z0-9]{6,}$/;
                return passwordLowRegex.test(value);

            case VALIDATORS.PASSWORD_MEDIUM:
                const passwordMediumRegex = /^[a-zA-Z0-9]{8,}$/;
                return passwordMediumRegex.test(value);

            case VALIDATORS.PASSWORD_STRONG:
                const passwordStrongRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{12,}$/;
                return passwordStrongRegex.test(value);

            case VALIDATORS.REQUIRED:
                return value != '';

            case VALIDATORS.TEXT_ONLY:
                const textRegex = /^[a-zA-Z\s]+$/;
                return textRegex.test(value);

            default:
                return true;
        }
    }

    isValid(){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];

            const fieldObj = document.getElementById(field[0]);
            const fieldIsValid = this.testValidity(fieldObj.value, field[2]);

            if (fieldIsValid == false) {
                this.errormsg = field[3];
                return false;
            }
        }
        return true;
    }

    set(fieldId, fieldValue){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if(field[0] == fieldId){
                field[1] = fieldValue;
                const fieldObj = document.getElementById(fieldId);
                fieldObj.value = fieldValue;
                return;
            }
        };
    }

    setAll(fieldValues){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if(fieldValues.hasOwnProperty(field[0])){
                field[1] = fieldValues[field[0]];
                const fieldObj = document.getElementById(field[0]);
                fieldObj.value = fieldValues[field[0]];
            }
        };
    }

    get(fieldId){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if(field[0] == fieldId){
                const fieldObj = document.getElementById(fieldId);
                return fieldObj.value;
            }
        };
    }

    getAll(){
        let data = {};
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            const fieldObj = document.getElementById(field[0]);
            data[field[0]] = fieldObj.value;
        };
        return data;
    }

    reset(fieldId){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if(field[0] == fieldId){
                const fieldObj = document.getElementById(fieldId);
                field[1] = null;
                fieldObj.value = '';
                return true;
            }
        };
    }

    resetAll(){
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            const fieldObj = document.getElementById(field[0]);
            field[1] = null;
            fieldObj.value = '';
        };
    }
}

/** 
 * There, username matches the field id
 * [default_value, validator]
 * 
 * const myForm = Form({
 * 	"username": [form_id, null, VALIDATORS.REQUIRED],
 * 	"password": [form_id, null, VALIDATORS.REQUIRED]
 * })
 * 
 */