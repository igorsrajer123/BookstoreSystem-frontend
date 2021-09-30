import Topbar from './sharedComponents/topbar/Topbar';
import Homepage from './sharedComponents/homepage/Homepage';
import Books from './sharedComponents/books/Books';
import OtherProducts from './sharedComponents/otherProducts/OtherProducts';
import UserProfile from './sharedComponents/userProfile/UserProfile';
import Writers from './sharedComponents/writers/Writers';
import Bookstores from './sharedComponents/bookstores/Bookstores';
import NewBookstoreAdmin from './sharedComponents/newEntities/newBookstoreAdmin/NewBookstoreAdmin';
import NewSeller from './sharedComponents/newEntities/newSeller/NewSeller';

import {BrowserRouter, Route} from 'react-router-dom';

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
        </BrowserRouter>
    );
}

export default App;
