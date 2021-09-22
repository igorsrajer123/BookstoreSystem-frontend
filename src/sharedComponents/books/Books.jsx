import React, { Component } from 'react';
import './books.css';
import Leftbar from './../leftbar/Leftbar';
import ProductService from './../../services/productService';
import NoImage from './../../assets/noimg.webp';

export default class Books extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            productImage: null
        }
    }

    async componentDidMount() {
        const allBooks = await ProductService.getAllBooks();
        allBooks.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({books: allBooks});
    }

    render() {
        return (
            <div className="booksWrapper">
                <Leftbar />
                <div className="books">
                    {this.state.books.map(b => (
                        <div key={b.id} className="book">
                            <img className="bookImage" alt="bookPic" src={NoImage} />
                            <div className="bookName">
                                <span className="bookInfo"><b>{b.name}</b></span>
                                <span className="bookInfo">({b.published})</span>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
