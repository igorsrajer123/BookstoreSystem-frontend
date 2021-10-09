
import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import './topbar.css';
import LoginModal from './../../modals/login/LoginModal';
import LoginService from './../../services/loginService';
import HelperToolbar from './HelperToolbar';
import FirstLoginModal from './../../modals/firstLogin/FirstLoginModal';

export default class Topbar extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            onHomePage: false,
            onBooksPage: false,
            onBookstoresPage: false,
            onWritersPage: false,
            onProfilePage: false,
            onOtherProductsPage: false,
            loggedIn: null,
            showHelperToolbar: false,
            onCustomersPage: false,
            sysAdminLogged: false,
            customerLoggedIn: false
        }

        this.booksClick = this.booksClick.bind(this);
        this.homepageClick = this.homepageClick.bind(this);
        this.bookstoresClick = this.bookstoresClick.bind(this);
        this.writersClick = this.writersClick.bind(this);
        this.profileClick = this.profileClick.bind(this);
        this.otherProductsClick = this.otherProductsClick.bind(this);
        this.loginClick = this.loginClick.bind(this);
        this.logoutClick = this.logoutClick.bind(this);
        this.customersClick = this.customersClick.bind(this);
        this.clickShoppingCartHandle = this.clickShoppingCartHandle.bind(this);
    }

    loginClick = () => this.child.current.toggleModal();

    logoutClick = () => LoginService.logout();

    booksClick = () => window.location.href = "http://localhost:3000/books";

    homepageClick = () => window.location.href = "http://localhost:3000/";

    bookstoresClick = () => window.location.href = "http://localhost:3000/bookstores";

    writersClick = () => window.location.href = "http://localhost:3000/writers";

    profileClick = () => window.location.href = "http://localhost:3000/profile";

    otherProductsClick = () => window.location.href = "http://localhost:3000/otherProducts";

    customersClick = () => window.location.href = "http://localhost:3000/customers";

    clickShoppingCartHandle = () => window.location.href = "http://localhost:3000/shoppingCart/" + this.state.loggedIn.id;

    refreshPageOptions = () => {
        this.setState({onHomePage: false});
        this.setState({onBooksPage: false});
        this.setState({onBookstoresPage: false});
        this.setState({onWritersPage: false});
        this.setState({onProfilePage: false});
        this.setState({onOtherProductsPage: false});
        this.setState({onCustomersPage: false});
    }

    async componentDidMount() {
        const currentUrl = window.location.href.toString();
        if(currentUrl.includes("/books") && !currentUrl.includes("/bookstores")) {
            this.refreshPageOptions();
            this.setState({onBooksPage: true});
        }else if(currentUrl.includes("/writers")) {
            this.refreshPageOptions();
            this.setState({onWritersPage: true});
        }else if(currentUrl.includes("/bookstores")) {
            this.refreshPageOptions();
            this.setState({onBookstoresPage: true});
        }else if(currentUrl.includes("/profile")) {
            this.refreshPageOptions();
            this.setState({onProfilePage: true})
        }else if(currentUrl.includes("/otherProducts")) {
            this.refreshPageOptions();
            this.setState({onOtherProductsPage: true})
        }else if(currentUrl === "http://localhost:3000/") {
            this.refreshPageOptions();
            this.setState({onHomePage: true});
        }else if(currentUrl === "http://localhost:3000/customers"){
            this.refreshPageOptions();
            this.setState({onCustomersPage: true})
        }else{
            this.refreshPageOptions();
        }

        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null)
            this.setState({loggedIn: null})
        else {
            this.setState({loggedIn: currentUser});
            if(currentUser.type === "ROLE_SYSTEM_ADMIN")
                this.setState({sysAdminLogged: true});
            else
                this.setState({sysAdminLogged: false});

            if(currentUser.type === "ROLE_CUSTOMER") 
                this.setState({customerLoggedIn: true});
            else
                this.setState({customerLoggedIn: false});

            if(currentUser.type === "ROLE_SELLER" || currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                if(currentUser.firstLogin) {
                    this.child2.current.toggleModal();

                    if(!window.location.href.toString().includes("profile")){
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        window.location.href="http://localhost:3000/profile";
                        this.child2.current.toggleModal();
                        this.child2.current.toggleModal();
                    }
                }
            }
        }
    }

    render() {
        return (
            <div className="topbarWrapper">
                <div className="topbarTop">
                    <div className="topbarTopLeft">
                        <span className="topbarLogo" onClick={this.homepageClick}>Bookstore++</span>
                    </div>
                    <div className="topbarTopCenter">
                        <div className="topbarSearch">
                            <input type="text" className="searchInput" placeholder="Search bookstores, books, writers..." />
                            <SearchIcon className="searchIcon" />
                        </div>
                    </div>
                    <div className="topbarTopRight">
                        <div className="options">
                            <span className="optionText" onClick={this.loginClick} style={{display: this.state.loggedIn==null ? 'inline' : 'none'}}>Sign In</span>
                            <span className="optionText" onClick={this.logoutClick} style={{display: this.state.loggedIn==null ? 'none' : 'inline'}}>Sign Out</span>
                            <AddShoppingCartIcon className="shoppingCart" onClick={this.clickShoppingCartHandle} style={{display: this.state.customerLoggedIn ? 'inline' : 'none'}}/>
                        </div>
                    </div>
                </div>
                <LoginModal ref={this.child}/>
                <FirstLoginModal ref={this.child2}/>
                <hr className="topbarHr"/>
                <div className="topbarBottom">
                    <button className="topbarBottomButton" 
                            onClick={this.homepageClick} 
                            style={{color: this.state.onHomePage ? 'black' : '',
                                    borderBottomStyle: this.state.onHomePage ? 'solid' : '',
                                    borderColor: this.state.onHomePage ? 'black' : ''}}>
                        Home Page
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.bookstoresClick} 
                            style={{color: this.state.onBookstoresPage ? 'black' : '',
                                    borderBottomStyle: this.state.onBookstoresPage ? 'solid' : '',
                                    borderColor: this.state.onBookstoresPage ? 'black' : ''}}>
                        Bookstores
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.booksClick} 
                            style={{color: this.state.onBooksPage ? 'black' : '',
                                    borderBottomStyle: this.state.onBooksPage ? 'solid' : '',
                                    borderColor: this.state.onBooksPage ? 'black' : ''}}>
                        Books
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.writersClick} 
                            style={{color: this.state.onWritersPage ? 'black' : '',
                                    borderBottomStyle: this.state.onWritersPage ? 'solid' : '',
                                    borderColor: this.state.onWritersPage ? 'black' : ''}}>
                        Writers
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.otherProductsClick} 
                            style={{color: this.state.onOtherProductsPage ? 'black' : '',
                                    borderBottomStyle: this.state.onOtherProductsPage ? 'solid' : '',
                                    borderColor: this.state.onOtherProductsPage ? 'black' : ''}}>
                        Other Products
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.profileClick} 
                            style={{color: this.state.onProfilePage ? 'black' : '',
                                    borderBottomStyle: this.state.onProfilePage ? 'solid' : '',
                                    borderColor: this.state.onProfilePage ? 'black' : '',
                                    display: this.state.loggedIn==null ? 'none' : 'inline'}}>
                        Profile
                    </button>
                    <button className="topbarBottomButton" 
                            onClick={this.customersClick} 
                            style={{color: this.state.onCustomersPage ? 'black' : '',
                                    borderBottomStyle: this.state.onCustomersPage ? 'solid' : '',
                                    borderColor: this.state.onCustomersPage ? 'black' : '',
                                    display: this.state.sysAdminLogged=== false ? 'none' : 'inline'}}>
                        Customers & Deliveries
                    </button>
                </div>
                <div className="topbarBottomBottom">
                    <HelperToolbar currentUser={this.state.loggedIn} />
                </div>
            </div>
        )
    }
}
