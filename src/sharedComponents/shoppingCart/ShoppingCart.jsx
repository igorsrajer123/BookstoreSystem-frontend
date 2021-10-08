import React, { Component } from 'react';
import './shoppingCart.css';
import LoginService from './../../services/loginService';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';
import CustomerService from './../../services/customerService';
import ShoppingCartService from './../../services/shoppingCartService';
import NoImage from './../../assets/noimg.webp';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ReactTooltip from 'react-tooltip';

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUser: null,
            shoppingCartItems: [],
            newArrayObjects: [],
            shoppingCartEmpty: false,
            payCreditCard: false,
            payInPerson: false,
            currentFirstName: "",
            currentLastName: "",
            currentEmail: "",
            currentPhoneNumber: "",
            currentAddress: "",
            currentPostalCode: "",
            currentNote: "",
            cardNumber: "",
            expirationDate: "",
            cvv: ""
        }

        this.discardItem = this.discardItem.bind(this);
        this.payUsingCreditCardClick = this.payUsingCreditCardClick.bind(this);
        this.payInPersonClick = this.payInPersonClick.bind(this);
        this.submitDeliveryRequest = this.submitDeliveryRequest.bind(this);
        this.handleFirstNameInput = this.handleFirstNameInput.bind(this);
        this.handleLastNameInput = this.handleLastNameInput.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handlePhoneInput = this.handlePhoneInput.bind(this);
        this.handleAddressInput = this.handleAddressInput.bind(this);
        this.handlePostalCodeInput = this.handlePostalCodeInput.bind(this);
        this.handleNoteInput = this.handleNoteInput.bind(this);
        this.handleCardNumberInput = this.handleCardNumberInput.bind(this);
        this.handleExpirationDateInput = this.handleExpirationDateInput.bind(this);
        this.handleCVVInput = this.handleCVVInput.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();

        if(currentUser === null || currentUser.type === "ROLE_SELLER" ||
            currentUser.type === "ROLE_BOOKSTORE_ADMIN" || currentUser.type === "ROLE_SYSTEM_ADMIN")
                window.location.href = "http://localhost:3000/";
        
        this.setState({currentUser: currentUser});
        this.setState({currentFirstName: currentUser.firstName});
        this.setState({currentLastName: currentUser.lastName});
        this.setState({currentEmail: currentUser.email});
        this.setState({currentPhoneNumber: currentUser.phoneNumber});
        this.setState({currentAddress: currentUser.address + ", " + currentUser.city});

        const customer = await CustomerService.getCustomerByUser(currentUser.id);
        const shoppingCart = await ShoppingCartService.getShoppingCartByUserId(parseInt(customer.id));
        const shoppingCartItems = await ShoppingCartService.getShoppingCartItems(shoppingCart.id);
        this.setState({shoppingCartItems: shoppingCartItems});
        
        let newArray = [];
        for(var item of shoppingCartItems) {
            let product = await BookService.getBookFromShoppingCartItem(item.id);
            if(product.id === null) {
                product = await OtherProductService.getOtherProductByShoppingCartItem(item.id);
                const obj = {
                    id: item.id,
                    amount: item.amount,
                    name: product.name,
                    coverImage: product.coverImage,
                    price: product.price
                }
                newArray.push(obj);
            }else {
                const obj = {
                    id: item.id,
                    amount: item.amount,
                    name: product.name,
                    coverImage: product.coverImage,
                    price: product.price
                }
                newArray.push(obj);
            }
        }
        this.setState({newArrayObjects: newArray});

        if(newArray.length === 0) 
            this.setState({shoppingCartEmpty: true});
        else
            this.setState({shoppingCartEmpty: false});

        console.log(newArray)
    }

    async discardItem(id) {
        let array = [];
        for(let p of this.state.newArrayObjects) 
            if(p.id !== id) 
                array.push(p);
            
        this.setState({newArrayObjects: array});
        const status = await ShoppingCartService.deleteShoppingCartItem(id);
        if(status === 200) {
            NotificationManager.success("Item successfully removed!", "Success!");
            if(this.state.newArrayObjects.length === 0)
                this.setState({shoppingCartEmpty: true});
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    payUsingCreditCardClick = () => {
        if(this.state.payCreditCard) {
            this.setState({payCreditCard: false});
        }else if(this.state.payInPerson) {
            this.setState({payInPerson: false});
            this.setState({payCreditCard: true});
        }else {
            this.setState({payCreditCard: true});
        }
    }

    payInPersonClick = () => {
        if(this.state.payCreditCard) {
            this.setState({payCreditCard: false});
            this.setState({payInPerson: true});
        }else if(this.state.payInPerson) {
            this.setState({payInPerson: false});
        }else {
            this.setState({payInPerson: true});
        }
    }

    handleFirstNameInput = e => this.setState({currentFirstName: e.target.value});

    handleLastNameInput = e => this.setState({currentLastName: e.target.value});

    handleEmailInput = e => this.setState({currentEmail: e.target.value});

    handlePhoneInput = e => this.setState({currentPhoneNumber: e.target.value});

    handleAddressInput = e => this.setState({currentAddress: e.target.value});

    handlePostalCodeInput = e => this.setState({currentPostalCode: e.target.value});

    handleNoteInput = e => this.setState({currentNote: e.target.value});

    handleCardNumberInput = e => this.setState({cardNumber: e.target.value});

    handleExpirationDateInput = e => this.setState({expirationDate: e.target.value});

    handleCVVInput = e => this.setState({cvv: e.target.value});

    async submitDeliveryRequest() {

    }

    render() {
        return (
            <div className="shoppingCartWrapper">
                <NotificationContainer />
                <ReactTooltip id="payWithCreditCard" type="dark" place="top" effect="solid"><span>Pay using credit card</span></ReactTooltip>
                <ReactTooltip id="payInReal" type="dark" place="top" effect="solid"><span>Pay when delivery comes to your specified location</span></ReactTooltip>
                <div className="shoppingCartItems">
                    <h1 style={{textAlign: 'center', color: 'brown', fontFamily: '-moz-initial', display: this.state.shoppingCartEmpty ? '' : 'none'}}>Shopping Cart is empty!</h1>
                    <ol>
                        {this.state.newArrayObjects.map(i => (
                            <li key={i.id} className="shoppingCartItem">
                                <img alt="pic" src={i.coverImage === null ? NoImage : "http://localhost:8080/uploads/" + i.coverImage } className="shoppingCartItemPicture"/>
                                <span className="shoppingCartItemLabel">{i.name} (x{i.amount}) - <i style={{color: 'black'}}>{i.amount * i.price}din</i></span>
                                <button className="shoppingCartItemDiscardButton" onClick={() => this.discardItem(i.id)}>Discard</button>
                            </li>  
                        ))}
                    </ol>
                </div>
                <div className="vl" style={{display: this.state.shoppingCartEmpty ? 'none' : 'inline'}}></div>
                <div className="shoppingCartPaymentDetails" style={{display: this.state.shoppingCartEmpty ? 'none' : 'inline'}}>
                    <div className="shoppingCartCustomerInformation">
                        <div className="shoppingCartCustomerInformationHeader1">
                            <h3 className="shoppingCartCustomerInformationHeader">Please enter the correct contact information*</h3>
                            <h4 className="shoppingCartCustomerInformationHeader">Delivery will arrive in the next 7 work days at the location you specify**</h4>
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <input type="text" placeholder="First Name" className="shoppingCartCustomerInput" onChange={this.handleFirstNameInput} value={this.state.currentUser === null ? '' : this.state.currentFirstName}/>
                            <input type="text" placeholder="Last Name" className="shoppingCartCustomerInput" onChange={this.handleLastNameInput} value={this.state.currentUser === null ? '' : this.state.currentLastName}/>
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <input type="text" placeholder="Email" className="shoppingCartCustomerInput" onChange={this.handleEmailInput} value={this.state.currentUser === null ? '' : this.state.currentEmail}/>
                            <input type="text" placeholder="Phone Number" className="shoppingCartCustomerInput" onChange={this.handlePhoneInput} value={this.state.currentUser === null ? '' : this.state.currentPhoneNumber}/>
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <input type="text" placeholder="Shipment Location" className="shoppingCartCustomerInput" onChange={this.handleAddressInput } value={this.state.currentUser === null ? '' : this.state.currentAddress}/>
                            <input type="text" placeholder="Postal Code" className="shoppingCartCustomerInput" onChange={this.handleNoteInput} value={this.state.currentNote} />
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <textarea placeholder="Note" className="shoppingCartCustomerTextarea"></textarea>
                        </div>
                    </div>
                    <div className="shoppingCartCustomerBillingDetails">
                            <h3 style={{color: 'brown'}}>Payment Method</h3>
                            <div className="shoppingCartCustomerBillingDetailsChooseButton">
                                    <div className="billingDetailsButtons" data-tip data-for="payWithCreditCard" style={{borderBottomStyle: this.state.payCreditCard ? 'solid' : 'none'}} onClick={this.payUsingCreditCardClick}>
                                        <CreditCardIcon />
                                    </div>
                                    <div className="billingDetailsButtons" data-tip data-for="payInReal" style={{borderBottomStyle: this.state.payInPerson ? 'solid' : 'none'}} onClick={this.payInPersonClick}>
                                        <LocalShippingIcon />
                                    </div>
                            </div>
                            <div className="shoppingCartCustomerBillingDetailsChooseButton2">
                                <div className="creditCardDetails" style={{display: this.state.payCreditCard ? '' : 'none'}}>
                                    <div className="creditCardDetails2">
                                        <span className="creditCardDetailsInput">Card Number<input type="text" placeholder="xxxx xxxx xxxx xxxx" onChange={this.handleCardNumberInput} value={this.state.cardNumber} className="shoppingCartCustomerInput"/></span>
                                        <span className="creditCardDetailsInput">Expiration Date<input type="text" maxLength="5" placeholder="MM/YY" onChange={this.handleExpirationDateInput} value={this.state.expirationDate} className="shoppingCartCustomerInput"/></span>
                                        <span className="creditCardDetailsInput">CVV<input type="text" maxLength="4" placeholder="xxxx" onChange={this.handleCVVInput} value={this.state.cvv} className="shoppingCartCustomerInput"/></span>
                                    </div>
                                </div>
                                <button className="createShippingRequest" style={{display: this.state.payCreditCard || this.state.payInPerson ? '' : 'none'}} onClick={this.submitDeliveryRequest}>Submit Request</button>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}
