var Immutable = require('immutable');

const initialState = Immutable.Map({
    locations: []
});

const locationsReducer = (state = initialState, action) => {
    let _locations;

    switch(action.type) {
        case 'INIT': {
            _locations = JSON.parse(localStorage.getItem("_locations"));
            if(_locations)
                return state.set('locations', _locations);
            return state;
        }
        case 'ADD_LOCATION': {
            _locations = state.get('locations');

            // check if the location name isnt already exist
            if(_locations.length === 0 || !(_locations.filter(item => item.name === action.location.name).length)) {
                _locations.push(action.location);
                localStorage.setItem("_locations", JSON.stringify(_locations));
                action.flag = true;
                return state.set('locations', _locations);
            } 

            console.error(action.location.name + ' is already exist in the location list');
            action.flag = false;
            return state;
        }
        case 'REMOVE_LOCATION': {
            _locations = state.get('locations');
            _locations = _locations.filter(item => item.name !== action.location.name);
            localStorage.setItem("_locations", JSON.stringify(_locations));           
            action.flag = true;;
            state.set('locations', _locations);
            
            return state.set('locations', _locations);
        }
        case 'EDIT_LOCATION': {
            _locations = state.get('locations');

            // check if the new value is already exist.
            if(!(_locations.filter(item => item.name === action.newLocationItem.name).length) || action.oldLocationitem.name === action.newLocationItem.name) {
                // getting the index of the item by it's name.
                _locations[_locations.findIndex((el) => {
                    return el.name === action.oldLocationitem.name;
                })] = action.newLocationItem;

                localStorage.setItem("_locations", JSON.stringify(_locations));
                action.flag = true;

                return state.set('locations', _locations);
            }

            console.error('The new value you tried to update into is already exist.');
            action.flag = false;
            return state;

        }
        default:
            return state;
    }
}

export default locationsReducer;