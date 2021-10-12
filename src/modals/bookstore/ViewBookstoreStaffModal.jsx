import React, { Component } from 'react';
import './viewBookstoreStaff.css';
import Modal from 'react-modal';
import BookstoreAdministratorService from './../../services/bookstoreAdministratorService';
import SellerService from './../../services/sellerService';
import UserService from './../../services/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class ViewBookstoreStaffModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            bookstore: null,
            bookstoreAdmins: [],
            bookstoreSellers: [],
            currentUserSysAdmin: false,
            currentUserSeller: false,
            currentUserBookstoreAdmin: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        if(this.props.bookstore !== null){
            this.setState({bookstore: this.props.bookstore});

            const bookstoreAdmins = await BookstoreAdministratorService.getAllBookstoreAdmins(this.props.bookstore.id);
            this.setState({bookstoreAdmins: bookstoreAdmins.sort((a, b) => a.email.localeCompare(b.email))});

            const bookstoreSellers = await SellerService.getAllBookstoreSellers(this.props.bookstore.id);
            this.setState({bookstoreSellers: bookstoreSellers.sort((a, b) => a.email.localeCompare(b.email))});

            if(this.props.currentUser.type === "ROLE_SYSTEM_ADMIN") {
                this.setState({currentUserSysAdmin: true});
                this.setState({currentUserBookstoreAdmin: false});
                this.setState({currentUserSeller: false});
            }else if(this.props.currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                this.setState({currentUserSysAdmin: false});
                this.setState({currentUserBookstoreAdmin: true});
                this.setState({currentUserSeller: false});
            }else if(this.props.currentUser.type === "ROLE_SELLER") {
                this.setState({currentUserSysAdmin: false});
                this.setState({currentUserBookstoreAdmin: false});
                this.setState({currentUserSeller: true});
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.bookstore !== this.props.bookstore) {
            this.setState({bookstore: this.props.bookstore});

            const bookstoreAdmins = await BookstoreAdministratorService.getAllBookstoreAdmins(this.props.bookstore.id);
            this.setState({bookstoreAdmins: bookstoreAdmins.sort((a, b) => a.email.localeCompare(b.email))});

            const bookstoreSellers = await SellerService.getAllBookstoreSellers(this.props.bookstore.id);
            this.setState({bookstoreSellers: bookstoreSellers.sort((a, b) => a.email.localeCompare(b.email))});

            if(this.props.currentUser.type === "ROLE_SYSTEM_ADMIN") {
                this.setState({currentUserSysAdmin: true});
                this.setState({currentUserBookstoreAdmin: false});
                this.setState({currentUserSeller: false});
            }else if(this.props.currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                this.setState({currentUserSysAdmin: false});
                this.setState({currentUserBookstoreAdmin: true});
                this.setState({currentUserSeller: false});
            }else if(this.props.currentUser.type === "ROLE_SELLER") {
                this.setState({currentUserSysAdmin: false});
                this.setState({currentUserBookstoreAdmin: false});
                this.setState({currentUserSeller: true});
            }
        }
    }

    async buttonClick(userId) {
        const user = await UserService.getUserById(userId);
        if(user.enabled) {
            await UserService.disableAccount(userId);
            let adminArray = [];
            let sellerArray = [];
            for(let a of this.state.bookstoreAdmins) {
                if(a.user.id === userId) 
                    a.user.enabled = false;
                adminArray.push(a);
            }
            this.setState({bookstoreAdmins: adminArray});

            for(let s of this.state.bookstoreSellers) {
                if(s.user.id === userId) 
                    s.user.enabled = false;
                sellerArray.push(s);
            }
            this.setState({bookstoreSellers: sellerArray});
        }else{
            await UserService.enableAccount(userId);
            let adminArray = [];
            let sellerArray = [];
            for(let a of this.state.bookstoreAdmins) {
                if(a.user.id === userId) 
                    a.user.enabled = true;
                adminArray.push(a);
            }
            this.setState({bookstoreAdmins: adminArray});

            for(let s of this.state.bookstoreSellers) {
                if(s.user.id === userId) 
                    s.user.enabled = true;
                sellerArray.push(s);
            }
            this.setState({bookstoreSellers: sellerArray});
        }

        NotificationManager.success("Account status changed successfully!", "Update Successful!");
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="viewBookstoreStaffModal">
                <div className="viewBookstoreStaffWrapper">
                    <NotificationContainer />
                    <h1 className="viewBookstoreStaffHeader">Bookstore Staff</h1>
                    <table className="viewBookstoreStaffTable">
                        <thead className="viewBookstoreStaffTableHead">
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="viewBookstoreStaffTableBody">
                            {this.state.bookstoreAdmins.map(a => (
                                <tr key={a.id}>
                                    <td className="bookstoreStaffContent">{a.user.email}</td>
                                    <td className="bookstoreStaffContent">{a.user.firstName}</td>
                                    <td className="bookstoreStaffContent">{a.user.lastName}</td>
                                    <td className="bookstoreStaffContent">{a.user.phoneNumber}</td>
                                    <td className="bookstoreStaffContent">Bookstore Admin</td>
                                    <td className="bookstoreStaffContent"><button className="disableAccount"
                                                                                    style={{display: this.state.currentUserSysAdmin ? 'block' : 'none',
                                                                                            backgroundColor: a.user.enabled ? 'crimson' : 'chartreuse'}}
                                                                                    onClick={() => this.buttonClick(a.user.id)}>{a.user.enabled ? 'Disable Account' : 'Enable Account'}</button></td>
                                </tr>
                            ))}
                            {this.state.bookstoreSellers.map(a => (
                                <tr key={a.id}>
                                    <td className="bookstoreStaffContent">{a.user.email}</td>
                                    <td className="bookstoreStaffContent">{a.user.firstName}</td>
                                    <td className="bookstoreStaffContent">{a.user.lastName}</td>
                                    <td className="bookstoreStaffContent">{a.user.phoneNumber}</td>
                                    <td className="bookstoreStaffContent">Bookstore Seller</td>
                                    <td className="bookstoreStaffContent"><button className="disableAccount"
                                                                                    style={{display: this.state.currentUserBookstoreAdmin ? 'block' : 'none',
                                                                                            backgroundColor: a.user.enabled ? 'crimson' : 'chartreuse'}}
                                                                                    onClick={() => this.buttonClick(a.user.id)}>{a.user.enabled ? 'Disable Account' : 'Enable Account'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        )
    }
}
