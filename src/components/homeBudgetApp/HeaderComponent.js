import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "./AuthenticationService.js";
import { withRouter } from 'react-router';
import * as FaIcons from "react-icons/fa"

class HeaderComponent extends Component {

    constructor(props) {
        super(props)
        this.addExpenseClicked = this.addExpenseClicked.bind(this)
    }

    addExpenseClicked() {
        this.props.history.push(`/expenses/-1`)
    }

    render() {

        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        var rootStyle = {
            backgroundColor: 'rgb(38, 38, 38)',
        }
        // console.log("x " + isUserLoggedIn)
        return (
            <header>

                <nav className="navbar navbar-expand-md navbar-dark" style={rootStyle}>
                    {/* <div className="Sidebar"> */}
                    {/* <FaIcons.FaBars/> */}
                    <ul className="navbar-nav">
                        {isUserLoggedIn && <li><Link className="nav-link" to="/welcome/dawid">Home</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-link" to="/expenses">Expenses</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-link" to="/incomes">Income</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-link" to="/statistics">Statistics</Link></li>}
                        {/* {isUserLoggedIn && <li><Link className="nav-link" to="/charts">Charts</Link></li>} */}

                        {isUserLoggedIn && <li><Link className="nav-link" to="/categories">Categories</Link></li>}

                        {isUserLoggedIn && <li><Link className="nav-link" to="/test">Nav4</Link></li>}
                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {!isUserLoggedIn && <li><Link className="nav-link" to="/login">Login</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}
                    </ul>

                    <div>
                        <button className="button" onClick={this.addExpenseClicked}>Add</button>
                    </div>
                    {/* </div> */}

                </nav>
            </header>


        )
    }
}

export default withRouter(HeaderComponent);