import React, { Component } from 'react'
import './helperToolbar.css';

export default class HelperToolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sysAdminLogged: false,
            bookstoreAdminLogged: false,
            sellerLogged: false,
            customerLogged: false,
            onNewBookstorePage: false,
            onNewBookstoreAdminPage: false,
            onNewWriterPage: false,
            onNewProductPage: false,
            onNewSellerPage: false,
            onPublishersAndGenresPage: false,
            onProductsStockPage: false,
            onCashRegisterPage: false
        }

        this.newProductClick = this.newProductClick.bind(this);
        this.newBookstoreClick = this.newBookstoreClick.bind(this);
        this.newBookstoreAdminClick = this.newBookstoreAdminClick.bind(this);
        this.newSellerClick = this.newSellerClick.bind(this);
        this.newWriterClick = this.newWriterClick.bind(this);
        this.publishersAndGenresClick = this.publishersAndGenresClick.bind(this);
        this.productsStockClick = this.productsStockClick.bind(this);
        this.cashRegisterClick = this.cashRegisterClick.bind(this);
    }

    refreshPageOptions = () => {
        this.setState({onNewBookstorePage: false});
        this.setState({onNewBookstoreAdminPage: false});
        this.setState({onNewWriterPage: false});
        this.setState({onNewProductPage: false});
        this.setState({onNewSellerPage: false});
        this.setState({onPublishersAndGenresPage: false});
        this.setState({onProductsStockPage: false});
        this.setState({onCashRegisterPage: false});
    }

    setLoggedInStates(loggedIn) {
        if(loggedIn === null) {
            this.setState({sysAdminLogged: false});
            this.setState({bookstoreAdminLogged: false});
            this.setState({sellerLogged: false});
            this.setState({customerLogged: false});
        }else if(loggedIn.type === "ROLE_SYSTEM_ADMIN") {
            this.setState({sysAdminLogged: true});
            this.setState({bookstoreAdminLogged: false});
            this.setState({sellerLogged: false});
            this.setState({customerLogged: false});
        }else if(loggedIn.type === "ROLE_CUSTOMER") {
            this.setState({sysAdminLogged: false});
            this.setState({bookstoreAdminLogged: false});
            this.setState({sellerLogged: false});
            this.setState({customerLogged: true});
        }else if(loggedIn.type === "ROLE_BOOKSTORE_ADMIN") {
            this.setState({sysAdminLogged: false});
            this.setState({bookstoreAdminLogged: true});
            this.setState({sellerLogged: false});
            this.setState({customerLogged: false});
        }else if(loggedIn.type === "ROLE_SELLER") {
            this.setState({sysAdminLogged: false});
            this.setState({bookstoreAdminLogged: false});
            this.setState({sellerLogged: true});
            this.setState({customerLogged: false});
        }
    }

    componentDidMount() {
        this.setLoggedInStates(this.props.currentUser);
        const currentUrl = window.location.href.toString();
        if(currentUrl.includes("/newWriter")) {
            this.refreshPageOptions();
            this.setState({onNewWriterPage: true});
        }else if(currentUrl.includes("/newBookstore") && !currentUrl.includes("/newBookstoreAdmin")) {
            this.refreshPageOptions();
            this.setState({onNewBookstorePage: true});
        }else if(currentUrl.includes("/newBookstoreAdmin")) {
            this.refreshPageOptions();
            this.setState({onNewBookstoreAdminPage: true});
        }else if(currentUrl.includes("/newProduct")) {
            this.refreshPageOptions();
            this.setState({onNewProductPage: true});
        }else if(currentUrl.includes("/newSeller")) {
            this.refreshPageOptions();
            this.setState({onNewSellerPage: true});
        }else if(currentUrl.includes("/publishersAndGenres")) {
            this.refreshPageOptions();
            this.setState({onPublishersAndGenresPage: true});
        }else if(currentUrl.includes("/productsStock")) {
            this.refreshPageOptions();
            this.setState({onProductsStockPage: true});
        }else if(currentUrl.includes("/cashRegister")) {
            this.refreshPageOptions();
            this.setState({onCashRegisterPage: true})
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.currentUser !== this.props.currentUser) 
            this.setLoggedInStates(this.props.currentUser);
    }

    newWriterClick = () => window.location.href = "http://localhost:3000/newWriter";

    newBookstoreClick = () => window.location.href = "http://localhost:3000/newBookstore";

    newBookstoreAdminClick = () => window.location.href = "http://localhost:3000/newBookstoreAdmin";

    newProductClick = () => window.location.href = "http://localhost:3000/newProduct";

    newSellerClick = () => window.location.href = "http://localhost:3000/newSeller";

    publishersAndGenresClick = () => window.location.href = "http://localhost:3000/publishersAndGenres";

    productsStockClick = () => window.location.href =  "http://localhost:3000/productsStock";

    cashRegisterClick = () => window.location.href = "http://localhost:3000/cashRegister";

    render() {
        return (
            <div style={{display: this.props.currentUser === null ? 'none' : 'inline'}} className="helperToolbarWrapper">
                <div className="helperToolbarContainer">
                    <button className="helperToolbarOption" 
                            onClick={this.newBookstoreClick}
                            style={{color: this.state.onNewBookstorePage ? 'black' : '',
                                    borderBottomStyle: this.state.onNewBookstorePage ? 'solid' : '',
                                    borderColor: this.state.onNewBookstorePage ? 'black' : '',
                                    display: this.state.sysAdminLogged ? 'inline' : 'none'}}>New Bookstore</button>
                    <button className="helperToolbarOption" 
                            onClick={this.newBookstoreAdminClick}
                            style={{color: this.state.onNewBookstoreAdminPage ? 'black' : '',
                                    borderBottomStyle: this.state.onNewBookstoreAdminPage ? 'solid' : '',
                                    borderColor: this.state.onNewBookstoreAdminPage ? 'black' : '',
                                    display: this.state.sysAdminLogged ? 'inline' : 'none'}}>New Bookstore Admin</button>
                    <button className="helperToolbarOption" 
                            onClick={this.newSellerClick}
                            style={{color: this.state.onNewSellerPage ? 'black' : '',
                                    borderBottomStyle: this.state.onNewSellerPage ? 'solid' : '',
                                    borderColor: this.state.onNewSellerPage ? 'black' : '',
                                    display: this.state.bookstoreAdminLogged ? 'inline' : 'none'}}>New Bookstore Seller</button>
                    <button className="helperToolbarOption" 
                            onClick={this.newWriterClick}
                            style={{color: this.state.onNewWriterPage ? 'black' : '',
                                    borderBottomStyle: this.state.onNewWriterPage ? 'solid' : '',
                                    borderColor: this.state.onNewWriterPage ? 'black' : '',
                                    display: this.state.sysAdminLogged  ? 'inline' : 'none'}}>New Writer</button>
                    <button className="helperToolbarOption" 
                            onClick={this.newProductClick}
                            style={{color: this.state.onNewProductPage ? 'black' : '',
                                    borderBottomStyle: this.state.onNewProductPage ? 'solid' : '',
                                    borderColor: this.state.onNewProductPage ? 'black' : '',
                                    display: this.state.sysAdminLogged ? 'inline' : 'none'}}>New Product</button>
                    <button className="helperToolbarOption" 
                            onClick={this.publishersAndGenresClick}
                            style={{color: this.state.onPublishersAndGenresPage ? 'black' : '',
                                    borderBottomStyle: this.state.onPublishersAndGenresPage ? 'solid' : '',
                                    borderColor: this.state.onPublishersAndGenresPage ? 'black' : '',
                                    display: this.state.sysAdminLogged ? 'inline' : 'none'}}>Publishers & Genres</button>
                    <button className="helperToolbarOption" 
                            onClick={this.productsStockClick}
                            style={{color: this.state.onProductsStockPage ? 'black' : '',
                                    borderBottomStyle: this.state.onProductsStockPage ? 'solid' : '',
                                    borderColor: this.state.onProductsStockPage ? 'black' : '',
                                    display: this.state.bookstoreAdminLogged || this.state.sellerLogged ? 'inline' : 'none'}}>Products Stock</button>
                    <button className="helperToolbarOption" 
                            onClick={this.cashRegisterClick}
                            style={{color: this.state.onCashRegisterPage ? 'black' : '',
                                    borderBottomStyle: this.state.onCashRegisterPage ? 'solid' : '',
                                    borderColor: this.state.onCashRegisterPage ? 'black' : '',
                                    display: this.state.sellerLogged ? 'inline' : 'none'}}>Cash Register</button>
                </div>
            </div>
        )
    }
}
