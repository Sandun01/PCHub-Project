import React, { Component, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';

//routes
import { UserRoutes, AdminRoutes } from './routes/Routes';

//user components
import Home from './components/user/Home';
import LeftNavMain from './components/user/LeftNavMain';
import Cart from './components/user/Cart';

//products
import AllProducts from './components/user/products/AllProducts';
import ProductSingleView from './components/user/products/ProductSingleView';
import SearchResults from './components/user/products/SearchResults';

import PrivacyPolicy from './components/user/static/PrivacyPolicy';
import AboutUs from './components/user/static/AboutUs';
import ContactUs from './components/user/static/ContactUs';
import Services from './components/user/static/Services';

//admin components
import AdminDashboard from './components/admin/AdminDashboard';
import AddNewItem from './components/admin/addNewItem';
import UserProfile from './components/user/UserProfile';

//common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

//public components
import Login from './components/public/Login';

//session components
import NotAuthorized from './components/sessions/NotAuthorized';
import NotFound from './components/sessions/NotFound';
import TokenExpired from './components/sessions/TokenExpired';

class App extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {}

  render() {
    return (
      <Router>
        
        <Header />

        {/* <main style={{ display: 'flex', backgroundImage: "url(images/background.jpg)"}}> */}
        <main style={{ display: 'flex',}} >
          
          <LeftNavMain />

          <Switch>
            {/* Guest user Routes */}
            <Route exact path="/" component={Home} />
            <Route exact path="/aboutUs" component={PrivacyPolicy} />
            <Route exact path="/contactUs" component={ContactUs} />
            <Route exact path="/services" component={Services} />
            <Route exact path="/privacyPolicy" component={AboutUs} />

            <Route exact path="/products/search/:name" component={SearchResults} />
            <Route exact path="/products/:category" component={AllProducts} />
            <Route exact path="/product/:id" component={ProductSingleView} />

            <Route exact path="/cart" component={Cart} />

            {/* Registered User Routes */}
            {/* <UserRoutes exact path="/" /> */}

            {/* Admin User Routes */}
            {/* <AdminRoutes exact path="/admin" component={AdminDashboard} /> */}
            <Route exact path="/addItem" component={AddNewItem} />

            {/* Session Routes */}

            {/* User login and registration routes here*/}
            <Route exact path="/login" component={Login} />

            <Route exact path="/account" component={UserProfile} />

            {/* <Route exact path="/session/401" component={NotAuthorized} /> */}
            {/* <Route exact path="/session/404" component={NotFound} /> */}
            {/* <Route exact path="/session/expired" component={TokenExpired} /> */}

            {/* <Route path="*" component={() => <Redirect to="/session/404" />} /> */}
          </Switch>
        </main>

        <Footer />
      </Router>
    );
  }
}

export default App;
