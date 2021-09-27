import React, { Component } from 'react';
import Modal from 'react-modal';
import './profilePhoto.css';

export default class profilePhotoModal extends Component {
    constructor(props) {
        super(props);

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
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="profilePhotoModal">
                <img src={this.props.photo} alt="pic" className="image"/>
            </Modal>
        )
    }
}
