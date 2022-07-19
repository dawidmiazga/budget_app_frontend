import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "./AuthenticationService.js";
import { withRouter } from 'react-router';
import btnHome from '../images/home_button.png';
import logo from '../images/edit_button.png';

class HeaderComponent extends Component {

    constructor(props) {
        super(props)
        this.addExpenseClicked = this.addExpenseClicked.bind(this)
        this.addIncomeClicked = this.addIncomeClicked.bind(this)
        this.AddUser = this.AddUser.bind(this)
    }

    addExpenseClicked() {
        this.props.history.push(`/expenses/-1`)
    }
    addIncomeClicked() {
        this.props.history.push(`/incomes/-1`)
    }
    AddUser() {
        this.props.history.push(`/userslist/-1`)
    }
    render() {
        var isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        var webAddress = window.location.href
        if (webAddress.includes("userslist")) {
            isUserLoggedIn = false
        }
        var rootStyle = {
            backgroundColor: 'rgb(38, 38, 38)',
        }

        return (
            <header>

                <nav className="navbar navbar-expand-md navbar-dark" style={rootStyle}>
                    <ul className="navbar-nav">
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/welcome/dawid">Strona Domowa</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/expenses">Wydatki</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/incomes">Przychody</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/categories">Kategorie</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/budgets">Budżety</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/statistics">Statystyki</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/settings">Ustawienia</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/test">Test</Link></li>}
                    </ul>

                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {isUserLoggedIn && <button className="button-66" onClick={this.addExpenseClicked}>Dodaj wydatek</button>}
                        {isUserLoggedIn && <button className="button-66" onClick={this.addIncomeClicked}>Dodaj przychod</button>}
                        {(!isUserLoggedIn && !webAddress.includes("userslist")) && <button className="button-77" onClick={this.AddUser}>Dodaj konto</button>}
                        {(webAddress.includes("login") || !isUserLoggedIn) && <li><Link className="hb-nav-link" to="/login">Zaloguj</Link></li>}
                        {isUserLoggedIn && <li><Link className="hb-nav-link" to="/logout" onClick={AuthenticationService.logout}>Wyloguj</Link></li>}
                    </ul>
                </nav>
            </header>
        )
    }
}

export default withRouter(HeaderComponent);