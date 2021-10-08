import React, { Component } from 'react';
import './shoppingCart.css';
import LoginService from './../../services/loginService';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';
import CustomerService from './../../services/customerService';
import ShoppingCartService from './../../services/shoppingCartService';
import NoImage from './../../assets/noimg.webp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUser: null,
            shoppingCartItems: [],
            newArrayObjects: []
        }

        this.discardItem = this.discardItem.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();

        if(currentUser === null || currentUser.type === "ROLE_SELLER" ||
            currentUser.type === "ROLE_BOOKSTORE_ADMIN" || currentUser.type === "ROLE_SYSTEM_ADMIN")
                window.location.href = "http://localhost:3000/";
        
        this.setState({currentUser: currentUser});
        
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
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="shoppingCartWrapper">
                <NotificationContainer />
                <div className="shoppingCartItems">
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
                <div className="vl"></div>
                <div className="shoppingCartPaymentDetails">
                    adsasddsa
                </div>
            </div>
        )
    }
}
