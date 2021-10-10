import React, { Component } from 'react';
import './deliveryDetails.css';
import Modal from 'react-modal';
import DeliveryService from './../../services/deliveryService';
import NoImage from './../../assets/noimg.webp';

export default class DeliveryDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selectedDeliveryId: "",
            deliveryItems: [],
            newArray: []
        }
    }

    async componentDidMount() {
        this.setState({selectedDeliveryId: this.props.delivery});
        const items = await DeliveryService.getDeliveryItems(this.props.delivery);
            this.setState({deliveryItems: items});
            let array = [];
            for(let i of items) {
                const book = await DeliveryService.getBookFromDeliveryItem(i.id);
                if(book.id === null) {
                    const otherProduct = await DeliveryService.getOtherProductFromDeliveryItem(i.id);
                    const obj = {
                        amount: i.amount,
                        name: otherProduct.name,
                        image: otherProduct.coverImage,
                        price: parseInt(i.amount) * parseInt(otherProduct.price)
                    }
                    array.push(obj);
                }else {
                    const obj = {
                        amount: i.amount,
                        name: book.name,
                        image: book.coverImage,
                        price: parseInt(i.amount) * parseInt(book.price)
                    }
                    array.push(obj);
                }
            }
            this.setState({newArray: array});
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.delivery !== this.props.delivery) {
            this.setState({selectedDeliveryId: this.props.delivery});
            const items = await DeliveryService.getDeliveryItems(this.props.delivery);
            this.setState({deliveryItems: items});
            let array = [];
            for(let i of items) {
                const book = await DeliveryService.getBookFromDeliveryItem(i.id);
                if(book.id === null) {
                    const otherProduct = await DeliveryService.getOtherProductFromDeliveryItem(i.id);
                    const obj = {
                        amount: i.amount,
                        name: otherProduct.name,
                        image: otherProduct.coverImage,
                        price: parseInt(i.amount) * parseInt(otherProduct.price)
                    }
                    array.push(obj);
                }else {
                    const obj = {
                        amount: i.amount,
                        name: book.name,
                        image: book.coverImage,
                        price: parseInt(i.amount) * parseInt(book.price)
                    }
                    array.push(obj);
                }
            }
            this.setState({newArray: array});
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
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="deliveryDetailsModal">
                <div className="deliveryDetailsWrapper">
                    {this.state.newArray.map((n, ndx) => (
                        <div key={ndx} className="deliveryDetailsItem">
                            <img alt="pic" src={n.image === null ? NoImage : 'http://localhost:8080/uploads/' + n.image} className="deliveryDetailsItemImage"/>
                            <span className="deliveryDetailsItemLabel">{n.name}</span>
                            <span className="deliveryDetailsItemLabel">(x{n.amount})</span>
                            <span className="deliveryDetailsItemLabel">{n.price}din</span>
                        </div>
                    ))}
                </div>
            </Modal>
        )
    }
}
