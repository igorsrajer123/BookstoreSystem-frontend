import React, { Component } from 'react';
import './leftbar.css';
import GenreService from './../../services/genreService';

export default class Leftbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookGenres: []
        }
    }

    async componentDidMount() {
        const allGenres = await GenreService.getAllGenres();
        allGenres.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({bookGenres: allGenres});
    }

    render() {
        return (
            <div className="leftbarWrapper">
                <div className="leftbarGenres">
                    {this.state.bookGenres.map( g => (
                        <span key={g.id} className="oneGenre">{g.name}</span>
                    ))}
                </div>
                <hr className="leftbarHr" />
            </div>
        )
    }
}
