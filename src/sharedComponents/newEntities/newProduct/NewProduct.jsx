import React, { Component } from 'react';
import './newProduct.css';
import LoginService from './../../../services/loginService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DatePicker from 'react-datepicker';
import PublisherService from './../../../services/publisherService';
import BookService from './../../../services/bookService';
import OtherProductService from './../../../services/otherProductService';
import ChooseGenresModal from './../../../modals/genre/ChooseGenresModal';

export default class NewProduct extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();

        this.state = {
            currentPublishedDate: null,
            currentExpirationDate: null,
            selectedProductClass: "",
            allPublishers: [],
            selectedPublisherId: "",
            selectedLanguage: "",
            selectedCoverType: "",
            selectedOtherProductType: "",
            currentCode: "",
            currentName: "",
            currentDescription: "",
            currentPrice: "",
            currentNumberOfPages: "",
            codeValid: null,
            nameValid: null,
            priceValid: null,
            publishedValid: null,
            publisherValid: null,
            otherProductTypeValid: null,
            numberOfPagesValid: null,
            languageValid: null,
            coverTypeValid: null,
            dataFromChild: null,
            genresValid: null
        }

        this.handlePublishedDateChange = this.handlePublishedDateChange.bind(this);
        this.handleExpirationDateChange = this.handleExpirationDateChange.bind(this);
        this.handleProductClassChange = this.handleProductClassChange.bind(this);
        this.handlePublisherChange = this.handlePublisherChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleCoverTypeChange = this.handleCoverTypeChange.bind(this);
        this.submitNewProduct = this.submitNewProduct.bind(this);
        this.handleOtherProductTypeChange = this.handleOtherProductTypeChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleNumberOfPagesChange = this.handleNumberOfPagesChange.bind(this);
    }

    handlePublishedDateChange = date => this.setState({currentPublishedDate: date});

    handleExpirationDateChange = date => this.setState({currentExpirationDate: date});

    handleProductClassChange = event => this.setState({selectedProductClass: event.target.value});

    handlePublisherChange = event => this.setState({selectedPublisherId: event.target.value});

    handleLanguageChange = event => this.setState({selectedLanguage: event.target.value});

    handleCoverTypeChange = event => this.setState({selectedCoverType: event.target.value});

    handleOtherProductTypeChange = event => this.setState({selectedOtherProductType: event.target.value});

    handleCodeChange = event => this.setState({currentCode: event.target.value});

    handleNameChange = event => this.setState({currentName: event.target.value});

    handleDescriptionChange = event => this.setState({currentDescription: event.target.value});

    handlePriceChange = event => this.setState({currentPrice: event.target.value});

    handleNumberOfPagesChange = event => this.setState({currentNumberOfPages: event.target.value});

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";
        
        const allPublishers = await PublisherService.getAllPublishers();
        this.setState({allPublishers: allPublishers});
    }

    handleCallback = childData => this.setState({dataFromChild: childData});
    
    async submitNewProduct() {
        if(this.state.selectedProductClass === "BOOK") {
            const productValid = await this.checkProductValid();
            const bookValid = this.checkBookValid();

            if(productValid && bookValid) 
                await this.createNewBook();

        }else if(this.state.selectedProductClass === "OTHER_PRODUCT") {
            const productValid = await this.checkProductValid();
            const otherProductValid = this.checkOtherProductValid();
            
            if(productValid && otherProductValid)
                await this.createNewOtherProduct();
        }else {
            NotificationManager.error("Please choose product class and fill out empty fields!", "Error!");
        }
    }

    checkOtherProductValid() {
        let validOtherProductType = false;

        if(this.state.selectedOtherProductType === ""){
            this.setState({otherProductTypeValid: false});
            validOtherProductType = false;
        }else{
            this.setState({otherProductTypeValid: true});
            validOtherProductType = true;
        }

        if(validOtherProductType) 
            return true;
        else
            return false;
    }

    checkBookValid() {
        let validNumberOfPages = false;
        let validCoverType = false;
        let validLanguage = false;
        let validGenres = false;

        if(this.state.currentNumberOfPages === "") {
            this.setState({numberOfPagesValid: false});
            validNumberOfPages = false;
        }else{
            this.setState({numberOfPagesValid: true});
            validNumberOfPages = true;
        }

        if(this.state.selectedLanguage === ""){
            this.setState({languageValid: false});
            validLanguage = false;
        }else{
            this.setState({languageValid: true});
            validLanguage = true;
        }

        if(this.state.selectedCoverType === ""){
            this.setState({coverTypeValid: false});
            validCoverType = false;
        }else{
            this.setState({coverTypeValid: true});
            validCoverType = true;
        }

        if(this.state.dataFromChild === "" || this.state.dataFromChild === null) {
            this.setState({genresValid: false});
            validGenres = false;
        }else {
            this.setState({genresValid: true});
            validGenres = true;
        }

        if(validNumberOfPages && validCoverType && validLanguage && validGenres)
            return true;
        else
            return false;
    }

    async checkProductCodeTaken() {
        const allBooks = await BookService.getAllBooks();
        const allOtherProducts = await OtherProductService.getAllOtherProducts();

        for (let b of allBooks) 
            if(b.code === this.state.currentCode) 
                return true;

        for (let o of allOtherProducts) 
            if(o.code === this.state.currentCode) 
                return true;

        return false;
    }

    async checkProductValid() {
        let validCode = false;
        let validName = false;
        let validPrice = false;
        let validPublisher = false;
        let validPublishedDate = false;

        const codeTaken = await this.checkProductCodeTaken();

        if(this.state.currentCode === "") {
            this.setState({codeValid: false});
            validCode = false;
        }else {
            if(codeTaken) {
                this.setState({codeValid: false});
                validCode = false;
                NotificationManager.error("Product code is already taken!", "Error!");
            }else {
                this.setState({codeValid: true});
                validCode = true;
            }
        }

        if(this.state.currentName === "") {
            this.setState({nameValid: false});
            validName = false;
        }else {
            this.setState({nameValid: true});
            validName = true;
        }
        
        if(this.state.currentPrice === "") {
            this.setState({priceValid: false});
            validPrice = false;
        }else{
            this.setState({priceValid: true});
            validPrice = true;
        }

        if(this.state.selectedPublisherId === "") {
            this.setState({publisherValid: false});
            validPublisher = false;
        }else{
            this.setState({publisherValid: true});
            validPublisher = true;
        }
        
        if(this.state.currentPublishedDate === null){
            this.setState({publishedValid: false});
            validPublishedDate = false;
            NotificationManager.error("Please fill out all marked fields!", "Error!");
        }else{
            this.setState({publishedValid: true});
            validPublishedDate = true;
        }

        if(validName && validPrice && validPublishedDate && validPublisher && validCode)
            return true;
        else 
            return false;
    }

    openGenresModal = () => this.child.current.toggleModal();

    async createNewBook() {
        let dateString = this.state.currentPublishedDate;
        let publishedDate = new Date(dateString);
        publishedDate.setDate(publishedDate.getDate() + 1);
        let readableDate = publishedDate.toISOString().split('T');

        const object = {
            name: this.state.currentName,
            code: this.state.currentCode,
            description: this.state.currentDescription,
            published: readableDate[0],
            price: parseFloat(this.state.currentPrice),
            publisher: {
                id: parseInt(this.state.selectedPublisherId)
            },
            numberOfPages: parseInt(this.state.currentNumberOfPages),
            language: this.state.selectedLanguage,
            coverType: this.state.selectedCoverType
        }

        const resp = await BookService.createNewBook(object);
        if(resp === 201) {
            NotificationManager.success("New Book successfully created!", "Success!");
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    async createNewOtherProduct() {
        let dateString = this.state.currentPublishedDate;
        let publishedDate = new Date(dateString);
        publishedDate.setDate(publishedDate.getDate() + 1);
        let readableDate = publishedDate.toISOString().split('T');

        let ourDate = null;
        let dateString2 = this.state.currentExpirationDate;
        if(dateString2 !== null){
            let expirationDate = new Date(dateString2);
            expirationDate.setDate(expirationDate.getDate() + 1);
            let readableDate2 = expirationDate.toISOString().split('T');
            ourDate = readableDate2[0];
        }

        const object = {
            name: this.state.currentName,
            code: this.state.currentCode,
            description: this.state.currentDescription,
            published: readableDate[0],
            price: parseFloat(this.state.currentPrice),
            publisher: {
                id: parseInt(this.state.selectedPublisherId)
            },
            type: this.state.selectedOtherProductType,
            expirationDate: ourDate
        }

        const resp = await OtherProductService.createNewOtherProduct(object);
        if(resp === 201) {
            NotificationManager.success("New Product successfully created!", "Success!");
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="newProductWrapper">
                <NotificationContainer />
                <ChooseGenresModal ref={this.child} sendData={this.handleCallback}/>
                <div className="newProductLeft">
                    <div className="newProductInfo">
                        <span className="newProductLabel">Code</span>
                        <input type="text" 
                                className="newProductInput" 
                                placeholder="Code" 
                                onChange={this.handleCodeChange}
                                style={{borderStyle: this.state.codeValid === false ? 'solid' : 'none',
                                    borderColor: this.state.codeValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="newProductInfo">
                        <span className="newProductLabel">Name</span>
                        <input type="text" 
                                className="newProductInput" 
                                placeholder="Name"  
                                onChange={this.handleNameChange}
                                style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                        borderColor: this.state.nameValid === false ? 'red' : ''}} />
                    </div>
                    <div className="newProductInfo">
                        <span className="newProductLabel">Description</span>
                        <textarea className="newProductTextarea" onChange={this.handleDescriptionChange}></textarea>
                    </div>
                    <div className="newProductInfo">
                        <span className="newProductLabel">Price(RSD)</span>
                        <input type="text" 
                                className="newProductInput" 
                                placeholder="Price(RSD)" 
                                onChange={this.handlePriceChange} 
                                style={{borderStyle: this.state.priceValid === false ? 'solid' : 'none',
                                        borderColor: this.state.priceValid === false ? 'red' : ''}}/>
                    </div>
                </div>
                <div className="newProductCenter">
                    <div className="newProductInfo">
                        <span className="newProductLabel">Publisher</span>
                        <div style={{borderStyle: this.state.publisherValid === false ? 'solid' : 'none',
                                    borderColor: this.state.publisherValid === false ? 'red' : ''}}>
                            <select className="newProductSelect" defaultValue={0} onChange={this.handlePublisherChange}>
                                <option value={0} disabled>Publisher</option>
                                {this.state.allPublishers.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}({p.address}, {p.city})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="newProductInfoDate">
                        <span className="newProductLabel">Published</span>
                        <div style={{borderStyle: this.state.publishedValid === false ? 'solid' : 'none',
                                    borderColor: this.state.publishedValid === false ? 'red' : ''}}>
                            <DatePicker placeholderText="Published"
                                        className="newProductPublishedDate" 
                                        onChange={this.handlePublishedDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentPublishedDate)} />
                        </div>
                    </div>
                    <div className="newProductInfo">
                        <span className="newProductLabel">Product Class</span>
                        <select className="newProductSelect" defaultValue={0} onChange={this.handleProductClassChange}>
                            <option value={0} disabled>Product Class</option>
                            <option value={"BOOK"}>Book</option>
                            <option value={"OTHER_PRODUCT"}>Other Product</option>
                        </select>
                    </div>
                </div>
                <div className="newProductRight">
                    <div className="specialDiv">
                        <div className="newProductInfo" style={{display: this.state.selectedProductClass === "BOOK" ? '': 'none'}}>
                            <span className="newProductLabel">Number of Pages</span>
                            <input type="text" 
                                    className="newProductInput" 
                                    placeholder="Number of Pages"  
                                    onChange={this.handleNumberOfPagesChange}
                                    style={{borderStyle: this.state.numberOfPagesValid === false ? 'solid' : 'none',
                                        borderColor: this.state.numberOfPagesValid === false ? 'red' : ''}}/>
                        </div>
                        <div className="newProductInfo" style={{display: this.state.selectedProductClass === "BOOK" ? '': 'none'}}>
                            <span className="newProductLabel">Language</span>
                            <div style={{borderStyle: this.state.languageValid === false ? 'solid' : 'none',
                                        borderColor: this.state.languageValid === false ? 'red' : ''}}>
                                <select className="newProductSelect" defaultValue={0} onChange={this.handleLanguageChange}>
                                    <option value={0} disabled>Language</option>
                                    <option value={"SERBIAN"}>Serbian</option>
                                    <option value={"ENGLISH"}>English</option>
                                    <option value={"GERMAN"}>German</option>
                                    <option value={"SPANISH"}>Spanish</option>
                                    <option value={"FRENCH"}>French</option>
                                </select>
                            </div>
                        </div>
                        <div className="newProductInfo" style={{display: this.state.selectedProductClass === "BOOK" ? '': 'none'}}>
                            <span className="newProductLabel">Cover Type</span>
                            <div style={{borderStyle: this.state.languageValid === false ? 'solid' : 'none',
                                        borderColor: this.state.languageValid === false ? 'red' : ''}}>
                                <select className="newProductSelect" defaultValue={0} onChange={this.handleCoverTypeChange}>
                                    <option value={0} disabled>Cover Type</option>
                                    <option value={"PAPERBACK"}>Paperback</option>
                                    <option value={"CASEWRAP"}>Casewrap</option>
                                    <option value={"DUST_JACKET"}>Dust Jacket</option>
                                </select>
                            </div>
                        </div>
                        <div className="newProductInfo" style={{display: this.state.selectedProductClass === "BOOK" ? '': 'none'}}>
                            <span className="newProductLabel">Genres</span>
                            <input type="text" 
                                    className="newProductInput" 
                                    placeholder="Genres" 
                                    id="genresInput"
                                    disabled={true}
                                    value={this.state.dataFromChild === null ? '' : this.state.dataFromChild}
                                    style={{borderStyle: this.state.genresValid === false ? 'solid' : 'none',
                                            borderColor: this.state.genresValid === false ? 'red' : ''}} />
                            <button className="newProductGenresButton" onClick={this.openGenresModal}>Choose Genres</button>
                        </div>
                        <div className="newProductInfo" style={{display: this.state.selectedProductClass === "OTHER_PRODUCT" ? '': 'none'}}>
                            <span className="newProductLabel">Other Product Type</span>
                            <div style={{borderStyle: this.state.otherProductTypeValid === false ? 'solid' : 'none',
                                        borderColor: this.state.otherProductTypeValid === false ? 'red' : ''}}>
                                <select className="newProductSelect" defaultValue={0} onChange={this.handleOtherProductTypeChange}>
                                    <option value={0} disabled>Product Type</option>
                                    <option value={"SCHOOLKIT"}>Schoolkit</option>
                                    <option value={"GIFT"}>Gift</option>
                                    <option value={"ACCESSORY"}>Accessory</option>
                                    <option value={"TOY"}>Toy</option>
                                </select>
                            </div>
                        </div>
                        <div className="newProductInfoDate" style={{display: this.state.selectedProductClass === "OTHER_PRODUCT" ? '': 'none'}}>
                            <span className="newProductLabel">Expiration Date</span>
                            <DatePicker placeholderText="Expiration Date"
                                            className="newProductExpirationDate" 
                                            onChange={this.handleExpirationDateChange}
                                            name="startDate"
                                            dateFormat="MM/dd/yyyy"
                                            selected={Date.parse(this.state.currentExpirationDate)}/>
                        </div>
                        <div className="newProductSave">
                            <button className="newProductSaveButton" onClick={this.submitNewProduct}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
