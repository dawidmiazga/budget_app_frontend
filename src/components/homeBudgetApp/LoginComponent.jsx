//LoginComponent

import React, { Component } from "react";
import AuthenticationService from "./AuthenticationService.js";
// import styles from "../counter/Counter";
// import '../../App.css'

class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: 'in28minutes',
            password: 'dummy',
            hasLoginFailed: false,
            showSuccessMsg: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.LoginClick = this.LoginClick.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    LoginClick() {
        if ((this.state.username === 'in28minutes' && this.state.password === 'dummy')
            || (this.state.username === 'dawid' && this.state.password === 'x')) {
            AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password)
            this.props.history.push(`/welcome/${this.state.username}`)
        }
        else {
            this.setState({ showSuccessMsg: false })
            this.setState({ hasLoginFailed: true })
        }

    }
    render() {
        return (
            <div>
                
                <div className="container">
                    {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                    User Name:
                </div>
                <div className="container">
                    <input type='text' className='margines' name='username' value={this.state.username} onChange={this.handleChange} />
                </div>
                <div className="container">
                    Password:
                </div>
                <div className="container">
                    <input type='password' className='margines' name='password' value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="container">
                    <button className="button" onClick={this.LoginClick}>Login</button>
                </div>
            </div>
        )
    }


}

export default LoginComponent