export const init = () => {
    return {
        type: 'INIT'
    }
}

export const addCategory = (category, flag=false) => {
    return {
        type: 'ADD_CATEGORY',
        category,
        flag
    }
}

export const removeCategory = (category, flag=false) => {
    return {
        type: 'REMOVE_CATEGORY',
        category,
        flag
    }
}

export const editCategory = (newCategoryItem, oldCategoryitem, flag=false) => {
    return {
        type: 'EDIT_CATEGORY',
        newCategoryItem,
        oldCategoryitem,
        flag
    }
}