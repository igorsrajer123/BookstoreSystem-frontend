import React, { Component } from 'react';
import './homepage.css';
import ProductService from './../../services/productService';
import Product from './../product/Product';

export default class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            products: []
        }
    }

    async componentDidMount() {
        const allProducts = await ProductService.getAllProducts();
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({products: allProducts});
    }

    render() {
        return (
            <div className="homepageWrapper">
                {this.state.products.map(p => (
                    <div key={p.id} className="product">
                        <Product product={p} />
                    </div>
                ))}
            </div>
        )
    }
}
