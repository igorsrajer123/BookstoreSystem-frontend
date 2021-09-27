import React, { Component } from 'react';
import './otherProducts.css';
import ProductService from './../../services/productService';
import Product from './../product/Product';

export default class OtherProducts extends Component {
    constructor() {
        super();

        this.state = {
            otherProducts: [],
            filterCategory: undefined
        }

        this.chooseCategory = this.chooseCategory.bind(this);
    }

    async componentDidMount() {
        const currentUrl = window.location.href.toString();
        let urlParts = currentUrl.split('3000');
        let parts = urlParts[1].split('/');

        if(parts[2] === undefined){
            const otherProducts = await ProductService.getOtherProducts();
            otherProducts.sort((a, b) => a.name.localeCompare(b.name));
            this.setState({otherProducts: otherProducts});
            this.setState({filterCategory: undefined});
        }else {
            const otherProducts = await ProductService.getProductsByType(parts[2]);
            otherProducts.sort((a, b) => a.name.localeCompare(b.name));
            this.setState({otherProducts: otherProducts});
            this.parseCategory(parts[2]);
        }
    }

    parseCategory(category) {
        if(category === 'TOY')
            this.setState({filterCategory: 'Toys'});
        
        if(category === 'ACCESSORY')
            this.setState({filterCategory: 'Accessories'});
        
        if(category === 'GIFT')
            this.setState({filterCategory: 'Gifts'});
        
        if(category === 'SCHOOLKIT')
            this.setState({filterCategory: 'Schoolkit'});
    }

    chooseCategory = category => window.location.href = "http://localhost:3000/otherProducts/" + category;

    render() {
        return (
            <div className="helperWrapper">
                <span style={{display: this.state.filterCategory === undefined ? 'none' : 'inline'}} className="productsFilter">Product Category: {this.state.filterCategory}</span>
                <div className="otherProductsWrapper">
                    <div className="otherProductCategories">
                        <span className="otherProductCategory" onClick={() => this.chooseCategory("ACCESSORY")}>Accessories</span>
                        <span className="otherProductCategory" onClick={() => this.chooseCategory("GIFT")}>Gifts</span>
                        <span className="otherProductCategory" onClick={() => this.chooseCategory("SCHOOLKIT")}>Schoolkit</span>
                        <span className="otherProductCategory" onClick={() => this.chooseCategory("TOY")}>Toys</span>
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
            </div>
        )
    }
}
