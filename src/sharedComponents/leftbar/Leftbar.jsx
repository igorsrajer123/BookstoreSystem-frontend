import React, { Component } from 'react';
import './leftbar.css';
import GenreService from './../../services/genreService';

export default class Leftbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookGenres: []
        }

        this.chooseGenre = this.chooseGenre.bind(this);
    }

    async componentDidMount() {
        const allGenres = await GenreService.getAllGenres();
        allGenres.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({bookGenres: allGenres});
    }

    chooseGenre = genreName => window.location.href = "http://localhost:3000/books/" + genreName;

    render() {
        return (
            <div className="leftbarWrapper">
                <div className="leftbarGenres">
                    {this.state.bookGenres.map( g => (
                        <span key={g.id} className="oneGenre" onClick={() =>this.chooseGenre(g.name)}>{g.name}</span>
                    ))}
                </div>
                <hr className="leftbarHr" />
            </div>
        )
    }
}
