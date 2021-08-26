import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import AuthService from '../services/AuthService';

//get admin user details from local storage
function getUserDetailsFromStorage() {
  var user = AuthService.getUserData();

  // console.log(user);

  if (user) {
    return user.userData;
  } else {
    return null;
  }
}

//logged in user routes
function UserRoutes({ component: ProComponent, ...rest }) {
  // console.log("object",authed, userType)
  var userDetails = getUserDetailsFromStorage();

  if (userDetails != null) {
    return (
      <Route
        {...rest}
        render={(props) =>
          userDetails.isAdmin == false ? (
            <ProComponent {...props} />
          ) : (
            <Redirect to="/session/401" />
          )
        }
      />
    );
  } else {
    return <Redirect to="/session/expired" />;
  }
}

function AdminRoutes({ component: ProComponent, ...rest }) {
  // console.log("object",authed, userType)
  var userDetails = getUserDetailsFromStorage();

  if (userDetails != null) {
    return (
      <Route
        {...rest}
        render={(props) =>
          userDetails.isAdmin ? (
            <ProComponent {...props} />
          ) : (
            <Redirect to="/session/401" />
          )
        }
      />
    );
  } else {
    return <Redirect to="/session/expired" />;
  }
}

export { UserRoutes, AdminRoutes };
