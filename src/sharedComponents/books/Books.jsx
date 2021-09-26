import React, { Component } from 'react';
import './books.css';
import Leftbar from './../leftbar/Leftbar';
import ProductService from './../../services/productService';
import Product from './../product/Product';

export default class Books extends Component {
    constructor() {
        super();

        this.state = {
            books: []
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
                            <Product product={b} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
