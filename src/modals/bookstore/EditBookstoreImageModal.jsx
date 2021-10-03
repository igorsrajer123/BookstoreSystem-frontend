import React, { Component } from 'react';
import './editBookstoreImage.css';
import Modal from 'react-modal';
import NoImage from './../../assets/noimg.webp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class EditBookstoreImageModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            bookstore: null,
            bookstorePhoto: null,
            hideUploadButton: true,
            action: ""
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.filePicked = this.filePicked.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        this.setBookstorePhoto();
        if(this.props.bookstore !== null){
            this.setState({bookstore: this.props.bookstore});
            this.setState({action: "http://localhost:8080/uploadBookstoreImage/" + this.props.bookstore.id});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.bookstore !== this.props.bookstore) {
            this.setState({bookstore: this.props.bookstore});
            this.setBookstorePhoto();
            this.setState({action: "http://localhost:8080/uploadBookstoreImage/" + this.props.bookstore.id});
        }
    }

    setBookstorePhoto() {
        if(this.props.bookstore !== null){
            if(this.props.bookstore.photo !== null)
                this.setState({bookstorePhoto: "http://localhost:8080/uploads/" + this.props.bookstore.photo});
            else 
                this.setState({bookstorePhoto: NoImage})
        }
    }

    filePicked = () => this.setState({hideUploadButton: false});

    async reloadPage() {
        NotificationManager.success("Bookstore image updated successfully!", "Update Successful!");
            await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editBookstoreImageModal">
                <NotificationContainer />
                <iframe name="dummyframe" title="Just a dummy frame #1" id="dummyframe" style={{display: "none"}}></iframe>
                <div className="editBookstoreImage">
                    <img src={this.state.bookstorePhoto} alt="pic" className="editBookstorePhoto" />
                    <form target="dummyframe" action={this.state.action} encType="multipart/form-data" method="POST">
                        <input type="file" id="file" name="file" className="inputFile" onChange={this.filePicked}/>
                        <label htmlFor="file" className="dummyLabel">Select Photo</label>
                        <input type="submit" 
                            value="Save Photo" 
                            className="submitPhoto" 
                            style={{width: this.state.hideUploadButton ? '0.1px' : '100%',
                                    height: this.state.hideUploadButton ? '0.1px' : '50%',
                                    alignSelf: 'center'}}
                            onClick={this.reloadPage} />
                    </form>
                </div>
            </Modal>
        )
    }
}
