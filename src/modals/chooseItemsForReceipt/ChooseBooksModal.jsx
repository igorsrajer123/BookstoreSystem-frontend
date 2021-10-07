import React, { Component } from 'react';
import './chooseBooks.css';
import Modal from 'react-modal';
import BookService from './../../services/bookService';

export default class ChooseBooksModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isOpen: false,
            books: [],
            selectedBooks: []
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.sendBooks = this.sendBooks.bind(this);
        this.handleBookChange = this.handleBookChange.bind(this);
    }

    toggleModal = () => {
        if(this.state.isOpen)
            this.setState({isOpen: false});
        else 
            this.setState({isOpen: true});
    }

    async componentDidMount() {
        const allBooks = await BookService.getAllBooks();
        let createdArray = []
        for(var b of allBooks) {
            const obj = {
                id: b.id,
                name: b.name,
                checked: false
            }
            createdArray.push(obj);
        }
        this.setState({books: createdArray});
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedBooks !== this.props.selectedBooks){
            this.setState({selectedBooks: this.props.selectedBooks});
            let array = this.state.books;

            for(var x of array) {
                x.checked = false;
            }

            for(var o of array) {
                for(var b of this.state.selectedBooks) {
                    if(o.id === parseInt(b)) {
                        o.checked = true;
                    }
                }
            }
            this.setState({books: array});
        }
    }

    handleBookChange = e => {
        if(e.target.checked) {
            let array = this.state.selectedBooks;
            array.push(e.target.value);
            this.setState({selectedBooks: array});
        }
        
        if(!e.target.checked) {
            let array = this.state.selectedBooks;
            if (array.indexOf(e.target.value) !== -1)
                array.splice(array.indexOf(e.target.value), 1);
            this.setState({selectedBooks: array});
        }
    }

    sendBooks = () => this.props.sendData(this.state.selectedBooks);
    
    render() {
        return (
            <Modal isOpen={this.state.isOpen} onRequestClose={this.toggleModal} ariaHideApp={false} className="chooseBooksModal">
                <div className="chooseBooksWrapper">
                    <div className="chooseBookSearch">
                        <input type="text" placeholder="Search..." className="chooseBooksSearchBar"/>
                    </div>
                    {this.state.books.map(b => (
                        <div key={b.id} className="chooseBooksInfo">
                            <input type="checkbox" 
                                    key={b.id} 
                                    onChange={this.handleBookChange} 
                                    value={b.id} 
                                    className="chooseBookInput"
                                    defaultChecked={b.checked}/>
                            <span className="chooseBookLabel">{b.name}</span>
                        </div>
                    ))}
                    <div className="chooseBookSave">
                        <button onClick={this.sendBooks} className="chooseBookButton">Save</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
