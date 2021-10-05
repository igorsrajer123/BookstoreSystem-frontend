import React, { Component } from 'react';
import './editProduct.css';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import PublisherService from './../../services/publisherService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import BookService from './../../services/bookService';
import OtherProductService from './../../services/otherProductService';

export default class EditProductModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            currentProduct: null,
            currentId: "",
            currentName: "",
            currentDescription: "",
            currentPrice: "",
            currentNumberOfPages: "",
            currentPublisherId: "",
            currentLanguage: "",
            currentCoverType: "",
            currentPublishedDate: null,
            currentExpirationDate: null,
            currentOtherProductType: "",
            bookSelected: false,
            otherProductSelected: false,
            allPublishers: [],
            nameValid: null,
            priceValid: null,
            publishingDateValid: null,
            numberOfPagesValid: null
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handlePublishedDateChange = this.handlePublishedDateChange.bind(this);
        this.handleExpirationDateChange = this.handleExpirationDateChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleCoverTypeChange = this.handleCoverTypeChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleNumberOfPagesChange = this.handleNumberOfPagesChange.bind(this);
        this.handleProductTyeChange = this.handleProductTyeChange.bind(this);
        this.handlePublisherChange = this.handlePublisherChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        if(this.props.product !== null){
            const publishers = await PublisherService.getAllPublishers();
            this.setState({allPublishers: publishers});

            this.setState({currentId: this.props.product.id});
            this.setState({currentProduct: this.props.product});
            this.setState({currentName: this.props.product.name});
            this.setState({currentDescription: this.props.product.description});
            this.setState({currentPrice: this.props.product.price});
            this.setState({currentPublisherId: this.props.product.publisher.id});
            this.setState({currentPublishedDate: this.props.product.published});
            if(this.props.product.type === undefined){
                this.setState({bookSelected: true});
                this.setState({otherProductSelected: false});
                this.setState({currentCoverType: this.props.product.coverType});
                this.setState({currentLanguage: this.props.product.language});
                this.setState({currentNumberOfPages: this.props.product.numberOfPages});
            }else{ 
                this.setState({bookSelected: false});
                this.setState({otherProductSelected: true});
                this.setState({currentExpirationDate: this.props.product.expirationDate});
                this.setState({currentOtherProductType: this.props.product.type});
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product){
            this.setState({currentId: this.props.product.id});
            this.setState({currentProduct: this.props.product});
            this.setState({currentName: this.props.product.name});
            this.setState({currentDescription: this.props.product.description});
            this.setState({currentPrice: this.props.product.price});
            this.setState({currentPublisherId: this.props.product.publisher.id});
            this.setState({currentPublishedDate: this.props.product.published});
            if(this.props.product.type === undefined) {
                this.setState({bookSelected: true});
                this.setState({otherProductSelected: false});
                this.setState({currentCoverType: this.props.product.coverType});
                this.setState({currentLanguage: this.props.product.language});
                this.setState({currentNumberOfPages: this.props.product.numberOfPages});
            }else {
                this.setState({bookSelected: false});
                this.setState({otherProductSelected: true});
                this.setState({currentExpirationDate: this.props.product.expirationDate});
                this.setState({currentOtherProductType: this.props.product.type});
            }
        }
    }

    handlePublishedDateChange = date => this.setState({currentPublishedDate: date});

    handleExpirationDateChange = date => this.setState({currentExpirationDate: date});

    handleLanguageChange = event => this.setState({currentLanguage: event.target.value});

    handleCoverTypeChange = event => this.setState({currentCoverType: event.target.value});

    handleNameChange = event => this.setState({currentName: event.target.value});

    handleDescriptionChange = event => this.setState({currentDescription: event.target.value});

    handlePriceChange = event => this.setState({currentPrice: event.target.value});

    handleNumberOfPagesChange = event => this.setState({currentNumberOfPages: event.target.value});

    handleProductTyeChange = event => this.setState({currentOtherProductType: event.target.value});

    handlePublisherChange = event => this.setState({currentPublisherId: event.target.value});

    checkProductValid() {
        let validName = false;
        let validPrice = false;
        let validPublishingDate = false;

        if(this.state.currentName === ""){
            this.setState({nameValid: false});
            validName = false;
        }else {
            this.setState({nameValid: true});
            validName = true;
        }

        if(this.state.currentPrice === ""){
            this.setState({priceValid: false});
            validPrice = false;
        }else {
            this.setState({priceValid: true});
            validPrice = true;
        }

        if(this.state.currentPublishedDate === null) {
            this.setState({publishingDateValid: false});
            validPublishingDate = false;
        }else {
            this.setState({publishingDateValid: true});
            validPublishingDate = true;
        }

        if(validName && validPrice && validPublishingDate)
            return true;
        else 
            return false;
    }

    async saveChanges() {
        const productValid = this.checkProductValid();
        if(this.state.currentProduct.type === undefined) {
            let validNumberOfPages = false;

            if(this.state.currentNumberOfPages === ""){
                this.setState({numberOfPagesValid: false});
                validNumberOfPages = false;
            }else {
                this.setState({numberOfPagesValid: true});
                validNumberOfPages = true;
            }

            if(productValid && validNumberOfPages) {
                let dateString = this.state.currentPublishedDate;
                let publishedDate = new Date(dateString);
                publishedDate.setDate(publishedDate.getDate() + 1);
                let readableDate = publishedDate.toISOString().split('T');

                const object = {
                    id: this.state.currentId,
                    name: this.state.currentName,
                    description: this.state.currentDescription,
                    price: parseFloat(this.state.currentPrice),
                    published: readableDate[0],
                    publisher: {
                        id: parseInt(this.state.currentPublisherId)
                    },
                    numberOfPages: parseInt(this.state.currentNumberOfPages),
                    language: this.state.currentLanguage,
                    coverType: this.state.currentCoverType
                }

                const response = await BookService.updateBook(object);
                if(response === 200) {
                    NotificationManager.success("Book successfully updated!", "Success!");
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    window.location.href = "http://localhost:3000/books";
                }else {
                    NotificationManager.error("Something went wrong!", "Error!");
                }
            }else {
                NotificationManager.error("Please fill up all required fields!", "Error!");
            }
        }else {
            if(productValid) {
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
                    id: this.state.currentId,
                    name: this.state.currentName,
                    description: this.state.currentDescription,
                    published: readableDate[0],
                    price: parseFloat(this.state.currentPrice),
                    publisher: {
                        id: parseInt(this.state.currentPublisherId)
                    },
                    type: this.state.currentOtherProductType,
                    expirationDate: ourDate
                }
                
                const response = await OtherProductService.updateOtherProduct(object);
                if(response === 200) {
                    NotificationManager.success("Product successfully updated!", "Success!");
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    window.location.href = "http://localhost:3000/otherProducts";
                }else {
                    NotificationManager.error("Something went wrong!", "Error!");
                }
            }else {
                NotificationManager.error("Please fill up all required fields!", "Error!");
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editProductModal">
                <NotificationContainer />
                <div className="editProductWrapper">
                    <div className="editProductInfo">
                        <span className="editProductLabel">Name</span>
                        <input type="text" 
                                className="editProductInput"
                                value={this.state.currentName}
                                onChange={this.handleNameChange}
                                style={{borderStyle: this.state.nameValid === false ? 'solid' : 'none',
                                        borderColor: this.state.nameValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="editProductInfo">
                        <span className="editProductLabel">Description</span>
                        <textarea className="editProductTextarea" value={this.state.currentDescription} onChange={this.handleDescriptionChange}></textarea>
                    </div>
                    <div className="editProductInfo">
                        <span className="editProductLabel">Price(RSD)</span>
                        <input type="text" 
                                className="editProductInput" 
                                value={this.state.currentPrice} 
                                onChange={this.handlePriceChange}
                                style={{borderStyle: this.state.priceValid === false ? 'solid' : 'none',
                                        borderColor: this.state.priceValid === false ? 'red' : ''}}/>
                    </div>
                    <div className="editProductInfo">
                        <span className="editProductLabel">Publisher</span>
                        <select className="editProductSelect" onChange={this.handlePublisherChange} defaultValue={this.state.currentPublisherId}>
                            <option value={0} disabled>Publisher</option>
                            {this.state.allPublishers.map(p => (
                                <option key={p.id} value={p.id}>{p.name}({p.address}, {p.city})</option>
                            ))}
                        </select>
                    </div>
                    <div className="editProductInfoDate">
                        <span className="editProductLabel">Publishing Date</span>
                        <div style={{borderStyle: this.state.publishingDateValid === false ? 'solid' : 'none',
                                    borderColor: this.state.publishingDateValid === false ? 'red' : ''}}>
                            <DatePicker className="editProductPublishedDate" 
                                        onChange={this.handlePublishedDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentPublishedDate)}/>
                        </div>
                    </div>
                    <div className="editProductBook" style={{display: this.state.bookSelected === true ? 'inline' : 'none'}}>
                        <div className="editProductInfo">
                            <span className="editProductLabel">Cover Type</span>
                            <select className="editProductSelect"
                                    defaultValue={this.state.currentCoverType}
                                    onChange={this.handleCoverTypeChange}>
                                <option value={0} disabled>Cover Type</option>
                                <option value={"PAPERBACK"}>Paperback</option>
                                <option value={"CASEWRAP"}>Casewrap</option>
                                <option value={"DUST_JACKET"}>Dust Jacket</option>
                            </select>
                        </div>
                        <div className="editProductInfo">
                            <span className="editProductLabel">Number of Pages</span>
                            <input type="text" 
                                    className="editProductInput" 
                                    value={this.state.currentNumberOfPages}
                                    onChange={this.handleNumberOfPagesChange}
                                    style={{borderStyle: this.state.numberOfPagesValid === false ? 'solid' : 'none',
                                                borderColor: this.state.numberOfPagesValid === false ? 'red' : ''}}/>
                        </div>
                        <div className="editProductInfo">
                            <span className="editProductLabel">Language</span>
                            <select className="editProductSelect" 
                                    defaultValue={this.state.currentLanguage}
                                    onChange={this.handleLanguageChange}>
                                <option value={0} disabled>Language</option>
                                <option value={"SERBIAN"}>Serbian</option>
                                <option value={"ENGLISH"}>English</option>
                                <option value={"GERMAN"}>German</option>
                                <option value={"SPANISH"}>Spanish</option>
                                <option value={"FRENCH"}>French</option>
                            </select>
                        </div>
                    </div>
                    <div className="editProductOtherProduct" style={{display: this.state.otherProductSelected === true ? 'inline' : 'none'}}>
                        <div className="editProductInfoDate">
                            <span className="editProductLabel">Expiration Date</span>
                            <DatePicker className="editProductPublishedDate" 
                                        onChange={this.handleExpirationDateChange}
                                        name="startDate"
                                        dateFormat="MM/dd/yyyy"
                                        selected={Date.parse(this.state.currentExpirationDate)} />
                        </div>
                        <div className="editProductInfo">
                            <span className="editProductLabel">Product Type</span>
                            <select className="editProductSelect" defaultValue={this.state.currentOtherProductType} onChange={this.handleProductTyeChange}>
                                <option value={0} disabled>Product Type</option>
                                <option value={"SCHOOLKIT"}>Schoolkit</option>
                                <option value={"GIFT"}>Gift</option>
                                <option value={"ACCESSORY"}>Accessory</option>
                                <option value={"TOY"}>Toy</option>
                            </select>
                        </div>
                    </div>
                    <div className="editProductSave">
                        <button className="editProductSaveButton" onClick={this.saveChanges}>Save Changes</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
