import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthenticationService from "./AuthenticationService.js";

class AuthenticatedRoute extends Component {
    render() {
        if (AuthenticationService.isUserLoggedIn() || this.props.path==="/adduser") {
            return <Route {...this.props}/>
        } else
        return <Redirect to ="/login"/>
    }
}

export default AuthenticatedRoute