import React, { Component } from 'react';
import './writers.css';
import WriterService from './../../services/writerService';
import NoImage from './../../assets/noimg.webp';
import EditIcon from '@material-ui/icons/Edit';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import LoginService from './../../services/loginService';
import EditWriterImageModal from './../../modals/writer/EditWriterImageModal';
import EditWriterModal from './../../modals/writer/EditWriterModal';

export default class Writers extends Component {
    constructor() {
        super();

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            writers: [],
            showEditWriter: false,
            showWriterEditPhoto: false,
            selectedWriter: null
        }

        this.editWriterClick = this.editWriterClick.bind(this);
        this.editWriterPhotoClick = this.editWriterPhotoClick.bind(this);
    }

    async componentDidMount() {
        const writers = await WriterService.getAllWriters();
        this.setState({writers: writers});

        const currentUser = await LoginService.getCurrentUser();
        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SYSTEM_ADMIN") {
                this.setState({showEditWriter: true});
                this.setState({showWriterEditPhoto: true});
            }else {
                this.setState({showEditWriter: false});
                this.setState({showWriterEditPhoto: false});
            }
        }
    }

    async editWriterClick(writer) {
        this.setState({selectedWriter: writer});
        this.child2.current.toggleModal();
    }

    async editWriterPhotoClick(writer) {
        this.setState({selectedWriter: writer});
        this.child.current.toggleModal();
    }

    render() {
        return (
            <div className="writersWrapper">
                <EditWriterImageModal ref={this.child} writer={this.state.selectedWriter} />
                <EditWriterModal ref={this.child2} writer={this.state.selectedWriter} />
                <div className="writers">
                        {this.state.writers.map(w => (
                        <div key={w.id} className="writer">
                            <img alt="img" src={w.image !== null ? "http://localhost:8080/uploads/" + w.image : NoImage} className="writerPhoto" />
                            <div className="writerInfo">
                                <span className="writerName">{w.name}
                                    <EditIcon className="editIcon" 
                                                style={{display: this.state.showEditWriter ? 'inline' : 'none'}}
                                                onClick={() => this.editWriterClick(w)} />
                                    <PhotoCameraIcon className="photoIcon" 
                                                style={{display: this.state.showWriterEditPhoto ? 'inline' : 'none'}}
                                                onClick={() => this.editWriterPhotoClick(w)} />
                                </span>
                                <span className="writerDescription">{w.description}</span>
                            </div>
                        </div>
                        ))}
                </div>
            </div>
        )
    }
}
