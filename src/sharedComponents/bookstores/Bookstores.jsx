import React, { Component } from 'react';
import './bookstores.css';
import BookstoreService from './../../services/bookstoreService';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import LoginService from './../../services/loginService';
import EditBookstoreModal from '../../modals/bookstore/EditBookstoreModal';
import ViewBookstoreStaffModal from '../../modals/bookstore/ViewBookstoreStaffModal';
import EditBookstoreImageModal from '../../modals/bookstore/EditBookstoreImageModal';
import NoImage from './../../assets/noimg.webp';
import BookstoreAdministratorService from './../../services/bookstoreAdministratorService';
import SellerService from './../../services/sellerService';

export default class Bookstores extends Component {
    constructor() {
        super();

        this.child = React.createRef();
        this.child2 = React.createRef();
        this.child3 = React.createRef();

        this.state = {
            bookstores: [],
            currentUser: null,
            showBookstoreStaff: false,
            selectedBookstore: null,
            showBookstoreEditPhoto: false,
            currentAdminBookstoreId: "",
            currentSellerBookstoreId: ""
        }

        this.editBookstoresClick = this.editBookstoresClick.bind(this);
        this.viewBookstoreStaffClick = this.viewBookstoreStaffClick.bind(this);
        this.editBookstorePhotoClick = this.editBookstorePhotoClick.bind(this);
    }

    async componentDidMount() {
        const bookstores = await BookstoreService.getAllBookstores();
        this.setState({bookstores: bookstores.sort((a, b) => a.name.localeCompare(b.name))});

        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser})
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SYSTEM_ADMIN"){
                this.setState({showBookstoreStaff: true});
                this.setState({showBookstoreEditPhoto: false});
            }else if(currentUser.type === "ROLE_SELLER") {
                const bookstoreSeller = await SellerService.getSellerByUserId(currentUser.id);
                const sellerBookstore = await BookstoreService.getBookstoreBySellerId(bookstoreSeller.id);
                this.setState({currentSellerBookstoreId: sellerBookstore.id});
                this.setState({showBookstoreStaff: false});
                this.setState({showBookstoreEditPhoto: false});
            }else if(currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                const bookstoreAdmin = await BookstoreAdministratorService.getBookstoreAdministratorByUserId(currentUser.id);
                const adminBookstore = await BookstoreService.getBookstoreByAdminId(bookstoreAdmin.id);
                this.setState({currentAdminBookstoreId: adminBookstore.id});
                this.setState({showBookstoreStaff: false});
                this.setState({showBookstoreEditPhoto: true});
            }
        }
    }

    editBookstoresClick = bookstore => {
        this.setState({selectedBookstore: bookstore})
        this.child.current.toggleModal();
    }

    viewBookstoreStaffClick = bookstore => {
        this.setState({selectedBookstore: bookstore});
        this.child2.current.toggleModal();
    }

    editBookstorePhotoClick = bookstore => {
        this.setState({selectedBookstore: bookstore});
        this.child3.current.toggleModal();
    }

    render() {
        return (
            <div className="bookstoresWrapper">
                <EditBookstoreModal ref={this.child} bookstore={this.state.selectedBookstore} />
                <ViewBookstoreStaffModal ref={this.child2} currentUser={this.state.currentUser} bookstore={this.state.selectedBookstore} />
                <EditBookstoreImageModal ref={this.child3} bookstore={this.state.selectedBookstore} />
                <div className="bookstores">
                    {this.state.bookstores.map(b => (
                        <div key={b.id} className="bookstore">
                            <img alt="img" src={b.photo !== null ? "http://localhost:8080/uploads/" + b.photo  : NoImage} className="bookstorePhoto" />
                            <div className="bookstoreInfo">
                                <div className="bookstoreHelperDiv">
                                    <span className="bookstoreName">{b.name}</span>
                                    <EditIcon className="editIcon" 
                                                style={{display: b.id === this.state.currentAdminBookstoreId ? 'inline' : 'none'}}
                                                onClick={() => this.editBookstoresClick(b)} />
                                    <GroupIcon className="groupIcon" 
                                                style={{display: this.state.showBookstoreStaff || 
                                                        b.id === this.state.currentAdminBookstoreId || 
                                                        b.id === this.state.currentSellerBookstoreId? 'inline' : 'none'}}
                                                onClick={() => this.viewBookstoreStaffClick(b)} />
                                    <PhotoCameraIcon className="photoIcon" 
                                                style={{display: b.id === this.state.currentAdminBookstoreId ? 'inline' : 'none'}}
                                                onClick={() => this.editBookstorePhotoClick(b)} />
                                </div>
                                <span className="bookstoreAddress">{b.address}</span>
                                <span className="bookstoreCity">{b.city}</span>
                                <span className="bookstorePhone">Contact: {b.contactPhone}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
