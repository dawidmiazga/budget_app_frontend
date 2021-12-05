import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AuthenticatedRoute from './AuthenticatedRoute.jsx'
import LoginComponent from './LoginComponent.jsx'
import ListExpensesComponent from './Expenses/ListExpensesComponent.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import FooterComponent from './FooterComponent.jsx'
import HeaderComponent from './HeaderComponent.js'
import LogoutComponent from './LogoutComponent.jsx'
import WelcomeComponent from './WelcomeComponent.jsx'
import ExpenseComponent from './Expenses/ExpenseComponent.jsx'
import IncomeComponent from './Incomes/IncomeComponent.jsx'
import ChartsComponent from './ChartsComponent.jsx'
import StatisticsComponent from './StatisticsComponent.jsx'
import ListIncomesComponent from './Incomes/ListIncomesComponent.jsx'
import ListCategoriesComponent from './Categories/ListCategoriesComponent.jsx';
import TestComponent from './TestComponent'
import CategoryComponent from './Categories/CategoryComponent.jsx';
import Navbar from '../Sidebar/Navbar.js';
import testTable from './TestTable.js';
import SidenavHeader from 'rsuite/esm/Sidenav/SidenavHeader';



class BudgetApp extends Component {

    render() {
        var rootStyle = {
            backgroundColor: 'white',//'rgb(64, 64, 64)',
            color: 'black',//white',
            height: '100vh',
        }
        return (
            <div style={rootStyle} >
                <Router>
                    
                    <HeaderComponent />
                    <Switch>
                        <Route path="/login" exact component={LoginComponent} />
                        <AuthenticatedRoute path="/welcome/:name" exact component={WelcomeComponent} />
                        <AuthenticatedRoute path="/expenses/:id" exact component={ExpenseComponent} />
                        <AuthenticatedRoute path="/incomes/:id" exact component={IncomeComponent} />
                        <AuthenticatedRoute path="/expenses" exact component={ListExpensesComponent} />
                        {/* <AuthenticatedRoute path="/charts" exact component={ChartsComponent} /> */}
                        <AuthenticatedRoute path="/statistics" exact component={StatisticsComponent} />
                        <AuthenticatedRoute path="/incomes" exact component={ListIncomesComponent} />
                        <AuthenticatedRoute path="/categories" exact component={ListCategoriesComponent} />
                        <AuthenticatedRoute path="/categories/:id" exact component={CategoryComponent} />
                        <AuthenticatedRoute path="/logout" exact component={LogoutComponent} />
                        <AuthenticatedRoute path="/test" exact component={TestComponent} />
                        {/* <AuthenticatedRoute path="/expenses/comment/:comment" exact component={TestComponent} /> */}
                        <Route component={ErrorComponent} />
                    </Switch>
                    {/* <Sidebar /> */}
                    <FooterComponent />
                </Router>
            </div>
        )
    }
}

export default BudgetApp;