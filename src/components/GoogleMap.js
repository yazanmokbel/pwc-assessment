import React, {Component} from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng,} from 'react-places-autocomplete';
import {RotatingLines} from "react-loader-spinner";

const Loader = () => <RotatingLines
    strokeColor="grey"
    strokeWidth="5"
    animationDuration="0.75"
    width="96"
    visible={true}
/>


export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            isLoading: false,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},

            mapCenter: {
                lat: 49.2827291,
                lng: -123.1207375
            }
        };
    }

    handleChange = address => {
        this.setState({address});
    };

    handleSelect = address => {
        this.setState({isLoading : true})
        this.setState({address});
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng);

                // update center state
                this.setState({mapCenter: latLng});
                this.setState({isLoading : false})
            })
            .catch(error => console.error('Error', error));
    };

    render() {

        return (
            this.state.isLoading  ? <Loader/> :
            <>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div className='input-search'>
                            <input
                                {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: 'location-search-input input-search',
                                })}
                            />
                            <div className="autocomplete-dropdown-container dropdown-list">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active item-list'
                                        : 'suggestion-item item-list';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? {backgroundColor: '#fafafa', cursor: 'pointer'}
                                        : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <span className=''>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
                <div id='googleMaps'>


                    <Map
                        google={this.props.google}
                        initialCenter={{
                            lat: this.state.mapCenter.lat,
                            lng: this.state.mapCenter.lng
                        }}
                        center={{
                            lat: this.state.mapCenter.lat,
                            lng: this.state.mapCenter.lng
                        }}
                    >
                        <Marker
                            position={{
                                lat: this.state.mapCenter.lat,
                                lng: this.state.mapCenter.lng
                            }}/>
                    </Map>
                </div>
            </>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyDbzFMzmELikpbT0uNNsNosVhlpcw8Kido')
})(MapContainer)