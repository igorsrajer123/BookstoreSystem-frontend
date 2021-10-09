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
import DeliveryService from './../../services/deliveryService';

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUser: null,
            currentCustomer: "",
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
            cvv: "",
            oneItemOutOfStock: false,
            phoneValid: "",
            addressValid: "",
            postalCodeValid: "",
            cardNumberValid: "",
            expirationDateValid: "",
            cvvValid: ""
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
        this.setState({oneItemOutOfStock: false});

        const customer = await CustomerService.getCustomerByUser(currentUser.id);
        this.setState({currentCustomer: customer});
        const shoppingCart = await ShoppingCartService.getShoppingCartByUserId(parseInt(customer.id));
        const shoppingCartItems = await ShoppingCartService.getShoppingCartItems(shoppingCart.id);
        this.setState({shoppingCartItems: shoppingCartItems});
        
        let newArray = [];
        for(var item of shoppingCartItems) {
            let product = await BookService.getBookFromShoppingCartItem(item.id);
            if(product.id === null) {
                product = await OtherProductService.getOtherProductByShoppingCartItem(item.id);
                const available = await ShoppingCartService.checkItemAvailable(product.id, parseInt(item.amount));
                if(!available)
                    this.setState({oneItemOutOfStock: true});
                
                const obj = {
                    id: item.id,
                    amount: item.amount,
                    name: product.name,
                    coverImage: product.coverImage,
                    price: product.price,
                    available: available
                }
                newArray.push(obj);
            }else {
                const available = await ShoppingCartService.checkItemAvailable(product.id, parseInt(item.amount));
                if(!available)
                    this.setState({oneItemOutOfStock: true});

                const obj = {
                    id: item.id,
                    amount: item.amount,
                    name: product.name,
                    coverImage: product.coverImage,
                    price: product.price,
                    available: available
                }
                newArray.push(obj);
            }
        }
        this.setState({newArrayObjects: newArray});

        if(newArray.length === 0) 
            this.setState({shoppingCartEmpty: true});
        else
            this.setState({shoppingCartEmpty: false});
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

        for(let a of array){
            if(!a.available){
                this.setState({oneItemOutOfStock: true});
                return;
            }
        }
        this.setState({oneItemOutOfStock: false}); 
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

    handleCardNumberInput = e => {
        const value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        this.setState({cardNumber: value});
    }

    handleExpirationDateInput = e =>  this.setState({expirationDate: e.target.value});

    handleCVVInput = e => {
        const value = e.target.value.replace(/[^\dA-Z]/g, '').trim();
        this.setState({cvv: value});
    }

    async submitDeliveryRequest() {
        if(this.state.oneItemOutOfStock) 
            NotificationManager.error("Some items are out of stock!", "Error!");
        else{
            let addressValid = false;
            let phoneValid = false;
            let postalCodeValid = false;

            if(this.state.currentAddress !== ""){
                this.setState({addressValid: true});
                addressValid = true;
            }else {
                this.setState({addressValid: false});
                addressValid = false;
            }

            if(this.state.currentPhoneNumber !== "") {
                this.setState({phoneValid: true});
                phoneValid = true;
            }else {
                this.setState({phoneValid: false});
                phoneValid = false;
            }

            if(this.state.currentPostalCode !== "") {
                this.setState({postalCodeValid: true});
                postalCodeValid = true;
            }else {
                this.setState({postalCodeValid: false});
                postalCodeValid = false;
            }

            if(addressValid && phoneValid && postalCodeValid) {
                if(this.state.payInPerson) {
                    let deliveryItems = [];
                    for(let i of this.state.shoppingCartItems) {
                        const product = await BookService.getBookFromShoppingCartItem(i.id);
                        if(product.id === null) {
                            const product = await OtherProductService.getOtherProductByShoppingCartItem(i.id);
                            const obj = {
                                amount: i.amount,
                                book: null,
                                otherProduct: {
                                    id: product.id
                                }
                            }
                            deliveryItems.push(obj);
                        }else {
                            const obj = {
                                amount: i.amount,
                                book: {
                                    id: product.id
                                },
                                otherProduct: null
                            }
                            deliveryItems.push(obj);
                        }
                    }
                    const obj = {
                        customer: {
                            id: this.state.currentCustomer.id
                        },
                        contactPhone: this.state.currentPhoneNumber,
                        deliveryAddress: this.state.currentAddress,
                        postalCode: this.state.currentPostalCode,
                        note: this.state.currentNote,
                        deliveryItems: deliveryItems
                    }
                    const response = await DeliveryService.createDelivery(obj);
                    if(response === 201) {
                        NotificationManager.success("Delivery successfully created. You will be notified if it's accepted or declined!", "Success!");
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        window.location.href="http://localhost:3000/"
                    }else {
                        NotificationManager.error("Error has occurred!!", "Error!");
                    }
                }else {
                    let cardNumberValid = false;
                    let cvvValid = false;
                    let expirationDateValid = false;

                    if(this.state.cardNumber === "" || this.state.cardNumber.length < 19){
                        this.setState({cardNumberValid: false});
                        cardNumberValid = false;
                    }else {
                        this.setState({cardNumberValid: true});
                        cardNumberValid = true;
                    }

                    if(this.state.cvv === "" || this.state.cvv.length < 4) {
                        this.setState({cvvValid: false});
                        cvvValid = false;
                    }else {
                        this.setState({cvvValid: true});
                        cvvValid = true;
                    }

                    if(this.state.expirationDate === "" || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(this.state.expirationDate)) {
                        this.setState({expirationDateValid: false});
                        expirationDateValid = false;
                    }else {
                        this.setState({expirationDateValid: true});
                        expirationDateValid = true;
                    }

                    if(cardNumberValid && cvvValid && expirationDateValid) {
                        let deliveryItems = [];
                        for(let i of this.state.shoppingCartItems) {
                            const product = await BookService.getBookFromShoppingCartItem(i.id);
                            if(product.id === null) {
                                const product = await OtherProductService.getOtherProductByShoppingCartItem(i.id);
                                const obj = {
                                    amount: i.amount,
                                    book: null,
                                    otherProduct: {
                                        id: product.id
                                    }
                                }
                                deliveryItems.push(obj);
                            }else {
                                const obj = {
                                    amount: i.amount,
                                    book: {
                                        id: product.id
                                    },
                                    otherProduct: null
                                }
                                deliveryItems.push(obj);
                            }
                        }

                        const obj = {
                            customer: {
                                id: this.state.currentCustomer.id
                            },
                            contactPhone: this.state.currentPhoneNumber,
                            deliveryAddress: this.state.currentAddress,
                            postalCode: this.state.currentPostalCode,
                            note: this.state.currentNote,
                            deliveryItems: deliveryItems
                        }
                        
                        const response = await DeliveryService.createDelivery(obj);
                        if(response === 201) {
                            NotificationManager.success("Delivery successfully created. You will be notified if it's accepted or declined!", "Success!");
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            window.location.href="http://localhost:3000/"
                        }else {
                            NotificationManager.error("Error has occurred!!", "Error!");
                        }
                    }else {
                        NotificationManager.error("Please input the correct values!", "Error!");  
                    }
                }
            }else 
                NotificationManager.error("Please fill out all marked fields!", "Error!");  
        }
    }

    render() {
        return (
            <div className="shoppingCartWrapper">
                <NotificationContainer />
                <ReactTooltip id="payWithCreditCard" type="dark" place="top" effect="solid"><span>Pay using credit card</span></ReactTooltip>
                <ReactTooltip id="payInReal" type="dark" place="top" effect="solid"><span>Pay in cash when delivery comes to your specified location</span></ReactTooltip>
                <div className="shoppingCartItems">
                    <h1 style={{textAlign: 'center', color: 'brown', fontFamily: '-moz-initial', display: this.state.shoppingCartEmpty ? '' : 'none'}}>Shopping Cart is empty!</h1>
                    <ol>
                        {this.state.newArrayObjects.map((i, idx) => (
                            <div key={idx}>
                                <li className="shoppingCartItem" style={{backgroundColor: i.available ? '' : '', color: 'red'}}>
                                    <h4 style={{display: i.available ? 'none' : 'inline'}}>Out of Stock!</h4>
                                    <img alt="pic" src={i.coverImage === null ? NoImage : "http://localhost:8080/uploads/" + i.coverImage } className="shoppingCartItemPicture"/>
                                    <span className="shoppingCartItemLabel">{i.name} (x{i.amount}) - <i style={{color: 'black'}}>{i.amount * i.price}din</i></span>
                                    <button className="shoppingCartItemDiscardButton" onClick={() => this.discardItem(i.id)}>Discard</button>
                                </li>  
                            </div>
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
                            <input type="text" placeholder="First Name" className="shoppingCartCustomerInput" onChange={this.handleFirstNameInput} disabled={true} value={this.state.currentUser === null ? '' : this.state.currentFirstName}/>
                            <input type="text" placeholder="Last Name" className="shoppingCartCustomerInput" onChange={this.handleLastNameInput} disabled={true} value={this.state.currentUser === null ? '' : this.state.currentLastName}/>
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <input type="text" placeholder="Email" className="shoppingCartCustomerInput" onChange={this.handleEmailInput} disabled={true} value={this.state.currentUser === null ? '' : this.state.currentEmail}/>
                            <input type="text" placeholder="Phone Number" className="shoppingCartCustomerInput" onChange={this.handlePhoneInput} style={{borderStyle: this.state.phoneValid !== false ? 'none' : 'solid', borderColor: 'red'}} value={this.state.currentUser === null ? '' : this.state.currentPhoneNumber}/>
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <input type="text" placeholder="Shipment Location" className="shoppingCartCustomerInput" onChange={this.handleAddressInput } style={{borderStyle: this.state.addressValid !== false ? 'none' : 'solid', borderColor: 'red'}} value={this.state.currentUser === null ? '' : this.state.currentAddress}/>
                            <input type="text" placeholder="Postal Code" className="shoppingCartCustomerInput" onChange={this.handlePostalCodeInput} style={{borderStyle: this.state.postalCodeValid !== false ? 'none' : 'solid', borderColor: 'red'}} value={this.state.currentPostalCode} />
                        </div>
                        <div className="shoppingCartCustomerInformation1">
                            <textarea placeholder="Note" onChange={this.handleNoteInput} className="shoppingCartCustomerTextarea" value={this.state.currentNote}></textarea>
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
                                        <span className="creditCardDetailsInput">Card Number<input type="text" maxLength="19" placeholder="xxxx xxxx xxxx xxxx" onChange={this.handleCardNumberInput} value={this.state.cardNumber} className="shoppingCartCustomerInput" style={{borderStyle: this.state.cardNumberValid !== false ? 'none' : 'solid', borderColor: 'red'}}/></span>
                                        <span className="creditCardDetailsInput">Expiration Date<input type="text" maxLength="5" placeholder="MM/YY" onChange={this.handleExpirationDateInput} value={this.state.expirationDate} className="shoppingCartCustomerInput" style={{borderStyle: this.state.expirationDateValid !== false ? 'none' : 'solid', borderColor: 'red'}}/></span>
                                        <span className="creditCardDetailsInput">CVV<input type="text" maxLength="4" placeholder="xxxx" onChange={this.handleCVVInput} value={this.state.cvv} className="shoppingCartCustomerInput" style={{borderStyle: this.state.cvvValid !== false ? 'none' : 'solid', borderColor: 'red'}}/></span>
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
