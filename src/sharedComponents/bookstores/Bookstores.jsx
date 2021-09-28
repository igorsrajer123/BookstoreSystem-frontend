import React, { Component } from 'react';
import './bookstores.css';
import BookstoreService from './../../services/bookstoreService';

export default class Bookstores extends Component {
    constructor() {
        super();

        this.state = {
            bookstores: []
        }
    }

    async componentDidMount() {
        const bookstores = await BookstoreService.getAllBookstores();
        this.setState({bookstores: bookstores});
    }

    render() {
        return (
            <div className="bookstoresWrapper">
                <div className="bookstores">
                    {this.state.bookstores.map(b => (
                        <div key={b.id} className="bookstore">
                            <img alt="img" src={"http://localhost:8080/uploads/" + b.photo} className="bookstorePhoto" />
                            <div className="bookstoreInfo">
                                <span className="bookstoreName">{b.name}</span>
                                <span className="bookstoreAddress">{b.address}</span>
                                <span className="bookstoreCity">{b.city}</span>
                                <span className="bookstorePhone">Contact: {b.contactPhone}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
