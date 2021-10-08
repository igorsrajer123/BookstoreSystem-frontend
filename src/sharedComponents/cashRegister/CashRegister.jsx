import React, { Component } from 'react';
import './cashRegister.css';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import CashRegisterService from '../../services/cashRegisterService';
import SellerService from './../../services/sellerService';
import LoginService from './../../services/loginService';
import BookstoreService from './../../services/bookstoreService';
import ReceiptService from './../../services/receiptService';
import ChooseBooksModal from './../../modals/chooseItemsForReceipt/ChooseBooksModal';
import BookService from '../../services/bookService';
import ChooseOtherProductsModal from '../../modals/chooseItemsForReceipt/ChooseOtherProductsModal';
import OtherProductService from './../../services/otherProductService';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ProductsInBookstoreService from './../../services/productsInBookstoreService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class CashRegister extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            showAllReceipts: false,
            showNewReceipt: false,
            currentCashRegister: null,
            currentBookstore: null,
            currentUser: null,
            currentSeller: null,
            cashRegistersReceipts: [],
            newObjectList: [],
            bookIdsFromChild: [],
            otherProductIdsFromChild: [],
            newArrayBooks: [],
            newArrayOtherProducts: [],
            bookItemsSelected: 0,
            otherProductItemsSelected: 0
        }

        this.showAllReceiptsClick = this.showAllReceiptsClick.bind(this);
        this.showNewReceiptClick = this.showNewReceiptClick.bind(this);
        this.openBooksModal = this.openBooksModal.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
        this.handleCallback2 = this.handleCallback2.bind(this);
        this.openOtherProductsModal = this.openOtherProductsModal.bind(this);
        this.handleUpArrowClickBook = this.handleUpArrowClickBook.bind(this);
        this.handleUpArrowClickProduct = this.handleUpArrowClickProduct.bind(this);
        this.handleDownArrowClickBook = this.handleDownArrowClickBook.bind(this);
        this.handleDownArrowClickProduct = this.handleDownArrowClickProduct.bind(this);
        this.createReceiptClick = this.createReceiptClick.bind(this);
        this.reverseReceiptClick = this.reverseReceiptClick.bind(this);
    }

    async componentDidMount() {
        this.setState({showAllReceipts: false});
        this.setState({showNewReceipt: false});

        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SELLER") {
                const seller = await SellerService.getSellerByUserId(currentUser.id);
                this.setState({currentSeller: seller});

                const bookstore = await BookstoreService.getBookstoreBySellerId(seller.id);
                this.setState({currentBookstore: bookstore});

                const cashRegister = await CashRegisterService.getCashRegisterByBookstoreId(bookstore.id);
                this.setState({currentCashRegister: cashRegister});

                const receipts = await ReceiptService.getCashRegistersReceipts(cashRegister.id);
                this.setState({cashRegistersReceipts: receipts});

                let ourObjects = [];
                for(var r of receipts) {
                    const object = {
                        id: r.id,
                        number: r.number,
                        value: r.value,
                        status: r.status,
                        seller: r.seller,
                        dateAndTime: r.dateAndTime.replace("T", " "),
                        items: []
                    }
                    let receiptItems = await ReceiptService.getReceiptItems(r.id);
                    let objectItems = [];
                    for(var i of receiptItems) {
                        const bookFromItem = await ReceiptService.getBookFromReceiptItem(i.id);
                        if(bookFromItem.id === null) {
                            const otherProductFromItem = await ReceiptService.getOtherProductByReceiptItem(i.id);
                            const object3 = {
                                name: otherProductFromItem.name,
                                price: otherProductFromItem.price,
                                amount: i.amount
                            }
                            objectItems.push(object3);
                        }else {
                            const object2 = {
                                name: bookFromItem.name,
                                price: bookFromItem.price,
                                amount: i.amount
                            }
                            objectItems.push(object2);
                        }
                    }
                    object.items = objectItems;
                    ourObjects.push(object);
                }
                this.setState({newObjectList: ourObjects});
            }else {
                window.location.href = "http://localhost:3000/";
            }
        }else {
            window.location.href = "http://localhost:3000/";
        }
    }

    showAllReceiptsClick = () => {
        if(this.state.showAllReceipts) {
            this.setState({showAllReceipts: false});
            this.setState({showNewReceipt: false});
        }else if(this.state.showNewReceipt) {
            this.setState({showAllReceipts: true});
            this.setState({showNewReceipt: false});
        }else {
            this.setState({showAllReceipts: true});
            this.setState({showNewReceipt: false});
        }
    }

    showNewReceiptClick = () => {
        if(this.state.showNewReceipt) {
            this.setState({showAllReceipts: false});
            this.setState({showNewReceipt: false});
        }else if(this.state.showAllReceipts) {
            this.setState({showAllReceipts: false});
            this.setState({showNewReceipt: true});
        }else {
            this.setState({showAllReceipts: false});
            this.setState({showNewReceipt: true});
        }
    }

    openBooksModal = () => this.child.current.toggleModal();

    openOtherProductsModal = () =>  this.child2.current.toggleModal();

    async handleCallback(childData) {
        let myData = [];
        if(childData.length !== 0)
            for(var k of childData)
                myData.push(k);

        let newBooks = [];
        for (let id of childData) {
            const book = await BookService.getBookById(id);

            const obj = {
                id: id,
                name: book.name,
                amount: 1,
                available: true
            }
            newBooks.push(obj);
        }
        this.setState({bookIdsFromChild: myData});
        this.setState({newArrayBooks: newBooks});
        this.setState({bookItemsSelected: newBooks.length});
    }

    async handleCallback2(childData) {
        let myData = [];
        if(childData.length !== 0)
            for(var k of childData)
                myData.push(k);
        
        let newOtherProducts = [];
        for (let id of childData) {
            const otherProduct = await OtherProductService.getOtherProductById(id);
            
            const obj = {
                id: id,
                name: otherProduct.name,
                amount: 1,
                available: true
            }
            newOtherProducts.push(obj);
        }
        this.setState({otherProductIdsFromChild: myData});
        this.setState({newArrayOtherProducts: newOtherProducts});
        this.setState({otherProductItemsSelected: newOtherProducts.length});
    }

    handleUpArrowClickBook = id => {
        let myBooks = this.state.newArrayBooks;
        for(var b of myBooks) {
            if(b.id === id) {
                b.amount += 1;
            }
        }
        this.setState({newArrayBooks: myBooks});
    }

    handleUpArrowClickProduct = id => {
        let myProducts = this.state.newArrayOtherProducts;
        for(var p of myProducts) {
            if(p.id === id) {
                p.amount += 1;
            }
        }
        this.setState({newArrayOtherProducts: myProducts});
    }

    handleDownArrowClickBook = id => {
        let myBooks = this.state.newArrayBooks;
        for(var b of myBooks) {
            if(b.id === id) {
                if(b.amount - 1 < 1)
                    b.amount = 1;
                else
                    b.amount -= 1;
            }
        }
        this.setState({newArrayBooks: myBooks});
    }

    handleDownArrowClickProduct = id => {
        let myProducts = this.state.newArrayOtherProducts;
        for(var p of myProducts) {
            if(p.id === id) {
                if(p.amount - 1 < 1)
                    p.amount = 1;
                else
                    p.amount -= 1;
            }
        }
        this.setState({newArrayOtherProducts: myProducts});
    }

    async createReceiptClick() {
        const bookItems = this.state.newArrayBooks;
        const otherProductItems = this.state.newArrayOtherProducts;

        let allItemsAvailable = true;

        for(var b of bookItems) {
            const response = await ProductsInBookstoreService.checkBookAvailable(this.state.currentBookstore.id, parseInt(b.id), parseInt(b.amount));
            if(response === true) {
                b.available = true;
            }else {
                b.available = false;
                allItemsAvailable = false;
            }
        }
        this.setState({newArrayBooks: bookItems});

        for(var o of otherProductItems) {
            const response = await ProductsInBookstoreService.checkOtherProductAvailable(this.state.currentBookstore.id, parseInt(o.id), parseInt(o.amount));
            if(response === true) {
                o.available = true;
            }else {
                o.available = false;
                allItemsAvailable = false;
            }
        }
        this.setState({newArrayOtherProducts: otherProductItems});

        let sendingObjects = [];
        if(allItemsAvailable) {
            for(var z of bookItems) {
                const obj = {
                    book: {
                        id: parseInt(z.id)
                    },
                    amount: parseInt(z.amount)
                }
                sendingObjects.push(obj);
            }

            for(var y of otherProductItems) {
                const obj = {
                    otherProduct: {
                        id: parseInt(y.id)
                    },
                    amount: parseInt(y.amount)
                }
                sendingObjects.push(obj);
            }

            const response = await ReceiptService.createReceipt(this.state.currentSeller.id, sendingObjects);
            if(response === 200) {
                NotificationManager.success("Receipt successfully created!", "Error!");
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.reload();
            }else {
                NotificationManager.error("Something went wrong!", "Error!");
            }
        }else {
            NotificationManager.error("Some items are currently not available for sale!", "Error!");
        }
    }

    async reverseReceiptClick(receiptId) {
        const response = await ReceiptService.reverseReceipt(receiptId, this.state.currentBookstore.id);
        if(response === 200) {
            NotificationManager.success("Receipt successfully reversed!", "Error!");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.reload();
        }else {
            NotificationManager.error("Something went wrong!", "Error!");
        }
    }

    render() {
        return (
            <div className="cashRegisterWrapper">
                <NotificationContainer />
                <ChooseBooksModal ref={this.child} sendData={this.handleCallback} selectedBooks={this.state.bookIdsFromChild}/>
                <ChooseOtherProductsModal ref={this.child2} sendData={this.handleCallback2} selectedOtherProducts={this.state.otherProductIdsFromChild} />
                <div className="cashRegisterOptions">
                    <button className="cashRegisterOptionsButton" 
                            onClick={this.showAllReceiptsClick}
                            style={{backgroundColor: this.state.showAllReceipts ? 'goldenrod' : 'brown'}}><ReceiptTwoToneIcon /></button>
                    <button className="cashRegisterOptionsButton" 
                            onClick={this.showNewReceiptClick}
                            style={{backgroundColor: this.state.showNewReceipt ? 'goldenrod' : 'brown'}}><AddCircleOutlineTwoToneIcon /></button>
                </div>
                <div className="cashRegisterData">
                    <div className="cashRegisterAllReceipts" style={{minHeight: this.state.showAllReceipts ? '30vh' : '0px', 
                                                                        height: this.state.showAllReceipts ? 'auto' : '0px'}}>
                        
                        <span  style={{fontSize: this.state.showAllReceipts ? 'xx-large' : '0px'}} className="cashRegisterHeader">Created Receipts</span>
                        {this.state.newObjectList.map(r => (
                            <div className="cashRegisterOneReceipt" 
                                key={r.id} 
                                style={{minHeight: this.state.showAllReceipts ? '10vh' : '0px', 
                                        height: this.state.showAllReceipts ? 'auto' : '0px',
                                        borderStyle: this.state.showAllReceipts ? 'groove' : 'none'}}>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Number: <b>{r.number}</b></span>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Date and Time: <b>{r.dateAndTime}</b></span>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Value(RSD): <b>{r.value}</b></span>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Status:  <b>{r.status}</b><button style={{display: r.status === "CREATED" ? '' : 'none'}} className="reverseReceiptButton" onClick={() => this.reverseReceiptClick(r.id)}>Reverse</button></span>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Created By:  <b>{r.seller.user.firstName} {r.seller.user.lastName}</b></span>
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">
                                        <div className="divForReceiptItems">
                                            <span style={{textDecoration: 'underline'}}>Items:</span>
                                            <ol>
                                                {r.items.map(i => (
                                                    <li key={i.name}>{i.name}(x{i.amount}) - {i.price}RSD</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </span>
                            </div>
                        ))}
                    </div>
                    <div className="cashRegisterCreateReceipt" style={{minHeight: this.state.showNewReceipt ? '30vh' : '0px', 
                                                                        height: this.state.showNewReceipt ? 'auto' : '0px'}}>
                    
                        <div className="cashRegisterCreateReceiptOptions"
                            style={{minHeight: this.state.showNewReceipt ? '10vh' : '0px', 
                                    height: this.state.showNewReceipt ? 'auto' : '0px'}}>
                            <button style={{display: this.state.showNewReceipt ? 'inline' : 'none'}} 
                                    className="cashRegisterCreateReceiptButton"
                                    onClick={this.openBooksModal}>Add Book</button>
                            <button style={{display: this.state.showNewReceipt ? 'inline' : 'none'}} 
                                    className="cashRegisterCreateReceiptButton"
                                    onClick={this.openOtherProductsModal}>Add Other Product</button>
                        </div>
                        <div className="cashRegisterCreateReceiptItems"
                            style={{minHeight: this.state.showNewReceipt ? '10vh' : '0px', 
                                    height: this.state.showNewReceipt ? 'auto' : '0px'}}>
                            <ol key={1} className="itemsList" style={{display: this.state.showNewReceipt ? '' : 'none'}}>
                                {this.state.newArrayBooks.map(b => (
                                    <li key={b.id} className="itemsListItem" style={{minHeight: this.state.showNewReceipt ? '0px' : '0px', height: this.state.showNewReceipt ? 'auto' : '0px'}}>{b.name} 
                                        <input type="text" disabled={true}  className="itemsListItemInput" value={b.amount} style={{borderStyle: b.available ? 'none' : 'solid', borderColor: b.available ? '' : 'red'}}/>
                                        <div>
                                            <KeyboardArrowUpIcon className="itemsListItemArrow" onClick={() => this.handleUpArrowClickBook(b.id)}/>
                                            <KeyboardArrowDownIcon className="itemsListItemArrow" onClick={() => this.handleDownArrowClickBook(b.id)}/>
                                        </div>
                                    </li>
                                ))}
                                {this.state.newArrayOtherProducts.map(o => (
                                    <li key={o.id} className="itemsListItem" style={{display: this.state.showNewReceipt ? '' : 'none'}}>{o.name}
                                        <input type="text" disabled={true} className="itemsListItemInput" value={o.amount} style={{borderStyle: o.available ? 'none' : 'solid', borderColor: o.available ? '' : 'red'}}/>
                                        <div>
                                            <KeyboardArrowUpIcon className="itemsListItemArrow" onClick={() => this.handleUpArrowClickProduct(o.id)}/>
                                            <KeyboardArrowDownIcon className="itemsListItemArrow" onClick={() => this.handleDownArrowClickProduct(o.id)}/>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="cashRegisterCreateReceiptSave" style={{minHeight: this.state.showNewReceipt ? '5vh' : '0px', height: this.state.showNewReceipt ? 'auto' : '0px'}}>
                            <button className="cashRegisterCreateReceiptSaveButton" style={{display: this.state.showNewReceipt && (this.state.bookItemsSelected > 0 || this.state.otherProductItemsSelected) ? '' : 'none'}} onClick={this.createReceiptClick}>Create Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
