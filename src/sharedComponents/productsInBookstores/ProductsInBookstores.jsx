import React, { Component } from 'react';
import './productsInBookstores.css';
import LoginService from './../../services/loginService';
import SellerService from './../../services/sellerService';
import BookstoreAdministratorService from './../../services/bookstoreAdministratorService';
import BookstoreService from './../../services/bookstoreService';
import ProductsInBookstoresService from './../../services/productsInBookstoreService';

export default class ProductsInBookstores extends Component {
    constructor() {
        super();

        this.state = {
            currentUser: null,
            booksInBookstore: [],
            otherProductsInBookstore: [],
            newObjects: []
        }
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        this.setState({currentUser: currentUser});

        if(currentUser !== null) {
            if(currentUser.type === "ROLE_SELLER") {
                const seller = await SellerService.getSellerByUserId(currentUser.id);
                const sellersBookstore = await BookstoreService.getBookstoreBySellerId(seller.id);
                
                const books = await ProductsInBookstoresService.getBooksInBookstore(sellersBookstore.id);
                this.setState({booksInBookstore: books});

                const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(sellersBookstore.id);
                this.setState({otherProductsInBookstore: otherProducts});

                let ourBooks = []
                for(var b of books) {
                    let book = await ProductsInBookstoresService.getBookByBooksInBookstoreId(b.id);
                    const object = {
                                id:     b.id,
                                name:   book.name,
                                amount: b.amount
                    }
                    ourBooks.push(object);
                }

                this.setState({newObjects: ourBooks});
            }else if(currentUser.type === "ROLE_BOOKSTORE_ADMIN") {
                const admin = await BookstoreAdministratorService.getBookstoreAdministratorByUserId(currentUser.id);
                const adminsBookstore = await BookstoreService.getBookstoreByAdminId(admin.id);

                const books = await ProductsInBookstoresService.getBooksInBookstore(adminsBookstore.id);
                this.setState({booksInBookstore: books});

                const otherProducts = await ProductsInBookstoresService.getOtherProductsInBookstore(adminsBookstore.id);
                this.setState({otherProductsInBookstore: otherProducts});

                let ourBooks = []
                for(var b of books) {
                    let book = await ProductsInBookstoresService.getBookByBooksInBookstoreId(b.id);
                    const object = {
                        id:     b.id,
                        name:   book.name,
                        amount: b.amount
                    }
                    ourBooks.push(object);
                }
                this.setState({newObjects: ourBooks});
            }
        }
    }

    render() {
        return (
            <div className="productsInBookstoresWrapper">
                <div className="booksInBookstore">
                    <h2>Books on Stock</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Ime</th>
                                <th>Kolicina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.newObjects.map(n => (
                                <tr key={n.id}>
                                    <td>{n.name}</td>
                                    <td>{n.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="otherProductsInBookstore">
                <h2>Other Products on Stock</h2>
                </div>
            </div>
        )
    }
}
