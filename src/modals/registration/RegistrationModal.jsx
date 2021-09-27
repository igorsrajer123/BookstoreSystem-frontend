import React, { Component } from 'react';
import Modal from 'react-modal';
import './registration.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RegistrationService from '../../services/registrationService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactTooltip from 'react-tooltip';

export default class RegistrationModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            address: "",
            city: "",
            birthDate: null,
            validFirstName: true,
            validLastName: true,
            validEmail: true,
            passwordsDoNotMatch: false,
            passwordTooShort: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.firstNameInputChange = this.firstNameInputChange.bind(this);
        this.lastNameInputChange = this.lastNameInputChange.bind(this);
        this.emailInputChange = this.emailInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.confirmPasswordInputChange = this.confirmPasswordInputChange.bind(this);
        this.phoneNumberInputChange = this.phoneNumberInputChange.bind(this);
        this.addressInputChange = this.addressInputChange.bind(this);
        this.cityInputChange = this.cityInputChange.bind(this);
        this.registration = this.registration.bind(this);
    }

    async registration() {
        let passwordsDoNotMatch = true;
        let passwordTooShort = true;
        let emailValid = false;
        let firstNameValid = false;
        let lastNameValid = false;

        if(this.state.password !== "" && this.state.password > 3){
            passwordTooShort = false;
            this.setState({passwordTooShort: passwordTooShort});
            if(this.state.password === this.state.confirmPassword){
                passwordsDoNotMatch = false
                this.setState({passwordsDoNotMatch: passwordsDoNotMatch});
            }else {
                passwordsDoNotMatch = true
                this.setState({passwordsDoNotMatch: passwordsDoNotMatch});
                NotificationManager.error("Passwords must match!", "Error!");
            }
        }else{
            passwordTooShort = true;
            this.setState({passwordTooShort: passwordTooShort});
        }

        if(this.state.firstName !== ""){
            firstNameValid = true;
            this.setState({validFirstName: firstNameValid});
        }else{
            firstNameValid = false;
            this.setState({validFirstName: firstNameValid});
        }

        if(this.state.lastName !== ""){
            lastNameValid = true;
            this.setState({validLastName: lastNameValid});
        }else{
            lastNameValid = false;
            this.setState({validLastName: lastNameValid});
        }

        const userExists = await RegistrationService.checkUserExists(this.state.email);
        if(this.state.email !== "" && !userExists){
            emailValid = true;
            this.setState({validEmail: emailValid});
        }else{
            emailValid = false;
            this.setState({validEmail: emailValid});
        }

        if(firstNameValid && lastNameValid && !passwordTooShort && emailValid && !passwordsDoNotMatch) {
            const object = {
                dateOfBirth: this.state.birthDate,
                phoneNumber: this.state.phoneNumber,
                city: this.state.city,
                address: this.state.address,
                user: {
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName
                }
            };

            await RegistrationService.registration(object);
            await RegistrationService.sendAccountConfirmation(object.user.email);
            NotificationManager.success("Confirmation mail has been sent to " + object.user.email, "Registration Successfull!");
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.reload();
        }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    firstNameInputChange = event => this.setState({firstName : event.target.value});

    lastNameInputChange = event => this.setState({lastName : event.target.value});

    handleDateChange = date => this.setState({birthDate: date});

    emailInputChange = event => this.setState({email : event.target.value});

    passwordInputChange = event => this.setState({password : event.target.value});

    confirmPasswordInputChange = event => this.setState({confirmPassword : event.target.value});

    phoneNumberInputChange = event => this.setState({phoneNumber : event.target.value});

    addressInputChange = event => this.setState({address : event.target.value});

    cityInputChange = event => this.setState({city : event.target.value});

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="registrationModal">
                <div className="registrationWrapper">
                    <NotificationContainer />
                    <div className="registrationTop">
                        <h1 className="registrationTitle">User Registration</h1>
                        <p className="registrationDescription">
                            <b>Create new account fast and easy!</b><br/>
                            <i style={{color: 'black'}}>Fill out all the empty fields below.*</i>
                        </p>
                    </div>
                    <div className="registrationBottom">
                        <div className="registrationFullName">
                            <input type="text" 
                                    placeholder="First Name*" 
                                    className="registrationInput" 
                                    onChange={this.firstNameInputChange} 
                                    style={{border: this.state.validFirstName ? '' : 'solid red'}}
                                    data-tip data-for="wrongFirstName" />
                            <ReactTooltip id="wrongFirstName" 
                                            type="error" 
                                            disable={this.state.validFirstName ? true : false}
                                            place="top" 
                                            effect="solid">
                                <span>Please enter your first name!</span>
                            </ReactTooltip>
                            <input type="text" 
                                    placeholder="Last Name*" 
                                    className="registrationInput" 
                                    onChange={this.lastNameInputChange} 
                                    style={{border: this.state.validLastName ? '' : 'solid red'}}
                                    data-tip data-for="wrongLastName" />
                            <ReactTooltip id="wrongLastName" 
                                            type="error" 
                                            disable={this.state.validLastName ? true : false}
                                            place="top" 
                                            effect="solid">
                                <span>Please enter your last name!</span>
                            </ReactTooltip>
                        </div>
                        <div className="registrationCredentials">
                            <input type="text" 
                                    placeholder="Email*" 
                                    className="registrationInput" 
                                    onChange={this.emailInputChange} 
                                    style={{border: this.state.validEmail ? '' : 'solid red'}}
                                    data-tip data-for="wrongEmail"/>
                            <ReactTooltip id="wrongEmail" 
                                            type="error" 
                                            disable={this.state.validEmail ? true : false}
                                            place="top" 
                                            effect="solid">
                                <span>Invalid email!</span>
                            </ReactTooltip>
                            <input type="password" 
                                    placeholder="Password*" 
                                    className="registrationInput" 
                                    onChange={this.passwordInputChange} 
                                    style={{border: this.state.passwordTooShort ? 'solid red' : ''}} 
                                    data-tip data-for="wrongPassword"/>
                            <ReactTooltip id="wrongPassword" 
                                            type="error" 
                                            disable={this.state.passwordTooShort ? false : true}
                                            place="top" 
                                            effect="solid">
                                <span>Password must be at least 4 characters long!</span>
                            </ReactTooltip>        
                            <input type="password" 
                                    placeholder="Confirm Password*" 
                                    className="registrationInput" 
                                    onChange={this.confirmPasswordInputChange} 
                                    style={{border: this.state.passwordsDoNotMatch ? 'solid red' : ''}}
                                    data-tip data-for="passwordsDontMatch"/>
                            <ReactTooltip id="passwordsDontMatch" 
                                            type="error" 
                                            disable={this.state.passwordsDoNotMatch ? false : true}
                                            place="top" 
                                            effect="solid">
                                <span>Passwords must match!</span>
                            </ReactTooltip>
                        </div>
                        <div className="registrationOtherInfo">
                            <input type="text" placeholder="Phone Number" className="registrationInput" onChange={this.phoneNumberInputChange} />
                            <input type="text" placeholder="Address" className="registrationInput" onChange={this.addressInputChange} />
                            <input type="text" placeholder="City" className="registrationInput" onChange={this.cityInputChange} />
                            <DatePicker placeholderText="Birth Date"
                                        className="registrationDate" 
                                        onChange={this.handleDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={this.state.birthDate} />
                        </div>
                        <div className="registrationDone">
                            <button className="register" onClick={this.registration}>Register</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
