import React, { Component } from 'react';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';
import './userProfile.css';
import NoImage from './../../assets/noimg.webp';
import DatePicker from 'react-datepicker';

export default class userProfile extends Component {
    constructor() {
        super();

        this.state = {
            currentUser: null,
            profilePhoto: null,
            action: "",
            hideUploadButton: true,
            currentId: 0,
            currentEmail: "",
            currentFirstName: "",
            currentLastName: "",
            currentPhoneNumber: "",
            currentAddress: "",
            currentCity: "",
            currentBirthDate: ""
        }

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.updateUserInformation = this.updateUserInformation.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null){
            this.setState({currentUser: null});
            this.setState({action: ""});
            window.location.href = "http://localhost:3000/";
        }else{
            this.setState({currentId: currentUser.id});
            this.setState({currentEmail: currentUser.email});
            this.setState({currentFirstName: currentUser.firstName});
            this.setState({currentLastName: currentUser.lastName});
            this.setState({currentPhoneNumber: currentUser.phoneNumber});
            this.setState({currentAddress: currentUser.address});
            this.setState({currentCity: currentUser.city});

            let birthDate = currentUser.dateOfBirth;
            let dateSplit = birthDate.split('-');
            let ourDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
            this.setState({currentBirthDate: ourDate});

            this.setState({currentUser: currentUser});
            this.setState({action: "http://localhost:8080/uploadProfileImage/" + currentUser.email});

            if(this.state.currentUser.profileImageName !== null)
                this.setState({profilePhoto: "http://localhost:8080/uploads/" + this.state.currentUser.profileImageName});
            else 
                this.setState({profilePhoto: NoImage});
        }
    }

    async updateUserInformation() {

        let birthDate = this.state.currentBirthDate;
        let test = new Date(birthDate).toISOString().split('T');
        let br = new Date(birthDate) + Math.abs(new Date(birthDate).getTimezoneOffset()*60000);
        let ah = br.split('T');
        /*
        const object = {
            id: parseInt(this.state.currentId),
            firstName: this.state.currentFirstName,
            lastName: this.state.currentLastName,
            phoneNumber: this.state.currentPhoneNumber,
            address: this.state.currentAddress,
            city: this.state.currentCity,
            dateOfBirth: test[0].toString()
        }
        await UserService.updateUser(object);
*/
    }

    filePicked = () => {
        this.setState({hideUploadButton: false})
    }

    reloadPage = () => {
        window.location.reload();
    }

    handleDateChange = date => this.setState({currentBirthDate: date});

    handleFirstNameChange = event => this.setState({currentFirstName: event.target.value});

    handleLastNameChange = event => this.setState({currentLastName: event.target.value});

    handlePhoneNumberChange = event => this.setState({currentPhoneNumber: event.target.value});

    handleAddressChange = event => this.setState({currentAddress: event.target.value});

    handleCityChange = event => this.setState({currentCity: event.target.value});

    render() {
        return (
            <div className="userProfileWrapper">
                <div className="userProfileLeft">
                    <img src={this.state.profilePhoto} alt="pic" className="profilePhoto" />
                    <iframe name="dummyframe" title="Just a dummy frame #1" id="dummyframe" style={{display: "none"}}></iframe>
                    <form action={this.state.action} target="dummyframe" encType="multipart/form-data" method="POST">
                        <input type="file" id="file" name="file" className="inputFile" onChange={this.filePicked} />
                        <label htmlFor="file" className="dummyLabel">Select Photo</label>
                        <input type="submit" 
                                value="Save Photo" 
                                className="submitPhoto" 
                                style={{width: this.state.hideUploadButton ? '0.1px' : '100%',
                                        height: this.state.hideUploadButton ? '0.1px' : '50%',
                                        alignSelf: 'center'}} 
                                onClick={this.reloadPage}
                                />
                    </form>
                </div>
                <div className="userProfileCenter">
                    <div className="userInformation" >
                        <span className="userInformationLabel"><b>Email</b></span>
                        <input type="text" placeholder="Email" className="userInformationInput" disabled={true} value={this.state.currentEmail}/>
                    </div>
                    <div className="userInformation" >
                        <span className="userInformationLabel"><b>First Name</b></span>
                        <input type="text" placeholder="First Name" className="userInformationInput" value={this.state.currentFirstName} onChange={this.handleFirstNameChange}/>
                    </div>
                    <div className="userInformation" >
                        <span className="userInformationLabel"><b>Last Name</b></span>
                        <input type="text" placeholder="Last Name" className="userInformationInput" value={this.state.currentLastName} onChange={this.handleLastNameChange}/>
                    </div>
                    <div className="userInformation" >
                        <span className="userInformationLabel"><b>Phone Number</b></span>
                        <input type="text" placeholder="Phone Number" className="userInformationInput" value={this.state.currentPhoneNumber} onChange={this.handlePhoneNumberChange}/>
                    </div>
                </div>
                <div className="userProfileRight">
                    <div className="userInformation">
                        <span className="userInformationLabel"><b>Address</b></span>
                        <input type="text" placeholder="Address" className="userInformationInput" value={this.state.currentAddress} onChange={this.handleAddressChange}/>
                    </div>
                    <div className="userInformation">
                        <span className="userInformationLabel"><b>City</b></span>
                        <input type="text" placeholder="City" className="userInformationInput" value={this.state.currentCity} onChange={this.handleCityChange}/>
                    </div>
                    <div className="userInformation">
                        <span className="userInformationLabel"><b>Birth Date</b></span>
                        <DatePicker placeholderText="Birth Date"
                                        className="userBirthDate" 
                                        onChange={this.handleDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentBirthDate)}/>
                    </div>
                    <div className="changePassword">
                        <button className="changePasswordButton" id="saveChanges" onClick={this.updateUserInformation}>Save Changes</button>
                        <button className="changePasswordButton" id="changePassword">Change Password?</button>
                    </div>
                </div>
            </div>
        )
    }
}
