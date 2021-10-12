import React, { Component } from 'react';
import './searchResults.css';
import SearchService from './../../services/searchService';
import Product from './../product/Product';
import NoImage from './../../assets/noimg.webp';

export default class SearchResults extends Component {
    constructor() {
        super();

        this.state = {
            books: [],
            otherProducts: [],
            writers: [],
            bookstores: [],
            searchParameter: "",
            warningVisible: false
        }
    }

    componentDidMount = async () => {
        const currentUrl = window.location.href.toString();
        let urlParts = currentUrl.split('3000');
        let parts = urlParts[1].split('/');
        this.setState({searchParameter: parts[1]});

        const books = await SearchService.getSearchedBooks(parts[2]);
        this.setState({books: books});

        const otherProducts = await SearchService.getSearchedOtherProducts(parts[2]);
        this.setState({otherProducts: otherProducts});

        const writers = await SearchService.getSearchedWriters(parts[2]);
        this.setState({writers: writers});

        const bookstores = await SearchService.getSearchedBookstores(parts[2]);
        this.setState({bookstores: bookstores});

        if(books.length === 0 && otherProducts.length === 0 && writers.length === 0 && bookstores.length === 0)
            this.setState({warningVisible: true});
        else 
        this.setState({warningVisible: false});
    }

    render() {
        return (
            <div className="searchResultsWrapper">
                <h1 className="noSearchResultsFound" style={{display: this.state.warningVisible ? 'inline' : 'none'}}>No Results Found!</h1>
                <div className="searchResultsBooks">
                    {this.state.books.map((b, i) => (
                        <div key={i} className="oneSearchedBook">
                            <Product product={b} currentUser={null} />
                        </div>
                    ))}
                </div>
                <div className="searchResultsOtherProducts">
                {this.state.otherProducts.map((o, i) => (
                        <div key={i} className="oneSearchedBook">
                            <Product product={o} currentUser={null} />
                        </div>
                    ))}
                </div>
                <div className="searchResultsWriters">
                    {this.state.writers.map(w => (
                        <div key={w.id} className="oneSearchedWriter">
                            <img alt="img" src={w.image !== null ? "http://localhost:8080/uploads/" + w.image : NoImage} className="writerPhoto" />
                            <div className="writerInfo">
                                <span className="writerName">{w.name}</span>
                                <span className="writerDescription">{w.description}</span>
                            </div>
                        </div>
                        ))}
                </div>
                <div className="searchResultsBookstores">
                    {this.state.bookstores.map(b => (
                        <div key={b.id} className="bookstore">
                            <img alt="img" src={b.photo !== null ? "http://localhost:8080/uploads/" + b.photo  : NoImage} className="bookstorePhoto" />
                            <div className="bookstoreInfo">
                                <div className="bookstoreHelperDiv">
                                    <span className="bookstoreName">{b.name}</span>
                                </div>
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
