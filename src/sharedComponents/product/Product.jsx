import React, { Component } from 'react';
import './product.css';
import NoImage from './../../assets/noimg.webp';
import WriterService from './../../services/writerService';
import EditIcon from '@material-ui/icons/Edit';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import EditProductImageModal from '../../modals/product/EditProductImageModal';
import EditProductModal from './../../modals/product/EditProductModal';

export default class Product extends Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();
        this.child2 = React.createRef();

        this.state = {
            writers: [],
            sysAdminLogged: false
        }

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handlePhotoEditClick = this.handlePhotoEditClick.bind(this);
        this.handleProductClick = this.handleProductClick.bind(this);
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

    handleEditClick = () => this.child2.current.toggleModal();

    handleProductClick = id => window.location.href = "http://localhost:3000/previewProduct/" + id;

    render() {
        return (
            <div className="productWrapper">
                <EditProductModal ref={this.child2} product={this.props.product} />
                <EditProductImageModal ref={this.child} product={this.props.product} />
                <EditIcon className="productHelperIcons" onClick={this.handleEditClick} style={{display: this.state.sysAdminLogged ? '' : 'none'}}/>
                <PhotoCameraIcon className="productHelperIcons" onClick={this.handlePhotoEditClick} style={{display: this.state.sysAdminLogged ? '' : 'none'}}/>
                <img className="productImage" alt="productPic" src={this.props.product.coverImage===null ? NoImage : "http://localhost:8080/uploads/" + this.props.product.coverImage} onClick={() => this.handleProductClick(this.props.product.id)}/>
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
