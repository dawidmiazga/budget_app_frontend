import React, { useRef, Component } from "react";
import AuthenticationService from "../AuthenticationService.js";
import LoginDataService from '../../../api/HomeBudget/LoginDataService.js';
// import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
// import emailjs from 'emailjs-com';

class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: 'dawid',
            password: 'haslo',
            hasLoginFailed: false,
            showSuccessMsg: false,
            users: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.LoginClick = this.LoginClick.bind(this)
        this.AddUser = this.AddUser.bind(this)
        this.PasswordReciever = this.PasswordReciever.bind(this)
        this.SendEmail = this.SendEmail.bind(this)
    }

    componentDidMount() {
        this.refreshUsers()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    refreshUsers() {
        AuthenticationService.registerSuccessfulLogin('', '', '')
        LoginDataService.retrieveAllLogins()
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    }

    LoginClick() {
        var usernamechoice = this.state.username
        var usernamepassword = this.state.password
        const arrUsers = ([
            (this.state.users.map(user => user.username)),
            (this.state.users.map(user => user.password)),
            (this.state.users.map(user => user.usernameid)),
            (this.state.users.map(user => user.useremail))
        ]);

        if (arrUsers[0].includes(usernamechoice)) {
            var passwordOfUserFromSQL = arrUsers[1][arrUsers[0].indexOf(usernamechoice)]
            var idOfUserFromSQL = arrUsers[2][arrUsers[0].indexOf(usernamechoice)]

            if (usernamepassword == passwordOfUserFromSQL) {
                AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password, idOfUserFromSQL)
                this.props.history.push(`/welcome/${idOfUserFromSQL}`)
            } else {
                this.setState({ showSuccessMsg: false })
                this.setState({ hasLoginFailed: true })
            }
        } else {
            this.setState({ showSuccessMsg: false })
            this.setState({ hasLoginFailed: true })
        }
    }

    PasswordReciever() {
        this.setState({ message: `Funkcja odzyskiwania hasłą w trakcie realizacji. Będzie dostępna w najbliższym czasie` })
        var usernamechoice = this.state.username
        var usernamepassword = this.state.password
        const arrUsers = ([
            (this.state.users.map(user => user.username)),
            (this.state.users.map(user => user.password)),
            (this.state.users.map(user => user.usernameid)),
            (this.state.users.map(user => user.useremail))
        ]);

    }

    AddUser() {
        this.props.history.push(`/userslist/-1`)
    }


    SendEmail() {
        console.log("Send")
    }
    
    render() {
        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-light">{this.state.message}</div>}
                <div className="text-h5-white">
                    {this.state.hasLoginFailed && <div className="alert alert-warning">Zly login lub haslo</div>}
                    Login:
                </div>
                <div className="container">
                    <input type='text' className='margines' name='username' value={this.state.username} onChange={this.handleChange} />
                </div>
                <div className="text-h5-white">
                    Haslo:
                </div>
                <div className="container">
                    <input type='password' className='margines' name='password' value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="container-middle-41">
                    <button className="button-66" onClick={this.LoginClick}>Zaloguj</button>
                    <button className="button-77" onClick={this.PasswordReciever}>Zapomnialem Hasla</button>
                    {/* <button className="button-66" onClick={this.SendEmail}>x</button> */}
                </div>
            </div>
        )
    }
}

export default LoginComponent