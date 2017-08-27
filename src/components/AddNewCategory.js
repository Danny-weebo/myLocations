import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class AddNewCategory extends Component {

    constructor() {
        super();
        this.state = {name: ''}
    }

    handleChange = event => {
        this.setState({name: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.addNewCategory(this.state.name);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="flex">
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                <RaisedButton label="submit" primary={true} onClick={this.handleSubmit} />
            </form> 
        )
    }

}