import React, { Component } from 'react';
import './editBookstore.css';
import Modal from 'react-modal';
import LoginService from './../../services/loginService';
import BookstoreService from './../../services/bookstoreService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class EditBookstoreModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            currentUser: null,
            currentBookstore: null,
            currentName: "",
            currentCity: "",
            currentAddress: "",
            currentPhone: "",
            bookstoreNameValid: true,
            bookstoreAddressValid: true,
            bookstoreCityValid: true,
            bookstorePhoneValid: true
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.updateBookstore = this.updateBookstore.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});

        if(this.props.bookstore !== null){
            this.setState({currentName: this.props.bookstore.name});
            this.setState({currentAddress: this.props.bookstore.address});
            this.setState({currentCity: this.props.bookstore.city});
            this.setState({currentPhone: this.props.bookstore.contactPhone});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.bookstore !== this.props.bookstore) {
            this.setState({currentBookstore: this.props.bookstore});
            this.setState({currentName: this.props.bookstore.name});
            this.setState({currentAddress: this.props.bookstore.address});
            this.setState({currentCity: this.props.bookstore.city});
            this.setState({currentPhone: this.props.bookstore.contactPhone});
        }
    }

    async updateBookstore() {
        if(this.state.bookstoreNameValid && this.state.bookstoreAddressValid && this.state.bookstoreCityValid && this.state.bookstorePhoneValid) {
            const object = {
                id: this.props.bookstore.id,
                name: this.state.currentName,
                address: this.state.currentAddress,
                city: this.state.currentCity,
                contactPhone: this.state.currentPhone
            }
    
            const status = await BookstoreService.updateBookstore(object);
            if(status === 200) {
                NotificationManager.success("Bookstore updated successfully!", "Update Successful!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.reload();
            }
            else 
                NotificationManager.error("Something went wrong!", "Update Failed!");
        }
    }

    handleNameChange = event => {
        this.setState({currentName: event.target.value});
        if(event.target.value.length === 0)
            this.setState({bookstoreNameValid: false});
        else
            this.setState({bookstoreNameValid: true});
    }

    handleAddressChange = event => {
        this.setState({currentAddress: event.target.value});
        if(event.target.value.length === 0)
            this.setState({bookstoreAddressValid: false});
        else
            this.setState({bookstoreAddressValid: true});
    }

    handleCityChange = event => {
        this.setState({currentCity: event.target.value});
        if(event.target.value.length === 0)
            this.setState({bookstoreCityValid: false});
        else
            this.setState({bookstoreCityValid: true});
    }

    handlePhoneChange = event => {
        this.setState({currentPhone: event.target.value});
        if(event.target.value.length === 0)
            this.setState({bookstorePhoneValid: false});
        else
            this.setState({bookstorePhoneValid: true});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editBookstoreModal">
                <div className="editBookstoreWrapper">
                        <NotificationContainer />
                        <div className="editBookstoreOption">
                            <span className="editBookstoreLabel">Name</span>
                            <input type="text" 
                                    className="editBookstoreInput" 
                                    placeholder="Name" 
                                    onChange={this.handleNameChange}
                                    value={this.state.currentName}
                                    style={{borderStyle: this.state.bookstoreNameValid ? 'none': 'solid',
                                            borderColor: this.state.bookstoreNameValid ? '' : 'red'}} />
                        </div>
                        <div className="editBookstoreOption">
                            <span className="editBookstoreLabel">Address</span>
                            <input type="text" 
                                    className="editBookstoreInput" 
                                    placeholder="Address"
                                    onChange={this.handleAddressChange}
                                    value={this.state.currentAddress}
                                    style={{borderStyle: this.state.bookstoreAddressValid ? 'none': 'solid',
                                            borderColor: this.state.bookstoreAddressValid ? '' : 'red'}}/>
                        </div>
                        <div className="editBookstoreOption">
                            <span className="editBookstoreLabel">City</span>
                            <input type="text" 
                                    className="editBookstoreInput" 
                                    placeholder="City"
                                    onChange={this.handleCityChange}
                                    value={this.state.currentCity}
                                    style={{borderStyle: this.state.bookstoreCityValid ? 'none': 'solid',
                                            borderColor: this.state.bookstoreCityValid ? '' : 'red'}}/>
                        </div>
                        <div className="editBookstoreOption">
                            <span className="editBookstoreLabel">Contact Phone</span>
                            <input type="text" 
                                    className="editBookstoreInput"
                                    placeholder="Contact Phone"
                                    onChange={this.handlePhoneChange}
                                    value={this.state.currentPhone}
                                    style={{borderStyle: this.state.bookstorePhoneValid ? 'none': 'solid',
                                            borderColor: this.state.bookstorePhoneValid ? '' : 'red'}} />
                        </div>
                        <div className="editBookstoreSave">
                            <button className="editBookstoreSaveButton" onClick={this.updateBookstore}>Save Changes</button>
                        </div>
                </div>
            </Modal>
        )
    }
}
