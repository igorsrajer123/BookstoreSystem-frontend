import React, { Component } from 'react';
import './newGenre.css';
import Modal from 'react-modal';
import GenreService from './../../services/genreService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class NewGenreModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            currentName: "",
            nameValid: null
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.saveGenre = this.saveGenre.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.genre !== this.props.genre){
            if(this.props.genre !== null) {
                this.setState({currentName: this.props.genre.name});
            }else {
                this.setState({currentName: ""});
            }
        }
    }

    handleNameChange = event => this.setState({currentName: event.target.value});

    async saveGenre() {
        let validName = false;
        if(this.state.currentName === "") {
            this.setState({nameValid: false});
            validName = false;
        }else{
            this.setState({nameValid: true});
            validName = true;
        }

        if(this.props.genre === null){
            if(validName)
                await this.addNewGenre();
        }else {
            if(validName)
                await this.editGenre();
        }
    }

    async addNewGenre() {
        const object = {
            name: this.state.currentName
        }

        const response = await GenreService.createNewGenre(object);
        if(response === 201) {
            NotificationManager.success("Genre successfully saved!", "Success!");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    async editGenre() {
        const object = {
            id: this.props.genre.id,
            name: this.state.currentName
        }
        const response = await GenreService.editGenre(object);
        if(response === 200) {
            NotificationManager.success("Genre successfully saved!", "Success!");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="newGenreModal">
                <NotificationContainer />
                <div className="newGenreWrapper">
                    <span className="newGenreLabel">Genre Name</span>
                    <input type="text" 
                            placeholder="Genre Name" 
                            className="newGenreInput"
                            onChange={this.handleNameChange}
                            value={this.state.currentName}
                            style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                    borderColor: this.state.nameValid === false ? 'red' : ''}} />
                    <button className="newGenreSave" onClick={this.saveGenre}>Save</button>
                </div>
            </Modal>
        )
    }
}
