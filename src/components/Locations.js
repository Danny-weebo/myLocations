import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddNewLocation from './AddNewLocation';
import UpdateLocationItem from './UpdateLocationItem';
import Header from './Header';
import Footer from './Footer';

import { init as initCategories } from '../actions/categories';
import { init as initLocations, addLocation, removeLocation, editLocation } from '../actions/locations';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Chip from 'material-ui/Chip';
import {blue300} from 'material-ui/styles/colors';


import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
  };

class Locations extends Component {

    constructor() {
        super();

        this.state = {
            statusFlag: false,
            statusMsg: "",
            modalUpdatedNewValues: {},            
            modalUpdatedOldValues: {},
            modalUpdateOpen: false,
            modalNewOpen: false,
            groupedByCategory: false,
            selected: [],
            groupedLocations: []
        };

    }

    componentDidMount() {
        // fetching locations
        this.props.initLocations();
        // fetching categories
        this.props.initCategories();
    }

    // sorrting locations for group by view
    sortForGroupBy = () => {
        let groupedLocations = [];
        this.props.categories.forEach((categoryItem) => {
            let categoryItems = {};
            categoryItems.name = categoryItem;
            categoryItems.items = [];

            this.props.locations.map((locationItem, index) => {
                locationItem.category.map((locationItemCategory, _index) => {
                    if(categoryItem === locationItemCategory)
                        return categoryItems.items.push(locationItem);
                    return null;
                });
                return null;
            });

            groupedLocations.push(categoryItems);
        });
        this.setState({groupedLocations});
    }

    // toggle grouped by
    toggleGroupedBy = () => {
        let groupedByCategory = this.state.groupedByCategory ? false : true;

        if(groupedByCategory)
            this.sortForGroupBy();

        this.setState({selected: [], groupedByCategory});
    }

    // status handler
    triggerStatus = statusMsg => {
        this.setState({statusFlag: true, statusMsg});
    }

    // on close status
    closeStatus = () => {
        this.setState({statusFlag: false, statusMsg: ""});
    }

    //  table handlers
    isSelected = index => {
        return this.state.selected.indexOf(index) !== -1;
    };
    
    handleRowSelection = selectedRows => {
        // TableBody is actually managing its own state, whether or not it's technically 'controlled' or not.
        // which causes issues with the selected (while click on the select all checkbox).
        // https://github.com/callemall/material-ui/issues/6413
        let _selectedRows = [];

        if(selectedRows === "all") {
            for(let i = 0; i < this.props.locations.length; i++)
                _selectedRows.push(i);
            this.setState({ selected: _selectedRows });
        } else if(selectedRows === "none") {
                _selectedRows = [];
                this.setState({selected: _selectedRows})
        } else 
            this.setState({
                selected: selectedRows
            });
    };

    // modal functions
    handleModalNewOpen = () => {
        this.setState({selected: [], modalNewOpen: true});
    };

    handleModalNewClose = () => {
        this.setState({modalNewOpen: false});
    };

    handleModalUpdateOpen = values => {
        this.setState({selected: [], modalUpdateOpen: true, modalUpdatedOldValues: values, modalUpdatedNewValues: {}});
    }

    handleModalUpdateClose = () => {
        this.setState({modalUpdateOpen: false, modalUpdatedOldValues: {}, modalUpdatedNewValues: {}});
    }

    handleModalGroupedShowClose = () => {
        this.setState({selected: [], groupedByCategory: false});
    }

    // props for locationsList
    removeMultipleLocations = () => {
        if(this.state.selected.length > 0)
            for(let i = 0; i < this.state.selected.length; i++)
                this.removeLocationItem(this.props.locations[this.state.selected[i]]);
    }
    
    removeLocationItem = (locationItem) => {
        let flag = this.props.removeLocation(locationItem);
        if(flag.flag) {
            this.triggerStatus('The location was removed successfully.');
            if(this.state.groupedByCategory) {
                this.sortForGroupBy();
            }
        } else this.triggerStatus('Something went wrong with the location delete.');
        this.setState({selected: []});
    };

    addLocation = locationItem => {

        this.setState({selected: []}, () => { 
            let flag = this.props.add(locationItem);
            if(flag.flag) {
                this.triggerStatus('The location was add successfully.');
                if(this.state.groupedByCategory)
                    this.sortForGroupBy();
            } else
                this.triggerStatus('The location you are trying to add is already exist.');
        });
              
    }

    updateLocation = (oldLocationItem, newLocationItem) => {
        let flag = this.props.update(newLocationItem, oldLocationItem);
        if(flag.flag) {
            this.triggerStatus('The location was updated successfully.');
            if(this.state.groupedByCategory) {
                this.sortForGroupBy();
            }
        } else {
            this.triggerStatus("Something went wrong with you'r update.");
        }
        this.setState({selected: []});
    }

    render() {
        // list of categories
        const categoriesList = [];
        this.props.categories.forEach((cat, index) => {
            categoriesList.push(<MenuItem key={index} value={cat} primaryText={cat} />,);
        });

        return (
            <div>
                <Header />

                <Snackbar open={this.state.statusFlag} message={this.state.statusMsg} autoHideDuration={4000} onRequestClose={this.closeStatus} />

                <Dialog title="Add new location" autoScrollBodyContent={true} modal={false} open={this.state.modalNewOpen} onRequestClose={this.handleModalNewClose} className="biggerModal" contentStyle={customContentStyle}>
                    <AddNewLocation addLocation={this.addLocation} handleModalNewClose={this.handleModalNewClose} categories={categoriesList} />
                </Dialog>

                <Dialog title="Update location item" autoScrollBodyContent={true} modal={false} open={this.state.modalUpdateOpen} onRequestClose={this.handleModalUpdateClose} className="biggerModal" contentStyle={customContentStyle}>
                    <UpdateLocationItem updateLocation={this.updateLocation} handleModalUpdateClose={this.handleModalUpdateClose} categories={categoriesList} categoriesArray={this.props.categories} values={this.state.modalUpdatedOldValues} />
                </Dialog>

                <Dialog title="Grouped by categories view" autoScrollBodyContent={true} modal={false} onRequestClose={this.handleModalGroupedShowClose} open={this.state.groupedByCategory} className="biggerModal" contentStyle={customContentStyle}>
                    {this.state.groupedLocations.map((item, index) => (
                        <Table className="test" key={index} multiSelectable={false} allRowsSelected={false} selectable={false} onRowSelection={this.handleRowSelection}>
                        <TableHeader displaySelectAll={true}>
                            <TableRow>
                                <TableHeaderColumn colSpan="5" tooltip={item.name} style={{textAlign: 'center'}}>
                                    <b>{item.name}</b>
                                </TableHeaderColumn>
                            </TableRow>
                            <TableRow className="groupedTrow">
                                <TableHeaderColumn className="show">ID</TableHeaderColumn>
                                <TableHeaderColumn className="show"><b>Name</b></TableHeaderColumn>
                                <TableHeaderColumn className="show">Address</TableHeaderColumn>
                                <TableHeaderColumn className="show">Coordinates</TableHeaderColumn>
                                <TableHeaderColumn className="show">Category</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="groupedTbody" deselectOnClickaway={false}  stripedRows={true} >
                            {item.items.map((locationItem, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn>{index}</TableRowColumn>
                                    <TableRowColumn>{locationItem.name}</TableRowColumn>
                                    <TableRowColumn>{locationItem.address}</TableRowColumn>                                
                                    <TableRowColumn>{locationItem.lat},{locationItem.lng}</TableRowColumn>                                
                                    <TableRowColumn>{Array.isArray(locationItem.category) ? locationItem.category.map((item, index) => <Chip key={index} className="chip" backgroundColor={blue300}>{item}</Chip>) : locationItem.category}</TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    ))}
                    <br />
                    <FlatButton label="Close" primary={false} onClick={this.toggleGroupedBy} className="footerForm" />
                </Dialog>

                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <h1 className="wrap">Locations</h1>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>} anchorOrigin={{horizontal: 'left', vertical: 'top'}} targetOrigin={{horizontal: 'left', vertical: 'top'}}>
                            <MenuItem onClick={this.removeMultipleLocations}>Remove selected ({this.state.selected.length})</MenuItem>
                            <MenuItem primaryText="Grouped by category modal" onClick={this.toggleGroupedBy} />
                        </IconMenu>
                        <ToolbarSeparator />
                        <RaisedButton label="Add new location" primary={true} onClick={this.handleModalNewOpen} />
                    </ToolbarGroup>
                </Toolbar>

                <Table multiSelectable={true} allRowsSelected={false} selectable={true} onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={true}>
                        <TableRow>
                            <TableHeaderColumn className="show">ID</TableHeaderColumn>
                            <TableHeaderColumn className="show"><b>Name</b></TableHeaderColumn>
                            <TableHeaderColumn className="show">Address</TableHeaderColumn>
                            <TableHeaderColumn className="show">Coordinates</TableHeaderColumn>
                            <TableHeaderColumn className="show">Category</TableHeaderColumn>
                            <TableHeaderColumn>Manage</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}  stripedRows={true}>
                        {this.props.locations.map((locationItem, index) => (
                            <TableRow key={index} selected={this.isSelected(index)}>
                                <TableRowColumn>{index}</TableRowColumn>
                                <TableRowColumn>{locationItem.name}</TableRowColumn>
                                <TableRowColumn>{locationItem.address}</TableRowColumn>                                
                                <TableRowColumn>{locationItem.lat},{locationItem.lng}</TableRowColumn>                                
                                <TableRowColumn>{Array.isArray(locationItem.category) ? locationItem.category.map((item, index) => <Chip key={index} className="chip" backgroundColor={blue300} labelColor="white">{item}</Chip>) : locationItem.category}</TableRowColumn>                                
                                <TableRowColumn><FlatButton label="Update" primary={true} onClick={() => {this.handleModalUpdateOpen(locationItem)}} /><FlatButton label="Remove" secondary={true} onClick={() => {this.removeLocationItem(locationItem)}} /></TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories.get('categories'),
        locations: state.locations.get('locations')
    };
};
const mapDispatchToProps = dispatch => {
    return {
        initCategories: () => dispatch(initCategories()),
        initLocations: () => dispatch(initLocations()),
        add: (locationItem) => dispatch(addLocation(locationItem)),
        removeLocation: (locationItem) => dispatch(removeLocation(locationItem)),
        update: (newLocationItem, oldLocationItem) => dispatch(editLocation(newLocationItem, oldLocationItem))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Locations);