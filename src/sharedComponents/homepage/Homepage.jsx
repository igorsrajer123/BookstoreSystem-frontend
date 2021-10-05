import React, { Component } from 'react';
import './homepage.css';
import Product from './../product/Product';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';
import LoginService from '../../services/loginService';

export default class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            products: [],
            currentUser: null
        }
    }

    async componentDidMount() {
        const allBooks = await BookService.getAllBooks();
        const allOtherProducts = await OtherProductService.getAllOtherProducts();
        this.setState({products: allBooks.concat(allOtherProducts).sort((a, b) => a.name.localeCompare(b.name))});

        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});
    }

    render() {
        return (
            <div className="homepageWrapper">
                {this.state.products.map(p => (
                    <div key={p.id} className="product">
                        <Product product={p} currentUser={this.state.currentUser} />
                    </div>
                ))}
            </div>
        )
    }
}
