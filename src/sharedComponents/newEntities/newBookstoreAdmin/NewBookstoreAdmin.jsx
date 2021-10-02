import React, { Component } from 'react';
import './newBookstoreAdmin.css';
import DatePicker from 'react-datepicker';
import LoginService from './../../../services/loginService';
import BookstoreService from './../../../services/bookstoreService';
import BookstoreAdministratorService from './../../../services/bookstoreAdministratorService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import UserService from './../../../services/userService';
import ReactTooltip from 'react-tooltip';

export default class NewBookstoreAdmin extends Component {
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
            bookstoreValid: null,
            allBookstores: [],
            currentBookstoreId: 0
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.submitNewAdmin = this.submitNewAdmin.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleBookstoreChange = this.handleBookstoreChange.bind(this);
    }

    handleEmailChange = event => this.setState({currentEmail: event.target.value});

    handleFirstNameChange = event => this.setState({currentFirstName: event.target.value});

    handleLastNameChange = event => this.setState({currentLastName: event.target.value});

    handlePhoneNumberChange = event => this.setState({currentPhoneNumber: event.target.value});

    handleAddressChange = event => this.setState({currentAddress: event.target.value});

    handleCityChange = event => this.setState({currentCity: event.target.value});

    handleDateChange = date => this.setState({currentBirthDate: date});

    handlePasswordChange = event => this.setState({currentPassword: event.target.value});

    handleBookstoreChange = event => {
        this.setState({currentBookstoreId: event.target.value});
        if(event.target.value !== '')
            this.setState({bookstoreValid: true})
        else
            this.setState({bookstoreValid: false});
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";
        
        const allBookstores = await BookstoreService.getAllBookstores();
        this.setState({allBookstores: allBookstores});
    }

    async submitNewAdmin() {
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

        if(this.state.emailValid && this.state.passwordValid && this.state.firstNameValid && this.state.lastNameValid && this.state.bookstoreValid){
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
                    id: this.state.currentBookstoreId
                }
            }
            
            const responseStatus = await BookstoreAdministratorService.createNewBookstoreAdmin(object);
            if(responseStatus === 201) {
                NotificationManager.success("Bookstore admin successfully created!", "Success!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href="http://localhost:3000/"
            }else 
                NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="newBookstoreAdminWrapper">
                <div className="newBookstoreAdminLeft">
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Email</b></span>
                        <input type="text" 
                                placeholder="Email" 
                                className="newBookstoreAdminInput" 
                                onChange={this.handleEmailChange} 
                                style={{borderStyle: this.state.emailValid === true || this.state.emailValid === null ? 'none' : 'solid',
                                        borderColor: this.state.emailValid === true || this.state.emailValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongEmail" />
                        <ReactTooltip id="wrongEmail" 
                                            type="error" 
                                            disable={this.state.currentEmail === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore admin's email!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Temporary Password</b></span>
                        <input type="password" 
                                placeholder="Password" 
                                className="newBookstoreAdminInput" 
                                onChange={this.handlePasswordChange}
                                style={{borderStyle: this.state.passwordValid === true || this.state.passwordValid === null ? 'none' : 'solid',
                                        borderColor: this.state.passwordValid === true || this.state.passwordValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongPassword"/>
                        <ReactTooltip id="wrongPassword" 
                                            type="error" 
                                            disable={this.state.currentPassword === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore admin's temporary password!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>First Name</b></span>
                        <input type="text" 
                                placeholder="First Name" 
                                className="newBookstoreAdminInput" 
                                onChange={this.handleFirstNameChange}
                                style={{borderStyle: this.state.firstNameValid === true || this.state.firstNameValid === null ? 'none' : 'solid',
                                        borderColor: this.state.firstNameValid === true || this.state.firstNameValid === null ? 'none' : 'red'}}
                                data-tip data-for="wrongFirstName" />
                        <ReactTooltip id="wrongFirstName" 
                                            type="error" 
                                            disable={this.state.currentFirstName === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore admin's first name!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Last Name</b></span>
                        <input type="text" 
                                placeholder="Last Name" 
                                className="newBookstoreAdminInput" 
                                onChange={this.handleLastNameChange} 
                                style={{borderStyle: this.state.lastNameValid === true || this.state.lastNameValid === null ? 'none' : 'solid',
                                        borderColor: this.state.lastNameValid === true || this.state.lastNameValid === null ? 'none' : 'red'}} 
                                data-tip data-for="wrongLastName"/>
                        <ReactTooltip id="wrongLastName" 
                                            type="error" 
                                            disable={this.state.currentLastName === '' ? false : true}
                                            place="top" 
                                            effect="solid">
                            <span>Please enter bookstore admin's last name!</span>
                        </ReactTooltip>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Phone Number</b></span>
                        <input type="text" placeholder="Phone Number" className="newBookstoreAdminInput" onChange={this.handlePhoneNumberChange} />
                    </div>
                </div>
                <div  className="newBookstoreAdminRight">
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Address</b></span>
                        <input type="text" placeholder="Adress" className="newBookstoreAdminInput" onChange={this.handleAddressChange}/>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>City</b></span>
                        <input type="text" placeholder="City" className="newBookstoreAdminInput" onChange={this.handleCityChange} />
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Birth Date</b></span>
                        <DatePicker placeholderText="Birth Date"
                                        className="newBookstoreAdminBirthDate" 
                                        onChange={this.handleDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentBirthDate)}/>
                    </div>
                    <div className="newBookstoreAdminInfo" >
                        <span className="newBookstoreAdminLabel"><b>Bookstore</b></span>
                        <select className="selectAdminsBookstore" onChange={this.handleBookstoreChange}>
                            <option defaultValue="0"> </option>
                            {this.state.allBookstores.map(b => (
                                <option key={b.id} value={b.id}>{b.name}({b.address}, {b.city})</option>
                            ))};
                        </select>
                    </div>
                    <div className="saveNewBookstoreAdmin">
                        <button className="saveNewBookstoreAdminButton" onClick={this.submitNewAdmin}>Save</button>
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
