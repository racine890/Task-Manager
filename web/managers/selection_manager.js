/**
 * This is a simple POST usage example.
 */
async function selectionSearch(object, term) {
    try{
        // And let the service save the constructed user.
        // It's asynchronous, so you have to await it.
        let response = null;
        
        if(object == 'user')
            response = await appSearchService.searchUser(term);

        if(object == 'project')
            response = await appSearchService.searchProject(term);

        if(object == 'task')
            response = await appSearchService.searchTask(term);

        if(response != null){
            let founds = [];
            response.forEach(found => {
                let value = new search();
                value.map(found);
                founds.push(value);
            });
            return founds;
        }

    } catch(Error){
        console.error(Error);
    }
}