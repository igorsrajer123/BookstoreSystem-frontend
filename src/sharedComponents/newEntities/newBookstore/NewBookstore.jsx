import React, { Component } from 'react';
import './newBookstore.css';
import LoginService from '../../../services/loginService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import BookstoreService from '../../../services/bookstoreService';

export default class NewBookstore extends Component {
    constructor() {
        super();

        this.state = {
            currentName: "",
            currentAddress: "",
            currentCity: "",
            currentPhone: "",
            nameValid: null,
            cityValid: null,
            addressValid: null,
            phoneValid: null
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.submitNewBookstore = this.submitNewBookstore.bind(this);
    }

    handleNameChange = event => this.setState({currentName: event.target.value});

    handleAddressChange = event => this.setState({currentAddress: event.target.value});

    handleCityChange = event => this.setState({currentCity: event.target.value});

    handlePhoneChange = event => this.setState({currentPhone: event.target.value});

    async submitNewBookstore() {
        if(this.state.currentAddress === "")
            this.setState({addressValid: false});
        else
            this.setState({addressValid: true});
        
        if(this.state.currentName === "")
            this.setState({nameValid: false});
        else
            this.setState({nameValid: true});
        
        if(this.state.currentCity === "")
            this.setState({cityValid: false});
        else
            this.setState({cityValid: true});

        if(this.state.currentPhone === "")
            this.setState({phoneValid: false});
        else
            this.setState({phoneValid: true});
        
        if(this.state.nameValid && this.state.addressValid && this.state.cityValid && this.state.phoneValid) {
            const object = {
                name: this.state.currentName,
                address: this.state.currentAddress,
                city: this.state.currentCity,
                contactPhone: this.state.currentPhone
            }

            const response = await BookstoreService.createNewBookstore(object);
            if(response === 201){
                NotificationManager.success("Bookstore successfully created!", "Success!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href="http://localhost:3000/"
            }else {
                NotificationManager.error("Something went wrong!", "Error!");
            }
        }
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";
    }

    render() {
        return (
            <div className="newBookstoreWrapper">
                <NotificationContainer />
                <div className="newBookstoreInfo">
                    <div className="newBookstoreHelper">
                        <span className="newBookstoreLabel">Name</span>
                        <input type="text" 
                                className="newBookstoreInput" 
                                placeholder="Name" 
                                onChange={this.handleNameChange}
                                style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                        borderColor: this.state.nameValid === false ? 'red' : ''}} />
                    </div>
                    <div className="newBookstoreHelper">
                        <span className="newBookstoreLabel">Address</span>
                        <input type="text" 
                                className="newBookstoreInput" 
                                placeholder="Address"
                                onChange={this.handleAddressChange}
                                style={{borderStyle: this.state.addressValid === false ? 'solid' : 'none',
                                        borderColor: this.state.addressValid === false ? 'red' : ''}} />
                    </div>
                </div>
                <div className="newBookstoreInfo">
                    <div className="newBookstoreHelper">
                        <span className="newBookstoreLabel">City</span>
                        <input type="text" 
                                className="newBookstoreInput" 
                                placeholder="City"
                                onChange={this.handleCityChange}
                                style={{borderStyle: this.state.cityValid === false ? 'solid' : 'none',
                                        borderColor: this.state.cityValid === false ? 'red' : ''}} />
                    </div>
                    <div className="newBookstoreHelper">
                        <span className="newBookstoreLabel">Contact Phone</span>
                        <input type="text" 
                                className="newBookstoreInput" 
                                placeholder="Contact Phone" 
                                onChange={this.handlePhoneChange} 
                                style={{borderStyle: this.state.phoneValid === false ? 'solid' : 'none',
                                        borderColor: this.state.phoneValid === false ? 'red' : ''}}/>
                    </div>
                </div>
                <div className="newBookstoreInfo">
                    <div className="newBookstoreHelper">
                        <button className="newBookstoreSave" onClick={this.submitNewBookstore}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}
