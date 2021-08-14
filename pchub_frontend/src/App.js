  
import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

//routes
import { UserRoutes, AdminRoutes } from "./routes/Routes";

// guest user components
import Home from './components/user/Home'

//admin components
import AdminDashboard from './components/admin/AdminDashboard'

//common components
import Header from './components/common/Header'
import Footer from './components/common/Footer'

//session components
import NotAuthorized from './components/sessions/NotAuthorized'
import NotFound from './components/sessions/NotFound'
import TokenExpired from './components/sessions/TokenExpired'

class App extends Component{

    constructor(props) {
      super(props);
    }

    componentDidMount(){
    }

    render() {
        return(
            <Router>
                <Header />
               
                <main style={{ marginTop: '10px', }}>

                    

                    <Switch>
                        {/* Guest user Routes */}
                        <Route exact path="/" component={Home} />

                        {/* Registered User Routes */}
                        {/* <UserRoutes exact path="/" /> */}

                        {/* Admin User Routes */}
                        <AdminRoutes exact path="/admin" component={AdminDashboard} />

                        
                        {/* Session Routes */}
                          
                          {/* User login and registration routes here*/}

                        <Route exact path="/session/401" component={NotAuthorized} />
                        <Route exact path="/session/404" component={NotFound} />
                        <Route exact path="/session/expired" component={TokenExpired} />
                        
                        <Route path="*" component={ () => <Redirect to="/session/404"/> } />

                        
                    </Switch>
                </main>
                
                <Footer />

            </Router>
        )
    }

}

export default App;