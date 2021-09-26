import React, { Component } from 'react';
import './product.css';
import NoImage from './../../assets/noimg.webp';
import WriterService from './../../services/writerService';

export default class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            writers: []
        }
    }

    async componentDidMount() {
        const writers = await WriterService.getBookWriters(this.props.product.name);
        this.setState({writers: writers});
    }

    render() {
        return (
            <div className="productWrapper">
                <img className="productImage" alt="productPic" src={this.props.product.coverImage===null ? NoImage : "http://localhost:8080/uploads/" + this.props.product.coverImage} />
                <div className="productInfo">
                    <span className="productName"><b>{this.props.product.name}</b></span>
                    <span className="productWriter">
                        {this.state.writers.map(w => (
                            <i  key={this.props.product.id}>{w.name}<br/></i>
                        ))}
                    </span>
                </div>
            </div>
        )
    }
}