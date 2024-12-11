/**
 * Here we'll just store usefull functions
 */

// That one can take a text date and make it readable
function toDisplayDate(textDate){
    const dateObject = new Date(textDate.replace(' ', 'T') + 'Z');

    const formattedDate = dateObject.toLocaleString('en-EN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    return formattedDate;
}

function redirect(path = '#', newTarget=false){
    if(newTarget)
        window.open(path);
    else
        window.location.href = path;
}

function nextId(){
    let id = 0;
    try {
        id = appDataManager.getvar("last-id", 0);
    } catch(Error){}
    
    appDataManager.setvar("last-id", id+1);
    return id;
}