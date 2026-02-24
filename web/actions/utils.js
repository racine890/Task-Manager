/**
 * Here we'll just store usefull functions
 */

// That one can take a text date and make it readable
function toDisplayDate(textDate) {
    if (textDate === undefined || textDate === null || typeof textDate !== 'string') return '';

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

function redirect(path = '#', newTarget = false, otherParams = []) {

    full_path = path
    if (otherParams.length > 0) {
        full_path += '?'
        for (let i = 0; i < otherParams.length; i++) {
            full_path += otherParams[i][0] + '=' + otherParams[i][1] + '&';
            i++;
        }
    }

    if (newTarget)
        window.open(full_path);
    else
        window.location.href = full_path;
}

function nextId() {
    let id = 0;
    try {
        id = appDataManager.getvar("last-id", 0);
    } catch (Error) { }

    appDataManager.setvar("last-id", id + 1);
    return id;
}

function hasRight(right) {
    const rights = appDataManager.getvar("rights");
    return rights.some(r => r.name === 'admin' || r.name === right);
}
