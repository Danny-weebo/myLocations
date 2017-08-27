import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconCategories from 'material-ui/svg-icons/communication/chat'

const nearbyIcon = <IconLocationOn />;
const categoriesIcon= <IconCategories />;

class Footer extends Component {

    constructor() {
        super();
        this.state = {
            selectedIndex: window.location.pathname === "/locations" ? 1 : 0
        }
    }

    select = index => this.setState({selectedIndex: index});

    render() {
        return (
            <Paper className="footer" zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                    <BottomNavigationItem
                        className="footerButton"
                        label="Categories"
                        icon={categoriesIcon}
                        onClick={() => this.select(0)}
                        containerElement={<Link to="/categories" />}
                    />
                    <BottomNavigationItem
                        className="footerButton"
                        label="Locations"
                        icon={nearbyIcon}
                        onClick={() => this.select(1)}
                        containerElement={<Link to="/locations" />}
                    />
                </BottomNavigation>
            </Paper>
        )
    }

}

export default Footer;