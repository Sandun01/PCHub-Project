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

// guest user components
import Home from './components/user/Home';
import PrivacyPolicy from './components/user/PrivacyPolicy';
import AboutUs from './components/user/AboutUs';

//admin components
import AdminDashboard from './components/admin/AdminDashboard';

//common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LeftNavMain from './components/common/LeftNavMain';

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

        <main style={{ display: 'flex', backgroundImage: "url(images/background.jpg)"}}>
          
          <LeftNavMain />
          
          <Switch>
            {/* <Login /> */}
            {/* Guest user Routes */}
            <Route exact path="/" component={Home} />
            <Route exact path="/a" component={PrivacyPolicy} />
            <Route exact path="/b" component={AboutUs} />

            {/* Registered User Routes */}
            {/* <UserRoutes exact path="/" /> */}

            {/* Admin User Routes */}
            {/* <AdminRoutes exact path="/admin" component={AdminDashboard} /> */}

            {/* Session Routes */}

            {/* User login and registration routes here*/}

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
