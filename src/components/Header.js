import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Header extends Component {

    render() {
        return (
            <AppBar title="MyLocations" iconElementRight={<div />} iconElementLeft={<div />} />
        )
    }

}

export default Header;