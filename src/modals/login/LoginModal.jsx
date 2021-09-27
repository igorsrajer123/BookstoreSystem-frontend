import React, { Component } from 'react';
import Modal from 'react-modal';
import "./login.css";
import LoginService from './../../services/loginService';
import ReactTooltip from 'react-tooltip';
import RegistrationModal from './../registration/RegistrationModal';

export default class LoginModal extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            isOpen: false,
            email: "",
            password: "",
            wrongEmail: false,
            wrongPassword: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.emailInputChange = this.emailInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    emailInputChange = event => this.setState({email: event.target.value});

    passwordInputChange = event => this.setState({password: event.target.value});

    registrationClick = () => this.child.current.toggleModal();

    async login(){
        const user = {
            username: this.state.email,
            password: this.state.password
        }

        const response = await LoginService.login(user);
        if(response === 401) {
            this.setState({wrongEmail: false});
            this.setState({wrongPassword: true});
        }

        if(response === 404) {
            this.setState({wrongEmail: true});
            this.setState({wrongPassword: false});
        }

        if(response === 200) {
            this.setState({wrongEmail: false});
            this.setState({wrongPassword: false});
            window.location.href = "http://localhost:3000/";
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="loginModal">
                <div className="loginWrapper">
                    <div className="loginTop">
                        <span style={{marginTop: '5%'}}>Login Form</span>
                    </div>
                    <div className="loginCenter">
                        <span className="loginInfo">Email</span>
                        <input type="text" 
                                className="loginInput"
                                onChange={this.emailInputChange} 
                                data-tip data-for="wrongEmail" 
                                style={{borderColor: this.state.wrongEmail ? 'red' : '', borderStyle: this.state.wrongEmail ? 'solid' : 'none'}} />
                        <span className="loginInfo">Password</span>
                        <input type="password" 
                                className="loginInput" 
                                onChange={this.passwordInputChange} 
                                data-tip data-for="wrongPassword"
                                style={{borderColor: this.state.wrongPassword ? 'red' : '', borderStyle: this.state.wrongPassword ? 'solid' : 'none'}} />
                        <span className="loginNotAMember" style={{color: 'black', textDecoration: 'underline', cursor: 'pointer'}}>Forgot password?</span>
                        <ReactTooltip id="wrongEmail" 
                                        type="error" 
                                        disable={this.state.wrongEmail ? false : true}
                                        place="top" 
                                        effect="solid">
                            <span>Wrong email address!</span>
                        </ReactTooltip>
                        <ReactTooltip id="wrongPassword" 
                                        type="error" 
                                        disable={this.state.wrongPassword ? false : true}
                                        place="top" 
                                        effect="solid">
                            <span><span>Wrong password!</span></span>
                        </ReactTooltip>
                    </div>
                    <RegistrationModal ref={this.child} />
                    <div className="loginBottom">
                        <button className="loginButton" onClick={this.login}>LOGIN</button>
                        <span className="loginNotAMember">Not a member? 
                            <b style={{color: 'black', 
                                        cursor: 'pointer',
                                        textDecoration: 'underline'}} 
                                className="signUp" onClick={this.registrationClick}>Sign up now!</b>
                            </span>
                    </div>
                </div>
            </Modal>
        );
    }
}
