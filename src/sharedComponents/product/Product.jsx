import React, { Component } from 'react';
import './product.css';
import NoImage from './../../assets/noimg.webp';
import WriterService from './../../services/writerService';
import EditIcon from '@material-ui/icons/Edit';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import EditProductImageModal from '../../modals/product/EditProductImageModal';

export default class Product extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();

        this.state = {
            writers: [],
            sysAdminLogged: false
        }
    }

    async componentDidMount() {
        const writers = await WriterService.getBookWriters(this.props.product.name);
        this.setState({writers: writers});

        if(this.props.currentUser === null) {
            this.setState({sysAdminLogged: false});
        }else if(this.props.currentUser.type === "ROLE_SYSTEM_ADMIN") {
            this.setState({sysAdminLogged: true});
        }else {
            this.setState({sysAdminLogged: false});
        }
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.currentUser !== this.props.currentUser) {
            if(this.props.currentUser === null) {
                this.setState({sysAdminLogged: false});
            }else if(this.props.currentUser.type === "ROLE_SYSTEM_ADMIN") {
                this.setState({sysAdminLogged: true});
            }else {
                this.setState({sysAdminLogged: false});
            }
        }
    }

    handlePhotoEditClick = () => this.child.current.toggleModal();

    render() {
        return (
            <div className="productWrapper">
                <EditProductImageModal ref={this.child} product={this.props.product} />
                <EditIcon className="productHelperIcons" style={{display: this.state.sysAdminLogged ? '' : 'none'}}/>
                <PhotoCameraIcon className="productHelperIcons" onClick={this.handlePhotoEditClick} style={{display: this.state.sysAdminLogged ? '' : 'none'}}/>
                <img className="productImage" alt="productPic" src={this.props.product.coverImage===null ? NoImage : "http://localhost:8080/uploads/" + this.props.product.coverImage} />
                <div className="productInfo">
                    <span className="productName"><b>{this.props.product.name}</b></span>
                    <span className="productWriter">
                        {this.state.writers.map(w => (
                            <i  key={this.props.product.id}>{w.name}<br/></i>
                        ))}
                    </span>
                </div>
            </div>
        )
    }
}
