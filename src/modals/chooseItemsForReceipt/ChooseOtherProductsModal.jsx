import React, { Component } from 'react';
import './chooseOtherProducts.css';
import Modal from 'react-modal';
import OtherProductService from './../../services/otherProductService';

export default class ChooseOtherProductsModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            otherProducts: [],
            selectedOtherProducts: []
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.sendOtherProducts = this.sendOtherProducts.bind(this);
        this.handleOtherProductChange = this.handleOtherProductChange.bind(this);
        this.searchForOtherProduct = this.searchForOtherProduct.bind(this);
    }

    async componentDidMount() {
        const allOtherProducts = await OtherProductService.getAllOtherProducts();
        let createdArray = []
        for(var b of allOtherProducts) {
            const obj = {
                id: b.id,
                name: b.name,
                checked: false
            }
            createdArray.push(obj);
        }
        this.setState({otherProducts: createdArray.sort((a, b) => a.name.localeCompare(b.name))});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedOtherProducts !== this.props.selectedOtherProducts){
            this.setState({selectedOtherProducts: this.props.selectedOtherProducts});
            let array = this.state.otherProducts;

            for(var x of array) 
                x.checked = false;

            for(var o of array)
                for(var b of this.state.selectedOtherProducts) 
                    if(o.id === parseInt(b)) 
                        o.checked = true;
                    
            this.setState({otherProducts: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    handleOtherProductChange = e => {
        if(e.target.checked) {
            let array = this.state.selectedOtherProducts;
            array.push(e.target.value);
            this.setState({selectedOtherProducts: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
        
        if(!e.target.checked) {
            let array = this.state.selectedOtherProducts;
            if (array.indexOf(e.target.value) !== -1)
                array.splice(array.indexOf(e.target.value), 1);
            this.setState({selectedOtherProducts: array});
        }
    }

    sendOtherProducts = () => this.props.sendData(this.state.selectedOtherProducts);

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    searchForOtherProduct = async e => {
        if(e.target.value === "") {
            const otherProducts = await OtherProductService.getAllOtherProducts();
            this.setState({otherProducts: otherProducts.sort((a, b) => a.name.localeCompare(b.name))});
        }else {
            const otherProducts = await OtherProductService.getAllOtherProducts();
            let array = [];
            for(let o of otherProducts) {
                if(o.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                    array.push(o);
                }
            }
            this.setState({otherProducts: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="chooseOtherProductsModal">
                <div className="chooseOtherProductsWrapper">
                    <div className="chooseOtherProductSearch">
                        <input type="text" placeholder="Search..." className="chooseOtherProductSearchBar" onChange={this.searchForOtherProduct}/>
                    </div>
                    {this.state.otherProducts.map(o => (
                        <div key={o.id} className="chooseOtherProductInfo">
                            <input type="checkbox" 
                                    key={o.id} 
                                    onChange={this.handleOtherProductChange} 
                                    value={o.id} 
                                    className="chooseOtherProductInput"
                                    defaultChecked={o.checked}/>
                            <span className="chooseOtherProductLabel">{o.name}</span>
                        </div>
                    ))}
                    <div className="chooseOtherProductSave">
                        <button onClick={this.sendOtherProducts} className="chooseOtherProductButton">Save</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
