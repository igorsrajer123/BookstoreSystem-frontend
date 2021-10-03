import React, { Component } from 'react';
import './editWriter.css';
import Modal from 'react-modal';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import WriterService from './../../services/writerService';

export default class EditWriterModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            currentUser: null,
            currentWriter: null,
            currentName: "",
            currentDescription: "",
            writerNameValid: true
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.updateWriter = this.updateWriter.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        if(this.props.writer !== null){
            this.setState({currentName: this.props.writer.name});
            this.setState({currentName: this.props.writer.name});
            this.setState({currentDescription: this.props.writer.description});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.writer !== this.props.writer) {
            this.setState({currentWriter: this.props.bookstore});
            this.setState({currentName: this.props.writer.name});
            this.setState({currentDescription: this.props.writer.description});
        }
    }

    handleNameChange = event => {
        this.setState({currentName: event.target.value});
        if(event.target.value.length === 0)
            this.setState({writerNameValid: false});
        else
            this.setState({writerNameValid: true});
    }

    handleDescriptionChange = event => {
        this.setState({currentDescription: event.target.value});
    }

    async updateWriter() {
        if(this.state.writerNameValid) {
            const object = {
                id: this.props.writer.id,
                name: this.state.currentName,
                description: this.state.currentDescription
            }

            const status = await WriterService.updateWriter(object);
            if(status === 200) {
                NotificationManager.success("Writer updated successfully!", "Update Successful!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.reload();
            }
            else 
                NotificationManager.error("Something went wrong!", "Update Failed!");
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editWriterModal">
                <div className="editWriterWrapper">
                    <NotificationContainer />
                    <div className="editWriterInfo">
                        <span className="editWriterLabel">Name</span>
                        <input type="text" className="editWriterInput" placeholder="Name" onChange={this.handleNameChange} value={this.state.currentName} />
                    </div>
                    <div className="editWriterInfo">
                        <span className="editWriterLabel">Description</span>
                        <textarea className="editWriterTextarea" onChange={this.handleDescriptionChange} value={this.state.currentDescription}></textarea>
                    </div>
                    <div className="editWriterInfo">
                        <button className="editWriterSaveButton" onClick={this.updateWriter}>Save Changes</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
