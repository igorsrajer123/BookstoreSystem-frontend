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
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";

        const publishers = await PublisherService.getAllPublishers();
        this.setState({allPublishers: publishers});

        const genres = await GenreService.getAllGenres();
        this.setState({allGenres: genres});
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

    render() {
        return (
            <div className="viewPublishersAndGenresWrapper">
                <NewGenreModal ref={this.child} genre={this.state.selectedGenre} />
                <NewPublisherModal ref={this.child2} publisher={this.state.selectedPublisher} />
                <div className="viewPublishersHelper1">
                    <h1 className="viewPublishersAndGenresHeader">Publishers</h1>
                    <button className="createNewButton" onClick={this.newPublisherClick}><AddIcon />New Publisher</button>
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
