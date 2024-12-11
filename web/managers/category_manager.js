async function getCategories(lastDisplayed){
    
    try{
        let response = await appCategoryService.get_paginated(lastDisplayed);

        if(response != null){
            let gots = [];
			response.forEach((got)=>{
				let tmp = new category();
				tmp.map(got);
				gots.push(
					tmp
				)
			})

			return gots;
        }

    } catch(Error){
        alert("An error occured!");
    }
}

async function getAllCategories(){
    
    try{
        let response = await appCategoryService.get();

        if(response != null){
            let gots = [];
			response.forEach((got)=>{
				let tmp = new category();
				tmp.map(got);
				gots.push(
					tmp
				)
			})

			return gots;
        }

    } catch(Error){
        alert("An error occured!");
    }
}

async function removeCategory(id){
    
    try{
        await appCategoryService.delete(id);

    } catch(Error){
        alert("An error occured!");
    }
}

async function getCategory(id){
    try{
        let response = await appCategoryService.getByID(id);

        if(response != null){
            let nidea = new category();
            nidea.map(response);
            return nidea;
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function saveCategory(title, description) {
    
    try{
        let response = await appCategoryService.save({
            name: title,
            description: description
        });

        if(response != null){
            let newIdea = new category();
            newIdea.mapLite(response);
			alert("Category "+newIdea.name+" has been saved !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}

async function updateCategory(id, title, description){
    
    try{
        let response = await appCategoryService.update(id, {
            name: title,
            description: description
        });

        if(response != null){
            let newIdea = new category();
            newIdea.mapLite(response);
			alert("Category "+newIdea.name+" has been updated !");
        }

    } catch(Error){
        console.log(Error);
        alert("An error occured!");
    }
}