import React, { Component } from 'react';
import './editProductImage.css';
import Modal from 'react-modal';
import NoImage from './../../assets/noimg.webp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class EditProductImageModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            product: null,
            productPhoto: null,
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
        this.setProductPhoto();
        if(this.props.product !== null){
            this.setState({product: this.props.product});
            if(this.props.product.type === undefined) {
                this.setState({action: "http://localhost:8080/uploadBookImage/" + this.props.product.id});
            }else {
                this.setState({action: "http://localhost:8080/uploadOtherProductImage/" + this.props.product.id});
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.product !== this.props.product) {
            this.setState({product: this.props.product});
            this.setProductPhoto();
            if(this.props.product.type === undefined) {
                this.setState({action: "http://localhost:8080/uploadBookImage/" + this.props.product.id});
            }else {
                this.setState({action: "http://localhost:8080/uploadOtherProductImage/" + this.props.product.id});
            }
        }
    }

    setProductPhoto() {
        if(this.props.product !== null){
            if(this.props.product.coverImage !== null)
                this.setState({productPhoto: "http://localhost:8080/uploads/" + this.props.product.coverImage});
            else 
                this.setState({productPhoto: NoImage})
        }
    }

    filePicked = () => this.setState({hideUploadButton: false});

    async reloadPage() {
        NotificationManager.success("Product image updated successfully!", "Update Successful!");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editProductImageModal">
                <NotificationContainer />
                <iframe name="dummyframe" title="Just a dummy frame #1" id="dummyframe" style={{display: "none"}}></iframe>
                <div className="editProductImage">
                    <img src={this.state.productPhoto} alt="pic" className="editProductPhoto" />
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
