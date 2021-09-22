
import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import "./topbar.css";

export default class Topbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            onHomePage: false,
            onBooksPage: false,
            onBookstoresPage: false,
            onWritersPage: false,
            onProfilePage: false,
            onOtherProductsPage: false
        }

        this.booksClick = this.booksClick.bind(this);
        this.homepageClick = this.homepageClick.bind(this);
        this.bookstoresClick = this.bookstoresClick.bind(this);
        this.writersClick = this.writersClick.bind(this);
        this.profileClick = this.profileClick.bind(this);
        this.otherProductsClick = this.otherProductsClick.bind(this);
    }

    booksClick = () => window.location.href = "http://localhost:3000/books";

    homepageClick = () => window.location.href = "http://localhost:3000/";

    bookstoresClick = () => window.location.href = "http://localhost:3000/bookstores";

    writersClick = () => window.location.href = "http://localhost:3000/writers";

    profileClick = () => window.location.href = "http://localhost:3000/profile";

    otherProductsClick = () => window.location.href = "http://localhost:3000/otherProducts";

    refreshPageOptions = () => {
        this.setState({onHomePage: false});
        this.setState({onBooksPage: false});
        this.setState({onBookstoresPage: false});
        this.setState({onWritersPage: false});
        this.setState({onProfilePage: false});
        this.setState({onOtherProductsPage: false});
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
        }else {
            this.refreshPageOptions();
            this.setState({onHomePage: true})
        }
    }

    render() {
        return (
            <div className="topbarWrapper">
                <div className="topbarTop">
                    <div className="topbarTopLeft">
                        <span className="topbarLogo">Bookstore++</span>
                    </div>
                    <div className="topbarTopCenter">
                        <div className="topbarSearch">
                            <input type="text" className="searchInput" placeholder="Search bookstores, books, writers..." />
                            <SearchIcon className="searchIcon" />
                        </div>
                    </div>
                    <div className="topbarTopRight">
                        <div className="options">
                            <span className="optionText">Sign In</span>
                            <span className="optionText">Sign Out</span>
                            <AddShoppingCartIcon className="shoppingCart"/>
                        </div>
                    </div>
                </div>
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
                                    borderColor: this.state.onProfilePage ? 'black' : ''}}>
                        Profile
                    </button>
                </div>
            </div>
        )
    }
}
