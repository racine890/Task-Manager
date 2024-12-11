class DataManager{

	constructor(persistent = false){
		this.dataHandler = persistent ? localStorage : sessionStorage;
	}

	setvar(varname, value){
		this.dataHandler.setItem(varname, JSON.stringify(value));
	}

	getvar(varname, model=null){
		let result = this.dataHandler.getItem(varname);
		if( result == null){
			throw new Error(varname+` is not set !`);
		}

		if(model == null)
			return JSON.parse(result);
		else
			return model.map(JSON.parse(result))
	}

	remvar(varname){
		this.dataHandler.removeItem(varname);
	}

	checkvar(varname){
		return this.dataHandler.getItem(varname) != null;
	}

}