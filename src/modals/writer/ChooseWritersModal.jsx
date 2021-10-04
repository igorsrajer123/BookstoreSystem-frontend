import React, { Component } from 'react';
import './chooseWriter.css';
import Modal from 'react-modal';
import WriterService from '../../services/writerService';

export default class ChooseWritersModal extends Component {
    constructor() {
        super();
        
        this.state = {
            isOpen: false,
            writers: [],
            selectedWriters: []
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleWriterChange = this.handleWriterChange.bind(this);
        this.sendWriters = this.sendWriters.bind(this);
    }

    toggleModal = () => {
        this.setState({selectedWriters: []});
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        const allWriters = await WriterService.getAllWriters();
        this.setState({writers: allWriters});
    }

    handleWriterChange(e) {
        if(e.target.checked) {
            let array = this.state.selectedWriters;
            array.push(e.target.value);
            this.setState({selectedWriters: array});
        }

        if(!e.target.checked) {
            let array = this.state.selectedWriters;
            if (array.indexOf(e.target.value) !== -1)
                array.splice(array.indexOf(e.target.value), 1);
            this.setState({selectedWriters: array});
        }
    }

    sendWriters(event) {
        this.props.sendData(this.state.selectedWriters);
        event.preventDefault();
        this.toggleModal();
    }

    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="chooseBookWriters">
                <div className="chooseBookWritersWrapper">
                    {this.state.writers.map(w => (
                        <div key={w.id} className="chooseBookWritersInfo">
                            <input type="checkbox" key={w.id} onChange={this.handleWriterChange} value={w.id} className="chooseBookWritersInput"/>
                            <span className="chooseBookWritersLabel">{w.name}</span>
                        </div>
                    ))}
                    <div className="chooseBookWritersSave">
                        <button onClick={this.sendWriters} className="chooseBookWritersButton">Save</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
