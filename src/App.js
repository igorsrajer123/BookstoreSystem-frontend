import Topbar from './sharedComponents/topbar/Topbar';
import Homepage from './sharedComponents/homepage/Homepage';
import Books from './sharedComponents/books/Books';
import OtherProducts from './sharedComponents/otherProducts/OtherProducts';
import UserProfile from './sharedComponents/userProfile/UserProfile';
import Writers from './sharedComponents/writers/Writers';
import Bookstores from './sharedComponents/bookstores/Bookstores';
import NewBookstoreAdmin from './sharedComponents/newEntities/newBookstoreAdmin/NewBookstoreAdmin';
import NewSeller from './sharedComponents/newEntities/newSeller/NewSeller';
import NewBookstore from './sharedComponents/newEntities/newBookstore/NewBookstore';
import NewWriter from './sharedComponents/newEntities/newWriter/NewWriter';
import NewProduct from './sharedComponents/newEntities/newProduct/NewProduct';
import {BrowserRouter, Route} from 'react-router-dom';
import PublishersAndGenres from './sharedComponents/publishersAndGenres/PublishersAndGenres';
import Customers from './sharedComponents/customers/Customers';
import ProductsInBookstores from './sharedComponents/productsInBookstores/ProductsInBookstores';
import CashRegister from './sharedComponents/cashRegister/CashRegister';
import PreviewProduct from './sharedComponents/product/PreviewProduct';
import ShoppingCart from './sharedComponents/shoppingCart/ShoppingCart';

function App() {
	return (
        <BrowserRouter>
            <Route path="/" component={Topbar} />
            <Route path="/" exact component={Homepage} />
            <Route path="/books" component={Books} />
            <Route path="/otherProducts" component={OtherProducts} />
            <Route path="/profile" exact component={UserProfile} />
            <Route path="/writers" exact component={Writers} />
            <Route path="/bookstores" exact component={Bookstores} />
            <Route path="/newBookstoreAdmin" exact component={NewBookstoreAdmin} />
            <Route path="/newSeller" exact component={NewSeller} />
            <Route path="/newBookstore" exact component={NewBookstore} />
            <Route path="/newWriter" exact component={NewWriter} />
            <Route path="/newProduct" exact component={NewProduct} />
            <Route path="/publishersAndGenres" exact component={PublishersAndGenres} />
            <Route path="/customers" exact component={Customers} />
            <Route path="/productsStock" exact component={ProductsInBookstores} />
            <Route path="/cashRegister" exact component={CashRegister} />
            <Route path="/previewProduct/" component={PreviewProduct} />
            <Route path="/shoppingCart/" component={ShoppingCart} />
        </BrowserRouter>
    );
}

export default App;
