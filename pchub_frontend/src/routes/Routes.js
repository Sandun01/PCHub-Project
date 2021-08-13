import React, { Children, Component } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

//get user details from local storage function

//logged in user routes
function UserRoutes({ component: ProComponent, ...rest}){
    return
    (
        <Route
            { ...rest}
            render={
                (props) => (<ProComponent {...props} />)
            } 
        />
    )
        
}

//logged in admin routes
function AdminRoutes({ component: ProComponent, ...rest}){
    return
    (
        <Route
            { ...rest}
            render={
                (props) => (<ProComponent {...props} />)
            } 
        />
    )
}

export{
    UserRoutes,
    AdminRoutes,
}