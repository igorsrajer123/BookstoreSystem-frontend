import React, { Component } from 'react';
import './firstLogin.css';
import Modal from 'react-modal';

export default class FirstLoginModal extends Component {
    constructor() {
        super();

        this.state = {
            isOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="firstLoginModal">
                <span className="firstLoginDescription">Please change your current password! :)</span>
            </Modal>
        )
    }
}
