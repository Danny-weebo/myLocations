import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class CategoryList extends Component {

    constructor(props){
        super(props);

        this.state = {
            showModal: false,
            currentFieldValue: "",
            oldValue: "",
            selected: []
        };

    }

    //  table handlers
    isSelected = index => {
        return this.state.selected.indexOf(index) !== -1;
    };
    
    handleRowSelection = selectedRows => {
        this.setState({
            selected: selectedRows,
        });
        this.props.handleRowSelection(selectedRows);
    };

    removeThisCategory = event => {
        this.props.removeCategory(event);
    }

    dataChanged = (oldItem, newItem) => { // final update function
        this.props.updateCategory(oldItem, newItem);
    }

    handleOpenModal = item => {
        this.setState({ showModal: true, oldValue: item, currentFieldValue: item });
    }
    
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    saveAndClose = event => {
        event.preventDefault();
        this.dataChanged(this.state.oldValue, this.state.currentFieldValue);
        this.setState({ showModal: false });
    }

    handleChange = event => {
        this.setState({currentFieldValue: event.target.value});
    }



    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleCloseModal}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={this.saveAndClose}
            />
        ];
        return (
            <div>

                <Dialog title="Edit modal" actions={actions} modal={false} open={this.state.showModal} onRequestClose={this.handleCloseModal}>
                    <form action="" onSubmit={this.saveAndClose}>
                        <TextField hintText="Category name" errorText="This field is required" fullWidth={true} value={this.state.currentFieldValue} onChange={this.handleChange} />
                    </form>
                </Dialog>

                <Table multiSelectable={true} allRowsSelected={false} selectable={true} onRowSelection={this.handleRowSelection}>
                    
                    <TableHeader displaySelectAll={true}>
                        <TableRow>
                            <TableHeaderColumn className="show">ID</TableHeaderColumn>
                            <TableHeaderColumn className="show"><b>Name</b></TableHeaderColumn>
                            <TableHeaderColumn className="show">Managing options</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>

                    <TableBody deselectOnClickaway={false} stripedRows={true}>
                        {Array.isArray(this.props.categories) ? this.props.categories.map((item, index) => (
                            <TableRow key={index} selected={this.isSelected(index)}>
                                <TableRowColumn>{index}</TableRowColumn>
                                <TableRowColumn><b>{item}</b></TableRowColumn>
                                <TableRowColumn><FlatButton label="Update" primary={true} onClick={() => {this.handleOpenModal(item)}} /><FlatButton label="Remove" secondary={true} onClick={() => {this.removeThisCategory(item)}} /></TableRowColumn>
                            </TableRow>
                        )) : <TableRow />}
                    </TableBody>

                </Table>
            </div>
        )
    }

}