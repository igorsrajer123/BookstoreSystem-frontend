import React, { Component } from 'react';
import './editProductAmount.css';
import Modal from 'react-modal';
import ProductsInBookstoreService from './../../services/productsInBookstoreService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class EditProductAmountModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            currentAmount: "",
            currentId: "",
            amountInvalid: false,
            currentType: null
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.editAmount = this.editAmount.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else
            this.setState({isOpen: true});
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product) {
            this.setState({currentAmount: this.props.product.amount});
            this.setState({currentId: this.props.product.id});
            this.setState({currentType: this.props.product.type});
        }
    }

    handleAmountChange = event => this.setState({currentAmount: event.target.value});

    async editAmount() {
        let invalidAmount = false;
        if(this.state.currentAmount === "" || !Number.isInteger(parseInt(this.state.currentAmount)) || parseInt(this.state.currentAmount) < 0) {
            this.setState({amountInvalid: true});
            invalidAmount = true;
        }else {
            this.setState({amountInvalid: false});
            invalidAmount = false;
        }

        if(!invalidAmount) {
            if(this.state.currentType === null) {
                const object = {
                    id: parseInt(this.state.currentId),
                    amount: parseInt(this.state.currentAmount)
                }
                const resp = await ProductsInBookstoreService.updateBooksBookstoresAmount(object);
                if(resp === 200){
                    NotificationManager.success("Amount successfully updated!", "Success!");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.reload();
                }else {
                    NotificationManager.error("Something went wrong!", "Error!");
                }
            }else {
                const object = {
                    id: parseInt(this.state.currentId),
                    amount: parseInt(this.state.currentAmount)
                }
                const resp = await ProductsInBookstoreService.updateOtherProductsBookstoresAmount(object);
                if(resp === 200){
                    NotificationManager.success("Amount successfully updated!", "Success!");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.reload();
                }else {
                    NotificationManager.error("Something went wrong!", "Error!");
                }
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editProductAmountModal">
                <NotificationContainer />
                <div className="changeProductAmountWrapper">
                    <input type="text" value={this.state.currentAmount} onChange={this.handleAmountChange} className="editProductAmountInput" />
                    <button className="editProductAmountSave" onClick={this.editAmount}>Save</button>
                </div>
            </Modal>
        )
    }
}
