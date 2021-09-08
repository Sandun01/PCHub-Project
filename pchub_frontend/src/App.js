import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import './App.css'

//routes
import { UserRoutes, AdminRoutes } from './routes/Routes'

//user components
import Home from './components/user/Home';
import LeftNavMain from './components/user/LeftNavMain';
import Cart from './components/user/Cart';
import CheckoutScreen from './components/user/CheckoutScreen';
import ViewOrder from './components/user/ViewOrder';

//products
import AllProducts from './components/user/products/AllProducts'
import ProductSingleView from './components/user/products/ProductSingleView'
import SearchResults from './components/user/products/SearchResults'

import PrivacyPolicy from './components/user/static/PrivacyPolicy'
import AboutUs from './components/user/static/AboutUs'
import ContactUs from './components/user/static/ContactUs'
import Services from './components/user/static/Services'

//admin components
import AdminDashboard from './components/admin/AdminDashboard'
import AddNewItem from './components/admin/addNewItem'
import ViewItems from './components/admin/viewItems'
import UserProfile from './components/user/UserProfile'
import AdminLeftNavMain from './components/admin/AdminLeftNavMain'
import ViewUsers from './components/admin/viewUsers'

//common components
import Header from './components/common/Header'
import Footer from './components/common/Footer'

//public components
import Login from './components/public/Login'
//import PrivateRoute from './components/routing/PrivateRoute';
import Private from './components/public/Private'
import Register from './components/public/Register'
import ForgotPassword from './components/public/ForgotPassword'
import ResetPassword from './components/public/ResetPassword'

//session components
import NotAuthorized from './components/sessions/NotAuthorized'
import NotFound from './components/sessions/NotFound'
import TokenExpired from './components/sessions/TokenExpired'

//services
import AuthService from './services/AuthService'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isAdmin: false,
    }
  }

  async getUserData() {
    var uData = await AuthService.getUserData()
    var uInfo = null

    if (uData != null) {
      var uInfo = uData.userData
      this.setState({
        user: uInfo,
        isAdmin: uInfo.isAdmin,
      })
    }

   

    // console.log(uData);
  }

  componentDidMount() {
    //get user data
    this.getUserData()
  }

  render() {
    let sidebar
    if (this.state.isAdmin) {
      sidebar = <AdminLeftNavMain />
    } else {
      sidebar = <LeftNavMain />
    }

    return (
      <Router>
        <Header user={this.state.user} />

        {/* <main style={{ display: 'flex', backgroundImage: "url(images/background.jpg)"}}> */}
        <main style={{ display: 'flex' }}>
          {sidebar}

          <Switch>
            {/* Guest user Routes */}
            <Route exact path='/' component={Home} />
            <Route exact path='/aboutUs' component={PrivacyPolicy} />
            <Route exact path='/contactUs' component={ContactUs} />
            <Route exact path='/services' component={Services} />
            <Route exact path='/privacyPolicy' component={AboutUs} />

            <Route
              exact
              path='/products/search/:name'
              component={SearchResults}
            />
            <Route exact path='/products/:category' component={AllProducts} />
            <Route exact path='/product/:id' component={ProductSingleView} />

            <Route exact path='/cart' component={Cart} />

            {/* Registered User Routes */}
            {/* <UserRoutes exact path="/" /> */}
            <Route exact path="/checkout" component={CheckoutScreen} />
            <Route exact path="/orders/:id" component={ViewOrder} />


            {/* Admin User Routes */}
            {/* <AdminRoutes exact path="/admin" component={AdminDashboard} /> */}
            <Route exact path='/admin/addItem' component={AddNewItem} />
            <Route exact path='/admin/viewItems' component={ViewItems} />
            <Route exact path='/admin/viewUsers' component={ViewUsers} />
            <Route exact path='/admin' component={AdminDashboard} />

            {/* Session Routes */}

            {/* User login and registration routes here*/}
            {/* <PrivateRoute exact path="/" component={Private} /> */}
            <Route exact path='/login' component={Login} />

            <Route exact path='/register' component={Register} />
            <Route exact path='/forgotpassword' component={ForgotPassword} />
            <Route
              exact
              path='/passwordreset/:resetToken'
              component={ResetPassword}
            />

            <UserRoutes exact path='/account' component={UserProfile} />

            <Route exact path='/session/401' component={NotAuthorized} />
            <Route exact path='/session/404' component={NotFound} />
            <Route exact path='/session/expired' component={TokenExpired} />

            <Route path='*' component={() => <Redirect to='/session/404' />} />
          </Switch>
        </main>

        <Footer />
      </Router>
    )
  }
}

export default App
