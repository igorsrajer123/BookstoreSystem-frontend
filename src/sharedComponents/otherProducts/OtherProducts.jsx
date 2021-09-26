import React, { Component } from 'react';
import './otherProducts.css';
import ProductService from './../../services/productService';
import Product from './../product/Product';

export default class OtherProducts extends Component {
    constructor() {
        super();

        this.state = {
            otherProducts: []
        }
    }

    async componentDidMount() {
        const otherProducts = await ProductService.getOtherProducts();
        otherProducts.sort((a, b) => a.name.localeCompare(b.name));
        this.setState({otherProducts: otherProducts});
    }

    render() {
        return (
            <div className="otherProductsWrapper">
                <div className="otherProductCategories">
                    <span className="otherProductCategory">Accessories</span>
                    <span className="otherProductCategory">Gifts</span>
                    <span className="otherProductCategory">Schoolkit</span>
                    <span className="otherProductCategory">Toys</span>
                </div>
                <hr className="otherProductsHr" />
                <div className="otherProducts">
                    {this.state.otherProducts.map(o => (
                        <div key={o.id} className="otherProduct">
                            <Product product={o} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
