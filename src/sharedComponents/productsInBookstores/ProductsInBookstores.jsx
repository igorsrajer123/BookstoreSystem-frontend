import React, { Component } from 'react';
import './productsInBookstores.css';
import LoginService from './../../services/loginService';
import SellerService from './../../services/sellerService';
import BookstoreAdministratorService from './../../services/bookstoreAdministratorService';
import BookstoreService from './../../services/bookstoreService';
import ProductsInBookstoresService from './../../services/productsInBookstoreService';
import EditProductAmountModal from '../../modals/productsInBookstores/EditProductAmountModal';

export default class ProductsInBookstores extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            currentUser: null,
            booksInBookstore: [],
            otherProductsInBookstore: [],
            newObjectsBooks: [],
            newObjectsOtherProducts: [],
            currentBookstore: "",
            bookstoreAdminLogged: false,
            sellerLogged: false,
            selectedProduct: null
        }

        this.editProductAmountClick = this.editProductAmountClick.bind(this);
        this.searchBooks = this.searchBooks.bind(this);
        this.searchOtherProducts = this.searchOtherProducts.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});

        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SELLER") {
                this.setState({bookstoreAdminLogged: false});
                this.setState({sellerLogged: true});

                const seller = await SellerService.getSellerByUserId(currentUser.id);
                const sellersBookstore = await BookstoreService.getBookstoreBySellerId(seller.id);
                this.setState({currentBookstore: sellersBookstore});

                const books = await ProductsInBookstoresService.getBooksInBookstore(sellersBookstore.id);
                this.setState({booksInBookstore: books});

                const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(sellersBookstore.id);
                this.setState({otherProductsInBookstore: otherProducts});
                
                await this.generateNewObjectsBooks(books);
                await this.generateNewObjectsOtherProducts(otherProducts);
            }else if(currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                this.setState({bookstoreAdminLogged: true});
                this.setState({sellerLogged: false});
                
                const admin = await BookstoreAdministratorService.getBookstoreAdministratorByUserId(currentUser.id);
                const adminsBookstore = await BookstoreService.getBookstoreByAdminId(admin.id);
                this.setState({currentBookstore: adminsBookstore});

                const books = await ProductsInBookstoresService.getBooksInBookstore(adminsBookstore.id);
                this.setState({booksInBookstore: books});

                const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(adminsBookstore.id);
                this.setState({otherProductsInBookstore: otherProducts});
                
                await this.generateNewObjectsBooks(books);
                await this.generateNewObjectsOtherProducts(otherProducts);
            }else {
                window.location.href = "http://localhost:3000/";
            }
        }else {
            window.location.href = "http://localhost:3000/";
        }
    }

    async generateNewObjectsBooks(booksInBookstore) {
        let ourBooks = [];
        for(var b of booksInBookstore) {
            let book = await ProductsInBookstoresService.getBookByBooksInBookstoreId(b.id);
            const object = {
                id:     b.id,
                name:   book.name,
                publisher:  book.publisher,
                price:  book.price,
                amount: b.amount,
                type: null
            }
            ourBooks.push(object);
        }
        this.setState({newObjectsBooks: ourBooks.sort((a, b) => a.name.localeCompare(b.name))});
    }

    async generateNewObjectsOtherProducts(otherProductsInBookstore) {
        let ourOtherProducts = [];
        for(var o of otherProductsInBookstore) {
            let otherProduct = await ProductsInBookstoresService.getOtherProductByOtherProductsBookstoresId(o.id);
            const object = {
                id: o.id,
                name: otherProduct.name,
                publisher: otherProduct.publisher,
                price: otherProduct.price,
                amount: o.amount,
                type: otherProduct.type
            }
            ourOtherProducts.push(object);
        }
        this.setState({newObjectsOtherProducts: ourOtherProducts.sort((a, b) => a.name.localeCompare(b.name))});
    }

    editProductAmountClick  = productInBookstore => {
        this.setState({selectedProduct: productInBookstore});
        this.child.current.toggleModal();
    }

    searchBooks = async e => {
        if(e.target.value === "") {
            const books = await ProductsInBookstoresService.getBooksInBookstore(this.state.currentBookstore.id);
            await this.generateNewObjectsBooks(books);
        }else {
            const books = await ProductsInBookstoresService.getBooksInBookstore(this.state.currentBookstore.id);
            await this.generateNewObjectsBooks(books);
            let array = [];
            for(let o of this.state.newObjectsBooks) {
                if(o.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                    array.push(o);
                }
            }
            this.setState({newObjectsBooks: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    searchOtherProducts = async e => {
        if(e.target.value === "") {
            const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(this.state.currentBookstore.id);
            await this.generateNewObjectsOtherProducts(otherProducts);
        }else {
            const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(this.state.currentBookstore.id);
            await this.generateNewObjectsOtherProducts(otherProducts);
            let array = [];
            for(let o of this.state.newObjectsOtherProducts) {
                if(o.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                    array.push(o);
                }
            }
            this.setState({newObjectsOtherProducts: array.sort((a, b) => a.name.localeCompare(b.name))});
        }
    }

    render() {
        return (
            <div className="productsInBookstoresWrapper">
                <EditProductAmountModal ref={this.child} product={this.state.selectedProduct}/>
                <div className="booksInBookstore">
                    <h2 className="booksInBookstoreHeader">Books on Stock</h2>
                    <input type="text" placeholder="Search..." onChange={this.searchBooks} className="booksInBookstoreSearchInput" />
                    <table className="booksInBookstoreTable">
                        <thead className="booksInBookstoreTableHead">
                            <tr>
                                <th>Name</th>
                                <th>Publisher</th>
                                <th>Price(RSD)</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="booksInBookstoreTableBody">
                            {this.state.newObjectsBooks.map(n => (
                                <tr key={n.id}>
                                    <td className="booksInBookstoreContent">{n.name}</td>
                                    <td className="booksInBookstoreContent">{n.publisher.name}({n.publisher.address}, {n.publisher.city})</td>
                                    <td className="booksInBookstoreContent">{n.price}</td>
                                    <td className="booksInBookstoreContent">{n.amount}</td>
                                    <td className="booksInBookstoreContent"><button className="editProductAmount" 
                                                                                    onClick={() => this.editProductAmountClick(n)} 
                                                                                    style={{display: this.state.bookstoreAdminLogged ? 'inline' : 'none'}}>Edit Amount</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="otherProductsInBookstore">
                    <h2 className="booksInBookstoreHeader">Other Products on Stock</h2>
                    <input type="text" placeholder="Search..." onChange={this.searchOtherProducts} className="booksInBookstoreSearchInput" />
                    <table className="booksInBookstoreTable">
                        <thead className="booksInBookstoreTableHead">
                            <tr>
                                <th>Name</th>
                                <th>Publisher</th>
                                <th>Price(RSD)</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="booksInBookstoreTableBody">
                            {this.state.newObjectsOtherProducts.map(n => (
                                <tr key={n.id}>
                                    <td className="booksInBookstoreContent">{n.name}</td>
                                    <td className="booksInBookstoreContent">{n.publisher.name}({n.publisher.address}, {n.publisher.city})</td>
                                    <td className="booksInBookstoreContent">{n.price}</td>
                                    <td className="booksInBookstoreContent">{n.type}</td>
                                    <td className="booksInBookstoreContent">{n.amount}</td>
                                    <td className="booksInBookstoreContent"><button className="editProductAmount"
                                                                                    onClick={() => this.editProductAmountClick(n)} 
                                                                                    style={{display: this.state.bookstoreAdminLogged ? 'inline' : 'none'}}>Edit Amount</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
