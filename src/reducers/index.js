import { combineReducers } from 'redux';
import categories from './categories';
import locations from './locations';

export default combineReducers({
    categories,
    locations
});