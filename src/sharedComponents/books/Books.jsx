import React, { Component } from 'react';
import './books.css';
import Leftbar from './../leftbar/Leftbar';
import ProductService from './../../services/productService';
import Product from './../product/Product';

export default class Books extends Component {
    constructor() {
        super();

        this.state = {
            books: [],
            filterCategory: undefined
        }
    }

    async componentDidMount() {
        const currentUrl = window.location.href.toString();
        let urlParts = currentUrl.split('3000');
        let parts = urlParts[1].split('/');
        
        if(parts[2] === undefined){
            const allBooks = await ProductService.getAllBooks();
            allBooks.sort((a, b) => a.name.localeCompare(b.name));
            this.setState({books: allBooks});
            this.setState({filterCategory: undefined});
        }else {
            parts[2] = parts[2].replaceAll('%20', ' ');
            const myBooks = await ProductService.getBooksByGenre(parts[2]);
            myBooks.sort((a, b) => a.name.localeCompare(b.name));
            this.setState({books: myBooks});
            this.setState({filterCategory: parts[2]});
        }
    }

    render() {
        return (
            <div className="helperWrapper">
                <span style={{display: this.state.filterCategory === undefined ? 'none' : 'inline'}} className="booksFilter">Books: {this.state.filterCategory}</span>
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
            </div>
        )
    }
}
