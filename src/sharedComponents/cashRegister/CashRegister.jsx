import React, { Component } from 'react';
import './cashRegister.css';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import CashRegisterService from '../../services/cashRegisterService';
import SellerService from './../../services/sellerService';
import LoginService from './../../services/loginService';
import BookstoreService from './../../services/bookstoreService';
import ReceiptService from './../../services/receiptService';

export default class CashRegister extends Component {
    constructor() {
        super();

        this.state = {
            showAllReceipts: false,
            showNewReceipt: false,
            currentCashRegister: null,
            currentUser: null,
            cashRegistersReceipts: [],
            newObjectList: []
        }

        this.showAllReceiptsClick = this.showAllReceiptsClick.bind(this);
        this.showNewReceiptClick = this.showNewReceiptClick.bind(this);
    }

    async componentDidMount() {
        this.setState({showAllReceipts: false});
        this.setState({showNewReceipt: false});

        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SELLER") {
                const seller = await SellerService.getSellerByUserId(currentUser.id);
                const bookstore = await BookstoreService.getBookstoreBySellerId(seller.id);
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

    render() {
        return (
            <div className="cashRegisterWrapper">
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
                                    <span style={{display: this.state.showAllReceipts ? 'inline' : 'none'}} className="receiptInformation">Status:  <b>{r.status}</b><button style={{display: r.status === "CREATED" ? '' : 'none'}} className="reverseReceiptButton">Reverse</button></span>
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
                        
                    </div>
                </div>
            </div>
        )
    }
}
