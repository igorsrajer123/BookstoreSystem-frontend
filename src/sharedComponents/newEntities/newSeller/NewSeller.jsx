import React, { Component } from 'react';
import './newSeller.css';
import DatePicker from 'react-datepicker';
import LoginService from './../../../services/loginService';
import SellerService from './../../../services/sellerService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import UserService from './../../../services/userService';
import ReactTooltip from 'react-tooltip';
import BookstoreService from './../../../services/bookstoreService';
import BookstoreAdministratorService from '../../../services/bookstoreAdministratorService';

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
            emailValid: null,
            passwordValid: null,
            firstNameValid: null,
            lastNameValid: null,
            currentBookstore: null
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
        if(currentUser === null || currentUser.type === "ROLE_SELLER"
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SYSTEM_ADMIN") 
            window.location.href = "http://localhost:3000/";
        
        const admin = await BookstoreAdministratorService.getBookstoreAdministratorByUserId(currentUser.id);
        const bookstore = await BookstoreService.getBookstoreByAdminId(admin.id);
        this.setState({currentBookstore: bookstore});
    }

    async submitNewSeller() {
        let birthDateString = this.state.currentBirthDate;
        let birthDate = new Date(birthDateString);
        birthDate.setDate(birthDate.getDate() + 1);
        let readableDate = birthDate.toISOString().split('T');

        const status = await UserService.checkIfEmailTaken(this.state.currentEmail);
        if(status === 200)
            NotificationManager.error("Email already taken!", "Error!");

        if(this.state.currentEmail !== "" && status !== 200)
            this.setState({emailValid: true});
        else
            this.setState({emailValid: false});
        
        if(this.state.currentPassword !== "")
            this.setState({passwordValid: true});
        else
            this.setState({passwordValid: false});
        
        if(this.state.currentFirstName !== "")
            this.setState({firstNameValid: true});
        else
            this.setState({firstNameValid: false});
        
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
                    id: this.state.currentBookstore.id
                }
            }

            const responseStatus = await SellerService.createNewBookstoreSeller(object);
            if(responseStatus === 201) {
                NotificationManager.success("Bookstore seller successfully created!", "Success!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                    window.location.href="http://localhost:3000/"
            }else
                NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="newSellerWrapper">
                <div className="newSellerLeft">
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Email</b></span>
                        <input type="text" 
                                placeholder="Email" 
                                className="newSellerInput" 
                                onChange={this.handleEmailChange} 
                                style={{borderStyle: this.state.emailValid === true || this.state.emailValid === null ? 'none' : 'solid',
                                        borderColor: this.state.emailValid === true || this.state.emailValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongEmail"/>
                        <ReactTooltip id="wrongEmail" 
                                            type="error" 
                                            disable={this.state.currentEmail === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore seller's email!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Temporary Password</b></span>
                        <input type="password" 
                                placeholder="Password" 
                                className="newSellerInput" 
                                onChange={this.handlePasswordChange} 
                                style={{borderStyle: this.state.passwordValid === true || this.state.passwordValid === null ? 'none' : 'solid',
                                        borderColor: this.state.passwordValid === true || this.state.passwordValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongPassword"/>
                        <ReactTooltip id="wrongPassword" 
                                            type="error" 
                                            disable={this.state.currentPassword === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore seller's temporary password!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>First Name</b></span>
                        <input type="text" 
                                placeholder="First Name" 
                                className="newSellerInput" 
                                onChange={this.handleFirstNameChange}
                                style={{borderStyle: this.state.firstNameValid === true || this.state.firstNameValid === null ? 'none' : 'solid',
                                        borderColor: this.state.firstNameValid === true || this.state.firstNameValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongFirstName"/>
                        <ReactTooltip id="wrongFirstName" 
                                            type="error" 
                                            disable={this.state.currentFirstName === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore seller's first name!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newSellerInfo" >
                        <span className="newSellerLabel"><b>Last Name</b></span>
                        <input type="text" 
                                placeholder="Last Name" 
                                className="newSellerInput" 
                                onChange={this.handleLastNameChange}
                                style={{borderStyle: this.state.lastNameValid === true || this.state.lastNameValid === null ? 'none' : 'solid',
                                        borderColor: this.state.lastNameValid === true || this.state.lastNameValid === null ? 'none' : 'red'}} 
                                data-tip data-for="wrongLastName" />
                        <ReactTooltip id="wrongLastName" 
                                            type="error" 
                                            disable={this.state.currentLastName === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore seller's last name!</span>
                        </ReactTooltip>
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
                <NotificationContainer />
            </div>
        )
    }
}
