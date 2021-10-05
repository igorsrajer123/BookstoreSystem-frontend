import React, { Component } from 'react';
import './newPublisher.css';
import Modal from 'react-modal';
import PublisherService from './../../services/publisherService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class NewPublisherModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            currentName: "",
            currentAddress: "",
            currentCity: "",
            currentPhone: "",
            nameValid: null,
            addressValid: null,
            cityValid: null,
            phoneValid: null
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.savePublisher = this.savePublisher.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.publisher !== this.props.publisher) {
            if(this.props.publisher !== null) {
                this.setState({currentName: this.props.publisher.name});
                this.setState({currentAddress: this.props.publisher.address});
                this.setState({currentCity: this.props.publisher.city});
                this.setState({currentPhone: this.props.publisher.phoneNumber});
            }else {
                this.setState({currentName: ""});
                this.setState({currentAddress: ""});
                this.setState({currentCity: ""});
                this.setState({currentPhone: ""});
            }
        }
    }

    handleNameChange = event => this.setState({currentName: event.target.value});

    handleAddressChange = event => this.setState({currentAddress: event.target.value});

    handleCityChange = event => this.setState({currentCity: event.target.value});

    handlePhoneChange = event => this.setState({currentPhone: event.target.value});

    async savePublisher() {
        let validName = false;
        if(this.state.currentName === "") {
            this.setState({nameValid: false});
            validName = false;
        }else{
            this.setState({nameValid: true});
            validName = true;
        }

        let validAddress = false;
        if(this.state.currentAddress === "") {
            this.setState({addressValid: false});
            validAddress = false;
        }else{
            this.setState({addressValid: true});
            validAddress = true;
        }

        let validCity = false;
        if(this.state.currentCity === "") {
            this.setState({cityValid: false});
            validCity = false;
        }else{
            this.setState({cityValid: true});
            validCity = true;
        }

        let validPhone = false;
        if(this.state.currentPhone === "") {
            this.setState({phoneValid: false});
            validPhone = false;
        }else{
            this.setState({phoneValid: true});
            validPhone = true;
        }

        if(this.props.publisher === null) {
            if(validName && validAddress && validPhone && validCity)
                await this.addNewPublisher();
        }else{ 
            if(validName && validAddress && validPhone && validCity)
                await this.editPublisher();
        }
    }

    async addNewPublisher() {
        const object = {
            name: this.state.currentName,
            address: this.state.currentAddress,
            city: this.state.currentCity,
            phoneNumber: this.state.currentPhone
        }

        const response = await PublisherService.createNewPublisher(object);
        if(response === 201) {
            NotificationManager.success("Publisher successfully saved!", "Success!");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    async editPublisher() {
        const object = {
            id: this.props.publisher.id,
            name: this.state.currentName,
            address: this.state.currentAddress,
            city: this.state.currentCity,
            phoneNumber: this.state.currentPhone
        }

        const response = await PublisherService.editPublisher(object);
        if(response === 200) {
            NotificationManager.success("Publisher successfully saved!", "Success!");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="newPublisherModal">
                <NotificationContainer />
                <div className="newPublisherWrapper">
                    <div className="newPublisherInfo">
                        <span className="newPublisherLabel">Name</span>
                        <input type="text" 
                                className="newPublisherInput"
                                placeholder="Name"
                                value={this.state.currentName}
                                onChange={this.handleNameChange}
                                style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                        borderColor: this.state.nameValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="newPublisherInfo">
                        <span className="newPublisherLabel">Address</span>
                        <input type="text" 
                                className="newPublisherInput"
                                placeholder="Address"
                                value={this.state.currentAddress}
                                onChange={this.handleAddressChange}
                                style={{borderStyle: this.state.addressValid === false ? 'solid' : 'none',
                                        borderColor: this.state.addressValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="newPublisherInfo">
                        <span className="newPublisherLabel">City</span>
                        <input type="text" 
                                className="newPublisherInput"
                                placeholder="City"
                                value={this.state.currentCity}
                                onChange={this.handleCityChange}
                                style={{borderStyle: this.state.cityValid === false ? 'solid' : 'none',
                                        borderColor: this.state.cityValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="newPublisherInfo">
                        <span className="newPublisherLabel">Phone Number</span>
                        <input type="text" 
                                className="newPublisherInput"
                                placeholder="Phone Number"
                                value={this.state.currentPhone}
                                onChange={this.handlePhoneChange}
                                style={{borderStyle: this.state.phoneValid === false ? 'solid' : 'none',
                                        borderColor: this.state.phoneValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="newPublisherInfo">
                        <button className="newPublisherSave" onClick={this.savePublisher}>Save</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
