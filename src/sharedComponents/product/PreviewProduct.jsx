import React, { Component } from 'react';
import './previewProduct.css';
import LoginService from './../../services/loginService';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';
import NoImage from './../../assets/noimg.webp';
import WriterService from './../../services/writerService';

export default class PreviewProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            currentProduct: null,
            productImage: "",
            currentProductIsBook: false,
            bookWriters: [],
            currentUserCustomer: false
        }
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});

        if(currentUser !== null) {
            if(currentUser.type === "ROLE_CUSTOMER") {
                this.setState({currentUserCustomer: true});
            }
        }
        const currentUrl = window.location.href.toString();
        let urlParts = currentUrl.split('3000');
        let parts = urlParts[1].split('/');

        let currentProduct = await BookService.getBookById(parseInt(parts[2]));
        if(currentProduct.id !== null) {
            this.setState({currentProduct: currentProduct});
            this.setState({productImage: "http://localhost:8080/uploads/" + currentProduct.coverImage});
            this.setState({currentProductIsBook: true});

            const writers = await WriterService.getBookWriters(currentProduct.name);
            this.setState({bookWriters: writers});
        }else {
            currentProduct = await OtherProductService.getOtherProductById(parseInt(parts[2]));
            this.setState({currentProduct: currentProduct});
            this.setState({productImage: "http://localhost:8080/uploads/" + currentProduct.coverImage});
            this.setState({currentProductIsBook: false});
        }
    }

    render() {
        return (
            <div className="previewProductWrapper">
                <div className="previewProductLeft">
                    <div className="previewProductPicture">
                        <img src={this.state.productImage === "" ? NoImage : this.state.productImage} alt="pic" className="previewProductImage"/>
                        <button className="previewProductAddToCart" style={{display: this.state.currentUserCustomer ? 'inline' : 'none'}}>Add to Shopping Cart</button>
                    </div>
                    <div className="previewProductInformation">
                        <div className="previewProductData">
                            <span className="previewProductLabel"><b>Product Code: </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.code}</span>
                            <span className="previewProductLabel"><b>Price(RSD): </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.price}</span>
                            <span className="previewProductLabel"><b>Publisher: </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.publisher.name}</span>
                            <span className="previewProductLabel"><b>Publishing Date: </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.published}</span>
                        </div>
                        <div className="previewProductMoreInformation">
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'inline' : 'none'}}><b>Language: </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.language}</span>
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'inline' : 'none'}}><b>Cover Type: </b>{this.state.currentProduct === null ? '' : this.state.currentProduct.coverType}</span>
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'inline' : 'none'}}><b>Writer(s): </b>{this.state.currentProduct === null ? '' : this.state.bookWriters.map(w => (w.name))}</span>
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'inline' : 'none'}}><b>Number of Pages: </b> {this.state.currentProduct === null ? '' : this.state.currentProduct.numberOfPages}</span>
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'none' : 'inline'}}><b>Expiration Date: </b> {this.state.currentProduct === null ? '' : this.state.currentProduct.expirationDate}</span>
                            <span className="previewProductLabel" style={{display: this.state.currentProductIsBook ? 'none' : 'inline'}}><b>Product Type: </b> {this.state.currentProduct === null ? '' : this.state.currentProduct.type}</span>
                        </div>
                    </div>
                </div>
                <div className="previewProductRight">
                    <div className="previewProductDescription">
                        {this.state.currentProduct === null ? '' : this.state.currentProduct.description}
                    </div>
                </div>
            </div>
        )
    }
}