import Topbar from './sharedComponents/topbar/Topbar';
import Homepage from './sharedComponents/homepage/Homepage';
import Books from './sharedComponents/books/Books';
import OtherProducts from './sharedComponents/otherProducts/OtherProducts';
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
	return (
        <BrowserRouter>
            <Route path="/" component={Topbar} />
            <Route path="/" exact component={Homepage} />
            <Route path="/books" exact component={Books} />
            <Route path="/otherProducts" exact component={OtherProducts} />
        </BrowserRouter>
    );
}

export default App;
