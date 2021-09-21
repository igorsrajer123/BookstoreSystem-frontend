
import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import "./topbar.css";

export default class Topbar extends Component {
    render() {
        return (
            <div className="topbarWrapper">
                <div className="topbarTop">
                    <div className="topbarTopLeft">
                        <span className="topbarLogo">Bookstore++</span>
                    </div>
                    <div className="topbarTopCenter">
                        <div className="topbarSearch">
                            <input type="text" className="searchInput" placeholder="Search books, comic books, schoolkit..." />
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
                <hr/>
                <div className="topbarBottom">
                    <button className="topbarBottomButton">Home Page</button>
                    <button className="topbarBottomButton">Bookstores</button>
                    <button className="topbarBottomButton">Books</button>
                    <button className="topbarBottomButton">Writers</button>
                    <button className="topbarBottomButton">Other Products</button>
                    <button className="topbarBottomButton">Profile</button>
                </div>
            </div>
        )
    }
}
