var Immutable = require('immutable');

const initialState = Immutable.Map({
    categories: []
});

const categoriesReducer = (state = initialState, action) => {

    let _categories;

    switch(action.type) {
        case 'INIT': {
            _categories = JSON.parse(localStorage.getItem("_categories"));
            if(_categories)
                return state.set('categories', _categories);
            return state;
        }
        case 'ADD_CATEGORY': {
            _categories = state.get('categories');

            // making categories UNIQUE, check if the category isnt already exist
            if(_categories.indexOf(action.category) <= -1) {
                _categories.push(action.category);
                localStorage.setItem("_categories", JSON.stringify(_categories));
                action.flag = true;
                return state.set('categories', _categories);
            }

            action.flag = false;
            console.error(action.category + ' is already exist in the categories list');

            return state;
        }
        case 'REMOVE_CATEGORY': {
            _categories = state.get('categories');
            _categories = _categories.filter(item => item !== action.category);
            localStorage.setItem("_categories", JSON.stringify(_categories)); 
            action.flag = true;

            return state.set('categories', _categories);
        }
        case 'EDIT_CATEGORY': {
            _categories = state.get('categories');
            if(_categories.indexOf(action.oldCategoryitem) > -1) {
                // check if the new value is already exist
                if(_categories.indexOf(action.newCategoryItem) <= -1) {
                    _categories[_categories.indexOf(action.oldCategoryitem)] = action.newCategoryItem;
                    localStorage.setItem("_categories", JSON.stringify(_categories));
                    action.flag = true;            
                    return state.set('categories', _categories);
                } else {
                    action.flag = false;
                    console.error('The new value you tried to transform into is already exist.');
                    return state;
                }
            }
            action.flag = false;
            console.error('The category you want to edit isnt exist.');
            return state;
        }
        default:
            return state;
    }
}

export default categoriesReducer;