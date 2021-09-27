import React, { Component } from 'react';
import Modal from 'react-modal';
import './changePassword.css';
import ReactTooltip from 'react-tooltip';
import {NotificationManager} from 'react-notifications';
import UserService from './../../services/userService';

export default class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            password: "",
            confirmPassword: "",
            userId: 0,
            passwordsDoNotMatch: false,
            passwordTooShort: false
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    async changePassword() {
        if(this.state.password === "" || this.state.password.length < 4){
            this.setState({passwordTooShort: true});
        }else {
            if(this.state.password !== this.state.confirmPassword) {
                this.setState({passwordTooShort: false});
                this.setState({passwordsDoNotMatch: true});
                NotificationManager.error("Passwords must match!", "Error!");
            }else {
                this.setState({passwordTooShort: false});
                this.setState({passwordsDoNotMatch: false});

                const object = {
                    id: this.props.userId,
                    password: this.state.password
                };

                const response = await UserService.changeUserPassword(object);
                if(response === 200){
                    NotificationManager.success("Password changed successfully!", "Success!");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.reload();
                }
            }
        }
        
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    passwordInputChange = event => {
        this.setState({password : event.target.value});
        if(this.state.password === "" || this.state.password.length < 4)
            this.setState({passwordTooShort: true});
        else
            this.setState({passwordTooShort: false});
    }

    confirmPasswordInputChange = event => this.setState({confirmPassword : event.target.value});

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="changePasswordModal">
                <div className="password">
                    <span className="newPasswordLabel">New Password</span>
                    <input type="password" 
                            className="newPasswordInput" 
                            placeholder="New Password"
                            onChange={this.passwordInputChange} 
                            style={{borderStyle: this.state.passwordTooShort ? 'solid' : 'none',
                                    borderColor: this.state.passwordTooShort ? 'red' : ''}} 
                            data-tip data-for="wrongPassword"/>
                    <ReactTooltip id="wrongPassword" 
                                    type="error" 
                                    disable={this.state.passwordTooShort ? false : true}
                                    place="top" 
                                    effect="solid">
                                <span>Password must be at least 4 characters long!</span>
                    </ReactTooltip>
                </div>
                <div className="password">
                    <span className="newPasswordLabel">Repeat Password</span>
                    <input type="password" 
                            className="newPasswordInput" 
                            placeholder="Repeat Password"
                            onChange={this.confirmPasswordInputChange}
                            style={{borderStyle: this.state.passwordsDoNotMatch ? 'solid' : 'none',
                                    borderColor: this.state.passwordsDoNotMatch ? 'red' : ''}}
                            data-tip data-for="wrongConfirmedPassword" />
                    <ReactTooltip id="wrongConfirmedPassword" 
                                    type="error" 
                                    disable={this.state.passwordsDoNotMatch ? false : true}
                                    place="top" 
                                    effect="solid">
                                <span>Passwords must match!</span>
                    </ReactTooltip>
                </div>
                <button className="saveNewPassword" onClick={() => this.changePassword()}>Save Changes</button>
            </Modal>
        )
    }
}
