import React, { Component } from 'react';
import './bookstores.css';
import BookstoreService from './../../services/bookstoreService';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import LoginService from './../../services/loginService';
import EditBookstoreModal from '../../modals/bookstore/EditBookstoreModal';
import ViewBookstoreStaffModal from '../../modals/bookstore/ViewBookstoreStaffModal';

export default class Bookstores extends Component {
    constructor() {
        super();

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            bookstores: [],
            currentUser: null,
            showEditBookstore: false,
            showBookstoreStaff: false,
            selectedBookstore: null
        }

        this.editBookstoresClick = this.editBookstoresClick.bind(this);
        this.viewBookstoreStaffClick = this.viewBookstoreStaffClick.bind(this);
    }

    async componentDidMount() {
        const bookstores = await BookstoreService.getAllBookstores();
        this.setState({bookstores: bookstores});

        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser})
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SYSTEM_ADMIN" || currentUser.type === "ROLE_SELLER") {
                this.setState({showEditBookstore: false});
                this.setState({showBookstoreStaff: true});
            }else if(currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                this.setState({showEditBookstore: true});
                this.setState({showBookstoreStaff: true});
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

    render() {
        return (
            <div className="bookstoresWrapper">
                <EditBookstoreModal ref={this.child} bookstore={this.state.selectedBookstore} />
                <ViewBookstoreStaffModal ref={this.child2} currentUser={this.state.currentUser} bookstore={this.state.selectedBookstore} />
                <div className="bookstores">
                    {this.state.bookstores.map(b => (
                        <div key={b.id} className="bookstore">
                            <img alt="img" src={"http://localhost:8080/uploads/" + b.photo} className="bookstorePhoto" />
                            <div className="bookstoreInfo">
                                <div className="bookstoreHelperDiv">
                                    <span className="bookstoreName">{b.name}</span>
                                    <EditIcon className="editIcon" 
                                                style={{display: this.state.showEditBookstore ? 'inline' : 'none'}}
                                                onClick={() => this.editBookstoresClick(b)} />
                                    <GroupIcon className="groupIcon" 
                                                style={{display: this.state.showBookstoreStaff ? 'inline' : 'none'}}
                                                onClick={() => this.viewBookstoreStaffClick(b)} />
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
