import React, { Component } from 'react';
import './newWriter.css';
import LoginService from '../../../services/loginService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import WriterService from './../../../services/writerService';

export default class NewWriter extends Component {
    constructor() {
        super();

        this.state = {
            currentName: "",
            currentDescription: "",
            nameValid: null
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.submitNewWriter = this.submitNewWriter.bind(this);
    }

    handleNameChange = event => {
        this.setState({currentName: event.target.value});
    }

    handleDescriptionChange = event => this.setState({currentDescription: event.target.value});

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";
    }

    async submitNewWriter() {
        
        if(this.state.currentName === "")
            this.setState({nameValid: false});
        else
            this.setState({nameValid: true});

        if(this.state.currentName) {
            const object = {
                name: this.state.currentName,
                description: this.state.currentDescription
            }
    
            const response = await WriterService.createNewWriter(object);
            if(response === 201){
                NotificationManager.success("Writer successfully created!", "Success!");
                await new Promise(resolve => setTimeout(resolve, 2000));
                window.location.href="http://localhost:3000/"
            }else
                NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="newWriterWrapper">
                <NotificationContainer />
                <div className="newWriterLeft">
                    <span className="newWriterLabel">Name</span>
                    <input type="text" 
                                className="newWriterInput" 
                                placeholder="Name" 
                                onChange={this.handleNameChange}
                                style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                        borderColor: this.state.nameValid === false ? 'red' : ''}} />
                </div>
                <div className="newWriterRight">
                    <div className="newWriterHelper">
                        <span className="newWriterLabel">Description</span>
                        <textarea className="newWriterDescription" onChange={this.handleDescriptionChange}></textarea>
                    </div>
                    <button className="newWriterSave" onClick={this.submitNewWriter}>Save</button>
                </div>
            </div>
        )
    }
}
