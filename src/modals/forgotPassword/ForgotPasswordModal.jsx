import React, { Component } from 'react';
import Modal from 'react-modal';
import "./forgotPassword.css";
import LoginService from './../../services/loginService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class ForgotPasswordModal extends Component {
    constructor() {
        super();

        this.state = {
            isOpen: false,
            email: ""
        }

        this.emailInputChange = this.emailInputChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.confirmPasswordReset = this.confirmPasswordReset.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    emailInputChange = event => this.setState({email : event.target.value});

    async confirmPasswordReset() {
        const response = await LoginService.sendPasswordResetEmail(this.state.email);
        if(response === 200)
            NotificationManager.success("Email has been sent to: " + this.state.email, "Email sent!");
        else
            NotificationManager.error("Something went wrong...", "Error!");
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="forgotPasswordModal">
                <div className="forgotPasswordDescription">
                    <span>Please enter your account's email address.</span>
                </div>
                <div className="forgotPasswordEmail">
                    <input type="text" className="forgotPasswordInput" placeholder="Email" onChange={this.emailInputChange} />
                </div>
                <div className="forgotPasswordConfirm">
                    <button className="forgotPasswordButton" onClick={this.confirmPasswordReset} >Confirm</button>
                </div>
                <NotificationContainer className="modalReset" />
            </Modal>
        )
    }
}
