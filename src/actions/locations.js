export const init = () => {
    return {
        type: 'INIT'
    }
}

export const addLocation = (location, flag=false) => {
    return {
        type: 'ADD_LOCATION',
        location,
        flag
    }
}


export const removeLocation = (location, flag=false) => {
    return {
        type: 'REMOVE_LOCATION',
        location,
        flag
    }
}

export const editLocation = (newLocationItem, oldLocationitem, flag=false) => {
    return {
        type: 'EDIT_LOCATION',
        newLocationItem,
        oldLocationitem,
        flag
    }
}