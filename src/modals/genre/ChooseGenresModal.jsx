import React, { Component } from 'react';
import './chooseGenres.css';
import Modal from 'react-modal';
import GenreService from './../../services/genreService';

export default class ChooseGenresModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            genres: [],
            selectedGenres: []
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.sendGenres = this.sendGenres.bind(this);
    }

    toggleModal = () => {
        this.setState({selectedGenres: []});
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        const allGenres = await GenreService.getAllGenres();
        this.setState({genres: allGenres});
    }

    handleGenreChange(e) {
        if(e.target.checked) {
            let array = this.state.selectedGenres;
            array.push(e.target.value);
            this.setState({selectedGenres: array});
        }

        if(!e.target.checked) {
            let array = this.state.selectedGenres;
            if (array.indexOf(e.target.value) !== -1)
                array.splice(array.indexOf(e.target.value), 1);
            this.setState({selectedGenres: array});
        }
    }

    sendGenres(event) {
        this.props.sendData(this.state.selectedGenres);
        event.preventDefault();
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="chooseBookGenres">
                <div className="chooseBookGenresWrapper">
                {this.state.genres.map(g => (
                    <div key={g.id}>
                        <input type="checkbox" key={g.id} onChange={this.handleGenreChange} value={g.id} />
                        <span>{g.name}</span>
                    </div>
                ))}
                <div className="chooseBookGenresSave">
                    <button onClick={this.sendGenres}>Save</button>
                </div>
                </div>
            </Modal>
        )
    }
}
