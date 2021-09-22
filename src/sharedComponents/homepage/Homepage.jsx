import React, { Component } from 'react';
import './homepage.css';
import ProductService from './../../services/productService';
import NoImage from './../../assets/noimg.webp';

export default class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            productImage: null
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
                        <img className="productImage" alt="productPic" src={NoImage} />
                        <div className="productName">
                            <span className="productInfo"><b>{p.name}</b></span>
                            <span className="productInfo">({p.published})</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
