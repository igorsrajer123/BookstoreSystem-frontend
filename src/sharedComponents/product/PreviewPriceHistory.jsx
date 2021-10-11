import React, { Component } from 'react';
import './previewPriceHistory.css';
import Modal from 'react-modal';
import CatalogueItemService from './../../services/catalogueItemService';
import LoginService from './../../services/loginService';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';

export default class PreviewPriceHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            currentProduct: "",
            catalogueItems: [],
            currentUserSysAdmin: false,
            newPrice: "",
            priceValid: null
        }
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.setNewPrice = this.setNewPrice.bind(this);
    }

    async componentDidMount() {
        this.setState({currentProduct: this.props.product});
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SYSTEM_ADMIN") {
                this.setState({currentUserSysAdmin: true});
            }else {
                this.setState({currentUserSysAdmin: false});
            }
        }
    }

    async componentDidUpdate(prevProps){
        if(prevProps.product !== this.props.product) {
            this.setState({currentProduct: this.props.product});
            if(this.props.product.type !== undefined) {
                const items = await CatalogueItemService.getCatalogueItemsByOtherProduct(this.props.product.id);
                let array = [];
                for(let i of items) 
                    array.push(i);
                
                array.sort(function (a, b) { return a.id - b.id;});
                this.setState({catalogueItems: array});
            }else {
                const items = await CatalogueItemService.getCatalogueItemsByBook(this.props.product.id);
                let array = [];
                for(let i of items) 
                    array.push(i);

                array.sort(function (a, b) { return a.id - b.id;});
                this.setState({catalogueItems: array});
            }
        }
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else
            this.setState({isOpen: true});
    }

    handlePriceChange = e => {
        const value = e.target.value.replace(/[^\dA-Z]/g, '').trim();
        this.setState({newPrice: value});
    }

    setNewPrice = async  () => {
        let priceValid = false;
        if(this.state.newPrice === "" || this.state.newPrice === "0") {
            this.setState({priceValid: false});
            priceValid = false;
        }else {
            this.setState({priceValid: true});
            priceValid = true;
        }

        if(priceValid) {
            if(this.state.currentProduct.type === undefined) {
                await BookService.upodateBookPrice(this.state.currentProduct.id, this.state.newPrice);
                const items = await CatalogueItemService.getCatalogueItemsByBook(this.props.product.id);
                this.setState({catalogueItems: items});
            }else {
                await OtherProductService.updateOtherProductPrice(this.state.currentProduct.id, this.state.newPrice);
                const items = await CatalogueItemService.getCatalogueItemsByOtherProduct(this.props.product.id);
                this.setState({catalogueItems: items});
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="priceHistoryModal">
                {this.state.catalogueItems.map((i, idx) => (
                    <div key={idx} className="priceHistoryItem">
                        <span className="priceHistoryLabel"><b>From:</b> {i.priceStart}</span>
                        <span className="priceHistoryLabel"><b>Until:</b> {i.priceEnd === null ? '/' : i.priceEnd}</span>
                        <span className="priceHistoryLabel"><b>Price:</b> {i.price}<b>din</b></span>
                    </div>
                ))}
                <div className="priceHistoryNewPrice" style={{display: this.state.currentUserSysAdmin ? 'inline' : 'none'}}>
                    <input type="text" placeholder="New Price..." style={{borderStyle: this.state.priceValid !== false ? 'none' : 'solid', borderColor: 'red'}} className="priceHistoryInput" maxLength="7" onChange={this.handlePriceChange} value={this.state.newPrice}/>
                    <button className="priceHistoryButtonSave" onClick={this.setNewPrice}>Save</button>
                </div>
            </Modal>
        )
    }
}
