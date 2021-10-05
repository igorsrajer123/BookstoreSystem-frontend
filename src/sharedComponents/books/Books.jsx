import React, { Component } from 'react';
import './books.css';
import Leftbar from './../leftbar/Leftbar';
import Product from './../product/Product';
import BookService from './../../services/bookService';
import LoginService from '../../services/loginService';

export default class Books extends Component {
    constructor() {
        super();

        this.state = {
            books: [],
            filterCategory: undefined,
            currentUser: null
        }
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});

        const currentUrl = window.location.href.toString();
        let urlParts = currentUrl.split('3000');
        let parts = urlParts[1].split('/');
        
        if(parts[2] === undefined){
            const allBooks = await BookService.getAllBooks();
            this.setState({books: allBooks.sort((a, b) => a.name.localeCompare(b.name))});
            this.setState({filterCategory: undefined});
        }else {
            parts[2] = parts[2].replaceAll('%20', ' ');
            const myBooks = await BookService.getBooksByGenre(parts[2]);
            this.setState({books: myBooks.sort((a, b) => a.name.localeCompare(b.name))});
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
                            <Product product={b} currentUser={this.state.currentUser}/>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
