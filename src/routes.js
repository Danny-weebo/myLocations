import React from 'react';
import { BrowserRouter as Router, Route,} from 'react-router-dom'

import Categories from './components/Categories';
import Locations from './components/Locations';

export const routes = () => (
    <Router>
        <div>
            <Route exact path="/" component={Categories}/>
            <Route path="/categories" component={Categories}/>
            <Route path="/locations" component={Locations}/>
        </div>
    </Router>
);

export default routes;