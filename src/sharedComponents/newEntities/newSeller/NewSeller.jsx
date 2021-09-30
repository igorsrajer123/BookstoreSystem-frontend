import React, { Component } from 'react';
import './newSeller.css';
import DatePicker from 'react-datepicker';
import LoginService from './../../../services/loginService';
import SellerService from './../../../services/sellerService';

export default class NewSeller extends Component {
    constructor() {
        super();

        this.state = {
            currentBirthDate: null,
            currentEmail: "",
            currentFirstName: "",
            currentLastName: "",
            currentPhoneNumber: "",
            currentAddress: "",
            currentCity: "",
            currentPassword: "",
            emailValid: false,
            passwordValid: false,
            firstNameValid: false,
            lastNameValid: false,
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitNewSeller = this.submitNewSeller.bind(this);
    }

    handleDateChange = date => this.setState({currentBirthDate: date});

    handleEmailChange = event => this.setState({currentEmail: event.target.value});

    handleFirstNameChange = event => this.setState({currentFirstName: event.target.value});

    handleLastNameChange = event => this.setState({currentLastName: event.target.value});

    handlePhoneNumberChange = event => this.setState({currentPhoneNumber: event.target.value});

    handleAddressChange = event => this.setState({currentAddress: event.target.value});

    handleCityChange = event => this.setState({currentCity: event.target.value});

    handlePasswordChange = event => this.setState({currentPassword: event.target.value});

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null) 
            window.location.href = "http://localhost:3000/";
    }

    async submitNewSeller() {
        let birthDateString = this.state.currentBirthDate;
        let birthDate = new Date(birthDateString);
        birthDate.setDate(birthDate.getDate() + 1);
        let readableDate = birthDate.toISOString().split('T');

        if(this.state.currentEmail !== "")
            this.setState({emailValid: true});
        else
            this.setState({emailValid: false});
        
        if(this.state.currentPassword !== "")
            this.setState({passwordValid: true});
        else
            this.setState({passwordValid: true});
        
        if(this.state.currentFirstName !== "")
            this.setState({firstNameValid: true});
        else
            this.setState({firstName: false});
        
        if(this.state.currentLastName !== "")
            this.setState({lastNameValid: true});
        else
            this.setState({lastNameValid: false});

        if(this.state.emailValid && this.state.passwordValid && this.state.firstNameValid && this.state.lastNameValid){
            const object = {
                user: {
                    password: this.state.currentPassword,
                    email: this.state.currentEmail,
                    firstName: this.state.currentFirstName,
                    lastName: this.state.currentLastName,
                    phoneNumber: this.state.currentPhoneNumber,
                    address: this.state.currentAddress,
                    city: this.state.currentCity,
                    dateOfBirth: readableDate[0]
                },
                bookstore: {
                    id: 1
                }
            }
            console.log(object);
            const responseStatus = await SellerService.createNewBookstoreSeller(object);
            console.log(responseStatus);
        }
    }

    render() {
        return (
            <div className="newSellerWrapper">
                <div className="newSellerLeft">
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Email</b></span>
                        <input type="text" placeholder="Email" className="newSellerInput" onChange={this.handleEmailChange} />
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Temporary Password</b></span>
                        <input type="password" placeholder="Password" className="newSellerInput" onChange={this.handlePasswordChange} />
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>First Name</b></span>
                        <input type="text" placeholder="First Name" className="newSellerInput" onChange={this.handleFirstNameChange}/>
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Last Name</b></span>
                        <input type="text" placeholder="Last Name" className="newSellerInput" onChange={this.handleLastNameChange} />
                    </div>
                    <div className="dummySellerInfo" >
                    
                    </div>
                </div>
                <div  className="newSellerRight">
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Phone Number</b></span>
                        <input type="text" placeholder="Phone Number" className="newSellerInput" onChange={this.handlePhoneNumberChange} />
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Address</b></span>
                        <input type="text" placeholder="Adress" className="newSellerInput" onChange={this.handleAddressChange} />
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>City</b></span>
                        <input type="text" placeholder="City" className="newSellerInput" onChange={this.handleCityChange}/>
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Birth Date</b></span>
                        <DatePicker placeholderText="Birth Date"
                                        className="newSellerBirthDate" 
                                        onChange={this.handleDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentBirthDate)}/>
                    </div>
                    <div className="saveNewSeller">
                        <button className="saveNewSellerButton" onClick={this.submitNewSeller}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}
