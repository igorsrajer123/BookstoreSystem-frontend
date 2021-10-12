import React, { Component } from 'react';
import './publishersAndGenres.css';
import AddIcon from '@material-ui/icons/Add';
import GenreService from './../../services/genreService';
import PublisherService from './../../services/publisherService';
import NewGenreModal from '../../modals/genre/NewGenreModal';
import NewPublisherModal from '../../modals/publisher/NewPublisherModal';
import LoginService from './../../services/loginService';

export default class PublishersAndGenres extends Component {
    constructor() {
        super();

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            allPublishers: [],
            allGenres: [],
            selectedGenre: null,
            selectedPublisher: null
        }

        this.newGenreClick = this.newGenreClick.bind(this);
        this.newPublisherClick = this.newPublisherClick.bind(this);
        this.editGenreClick = this.editGenreClick.bind(this);
        this.editPublisherClick = this.editPublisherClick.bind(this);
        this.searchPublishers = this.searchPublishers.bind(this);
        this.searchGenres = this.searchGenres.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";

        const publishers = await PublisherService.getAllPublishers();
        this.setState({allPublishers: publishers.sort((a, b) => a.name.localeCompare(b.name))});

        const genres = await GenreService.getAllGenres();
        this.setState({allGenres: genres.sort((a, b) => a.name.localeCompare(b.name))});
    }

    newGenreClick = () => {
        this.setState({selectedGenre: null});
        this.child.current.toggleModal();
    }

    newPublisherClick = () => {
        this.setState({selectedPublisher: null});
        this.child2.current.toggleModal();
    }

    editGenreClick = genre => {
        this.setState({selectedGenre: genre});
        this.child.current.toggleModal();
    }

    editPublisherClick = publisher => {
        this.setState({selectedPublisher: publisher});
        this.child2.current.toggleModal();
    }

    searchPublishers = async e => {
        if(e.target.value === "") {
            const publishers = await PublisherService.getAllPublishers();
            this.setState({allPublishers: publishers.sort((a, b) => a.name.localeCompare(b.name))});
        }else {
            const publishers = await PublisherService.getAllPublishers();
            let array = [];
            for(let p of publishers) {
                if(p.name.toLowerCase().includes(e.target.value.toLowerCase())){
                    array.push(p);
                }
            }
            this.setState({allPublishers: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    searchGenres = async e => {
        if(e.target.value === "") {
            const genres = await GenreService.getAllGenres();
            this.setState({allGenres: genres.sort((a, b) => a.name.localeCompare(b.name))});
        }else {
            const genres = await GenreService.getAllGenres();
            let array = [];
            for(let g of genres) {
                if(g.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                    array.push(g);
                }
            }
            this.setState({allGenres: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    render() {
        return (
            <div className="viewPublishersAndGenresWrapper">
                <NewGenreModal ref={this.child} genre={this.state.selectedGenre} />
                <NewPublisherModal ref={this.child2} publisher={this.state.selectedPublisher} />
                <div className="viewPublishersHelper1">
                    <h1 className="viewPublishersAndGenresHeader">Publishers</h1>
                    <button className="createNewButton" onClick={this.newPublisherClick}><AddIcon />New Publisher</button>
                    <input type="text" placeholder="Search..." onChange={this.searchPublishers} className="viewPublishersAndGenresSearch" />
                    <table className="viewPublishersTable">
                        <thead className="viewPublishersTableHead">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody className="viewPublishersTableBody">
                            {this.state.allPublishers.map(p => (
                                <tr key={p.id} onClick={() => this.editPublisherClick(p)}>
                                    <td className="viewPublishersContent">{p.name}</td>
                                    <td className="viewPublishersContent">{p.address}</td>
                                    <td className="viewPublishersContent">{p.city}</td>
                                    <td className="viewPublishersContent">{p.phoneNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="viewPublishersHelper2">
                    <h1 className="viewPublishersAndGenresHeader">Genres</h1>
                    <button className="createNewButton" onClick={this.newGenreClick}><AddIcon />New Genre</button>
                    <input type="text" placeholder="Search..." onChange={this.searchGenres} className="viewPublishersAndGenresSearch" />
                    <table className="viewPublishersTable">
                        <thead className="viewPublishersTableHead">
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody className="viewPublishersTableBody">
                            {this.state.allGenres.map(g => (
                                <tr key={g.id} onClick={() => this.editGenreClick(g)}>
                                    <td className="viewPublishersContent">{g.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
