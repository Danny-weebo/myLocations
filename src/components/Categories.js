import React, { Component } from 'react';
import { connect } from 'react-redux';

import { init, addCategory, removeCategory, editCategory } from '../actions/categories';
import AddNewCategory from './AddNewCategory';
import CategoryList from './CategoryList';
import Header from './Header';
import Footer from './Footer';

import Snackbar from 'material-ui/Snackbar';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusFlag: false,
            statusMsg: "",
            selected: [],
            categories: []
        };
    }

    componentDidMount() {
        this.props.init();
        this.setState({categories: this.props.categories});
    }

    // status handler
    triggerStatus = statusMsg => {
        this.setState({statusFlag: true, statusMsg});
    }

    // on close status
    closeStatus = () => {
        this.setState({statusFlag: false, statusMsg: ""})
    }

    handleRowSelection = selectedRows => {
        let _selectedRows = [];
        // arranging selection to work as expected.
        if(selectedRows === "all") {
            for(let i = 0; i < this.props.categories.length; i++)
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

    addCategory = categoryItem => {

        if(categoryItem === "" || categoryItem === " ") {
            this.triggerStatus('The category must not be empty');
        } else {
            let item = this.props.add(categoryItem);
            if(item.flag) {
                this.setState({categories: this.props.categories});
                this.triggerStatus(categoryItem + ' was added successfuly');                 
            } else
                this.triggerStatus(categoryItem + ' is already exist in the categories list'); 
        }
        this.setState({selected: []});
    }

    removeMultipleCategories = () => {
        if(this.state.selected.length > 0)
            for(let i = 0; i < this.state.selected.length; i++)
                this.removeCategory(this.props.categories[this.state.selected[i]]);
        this.setState({selected: [], categories: this.props.categories});
    }

    removeCategory = catName => {
        if(this.props.remove(catName))
            this.triggerStatus('The category was deleted successfully');
        this.setState({categories: this.props.categories});        
    }

    updateCategory = (oldCat, newCat) => {
        let item = this.props.update(newCat, oldCat);
        if(item.flag) 
            this.triggerStatus('The category was updated successfully');
        else
            this.triggerStatus('Error, category name has to be unique.');
    }
    

    render() {

        return (
            <div>
                <Header />
                <div className="categories">
                    <Snackbar open={this.state.statusFlag} message={this.state.statusMsg} autoHideDuration={4000} onRequestClose={this.closeStatus} />
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <h1 className="wrap">Categories</h1>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>} anchorOrigin={{horizontal: 'left', vertical: 'top'}} targetOrigin={{horizontal: 'left', vertical: 'top'}}>
                                <MenuItem onClick={this.removeMultipleCategories}>Remove selected ({this.state.selected.length})</MenuItem>
                            </IconMenu>
                            <ToolbarSeparator />
                            <label className="newCategory">Add new category: </label>
                            <AddNewCategory addNewCategory={this.addCategory} />
                        </ToolbarGroup>
                    </Toolbar>
                    <CategoryList selected={this.selected} handleRowSelection={this.handleRowSelection} updateCategory={this.updateCategory} removeCategory={this.removeCategory} categories={this.props.categories} />
                </div>
                <Footer />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        categories: state.categories.get('categories')
    };
};
const mapDispatchToProps = dispatch => {
    return {
        init: () => dispatch(init()),
        add: (categoryItem) => dispatch(addCategory(categoryItem)),
        remove: (categoryItem) => dispatch(removeCategory(categoryItem)),
        update: (newCategoryItem, oldCategoryitem) => dispatch(editCategory(newCategoryItem, oldCategoryitem))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);