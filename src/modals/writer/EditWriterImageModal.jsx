import React, { Component } from 'react';
import './editWriterImage.css';
import Modal from 'react-modal';
import NoImage from './../../assets/noimg.webp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class EditWriterImageModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            writer: null,
            writerPhoto: null,
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
        this.setWriterPhoto();
        if(this.props.writer !== null){
            this.setState({writer: this.props.bookstore});
            this.setState({action: "http://localhost:8080/uploadWriterImage/" + this.props.writer.id});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.writer !== this.props.writer) {
            this.setState({writer: this.props.bookstore});
            this.setWriterPhoto();
            this.setState({action: "http://localhost:8080/uploadWriterImage/" + this.props.writer.id});
        }
    }

    setWriterPhoto() {
        if(this.props.writer !== null){
            if(this.props.writer.image !== null)
                this.setState({writerPhoto: "http://localhost:8080/uploads/" + this.props.writer.image});
            else 
                this.setState({writerPhoto: NoImage})
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
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="editWriterImageModal">
                <NotificationContainer />
                <iframe name="dummyframe" title="Just a dummy frame #1" id="dummyframe" style={{display: "none"}}></iframe>
                <div className="editWriterImage">
                <img src={this.state.writerPhoto} alt="pic" className="editWriterPhoto" />
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
