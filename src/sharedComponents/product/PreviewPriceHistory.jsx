import React, { Component } from 'react';
import './previewPriceHistory.css';
import Modal from 'react-modal';
import CatalogueItemService from './../../services/catalogueItemService';

export default class PreviewPriceHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            currentProduct: "",
            catalogueItems: []
        }
    }

    componentDidMount() {
        this.setState({currentProduct: this.props.product});
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
                <div className="priceHistoryNewPrice">
                    <input type="text" placeholder="New Price..."/>
                    <button>Save</button>
                </div>
            </Modal>
        )
    }
}
