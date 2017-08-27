import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';

import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const ReactGoogleMap = withGoogleMap(props => (
    <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 31.76816443858058, lng: 35.21324157714844 }}
    onClick={props.onMapClick}>
        {props.markers.map(marker => (
            <Marker {...marker} />
        ))}
    </GoogleMap>
));


export default class UpdateLocationItem extends Component {

    constructor(props) {
        super(props);

        this.state = {          
            location_name: this.props.values.name,
            location_address: this.props.values.address,
            location_lat: this.props.values.lat,
            location_lng: this.props.values.lng,
            location_category: this.props.values.category,
            markers: [{
                position: {
                    lat: this.props.values.lat,
                    lng: this.props.values.lng
                },
                key: Date.now(),
                defaultAnimation: 2
            }]
        }

    }

    handleMapClick = event => {
        this.setState({
            location_lat: event.latLng.lat(), 
            location_lng: event.latLng.lng(),
            markers: [{
                position: event.latLng,
                defaultAnimation: 2,
                key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
            }]
        });
    }

    handleChange = (item, value) => {

        switch(item.target.name) {
            case 'name':
                this.setState({location_name: value})
            break;
            case 'address':
                this.setState({location_address: value})
            break;
            case 'lat':
                this.setState({location_lat: value})
            break;
            case 'lng':
                this.setState({location_lng: value})
            break;
            case 'category':
                this.setState({location_category: value})
            break;
            default: 
            break;
        }

    }


    checkCategoriesExist = selectedCategories => {
        let _categories = [];

        selectedCategories.map((catName) => {
            this.props.categoriesArray.map((cat) => {
                if(catName === cat)
                    return _categories.push(catName);

                return null;
            });
            return null;
        });

        return _categories;
    }

    handleCategoryChange = (event, index, value) => {

        value = this.checkCategoriesExist(value);
        this.setState({location_category: value});
        
    }

    handleSubmit = event => {
        event.preventDefault();

        if(this.state.location_category.length === 0 || this.state.location_name === "" || this.state.location_address === ""  || this.state.location_lat === "" || this.state.location_lng === "") {
            alert('You must fill all the fields.');
        } else {
            this.props.updateLocation(this.props.values, {
                "name": this.state.location_name,
                "address": this.state.location_address,
                "lat": this.state.location_lat,
                "lng": this.state.location_lng,
                "category": this.checkCategoriesExist(this.state.location_category)
            });
            this.props.handleModalUpdateClose();
        }

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <section className="halfHalf">
                    
                    <section className="halfLeft">
                        <TextField hintText="Name" name="name" errorText="This field is required" fullWidth={true} value={this.state.location_name} onChange={this.handleChange} /><br />
                        <TextField hintText="Address" name="address" errorText="This field is required" fullWidth={true} value={this.state.location_address} onChange={this.handleChange} /><br />
                        <TextField hintText="Lat" name="location_lat" errorText="This field is required" fullWidth={true} value={this.state.location_lat} onChange={this.handleChange} />
                        <TextField hintText="Lng" name="location_lng" errorText="This field is required" fullWidth={true} value={this.state.location_lng} onChange={this.handleChange} />
                        <SelectField multiple={true} floatingLabelText="Category" value={this.state.location_category} onChange={this.handleCategoryChange}>
                            {this.props.categories}
                        </SelectField>
                    </section>
                    <section className="halfRight">
                        <ReactGoogleMap
                        containerElement={<div style={{ height: `100%` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        onMapClick={this.handleMapClick}
                        markers={this.state.markers}
                        />
                    </section>

                </section>
                
                <br /><br />

                <div className="footerForm">
                    <FlatButton label="Cancel" primary={true} onClick={() => {this.props.handleModalUpdateClose()}} />
                    <FlatButton label="Submit" primary={true} keyboardFocused={true} onClick={this.handleSubmit} />
                </div>
            </form>
        )
    }

}