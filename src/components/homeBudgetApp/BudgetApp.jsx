import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthenticatedRoute from './AuthenticatedRoute.jsx'
import LoginComponent from './Login/LoginComponent.jsx'
import ListExpensesComponent from './Expenses/ListExpensesComponent.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import FooterComponent from './FooterComponent.jsx'
import HeaderComponent from './HeaderComponent.js'
import LogoutComponent from './LogoutComponent.jsx'
import WelcomeComponent from './WelcomeComponent.jsx'
import ExpenseComponent from './Expenses/ExpenseComponent.jsx'
import IncomeComponent from './Incomes/IncomeComponent.jsx'
import StatisticsComponent from './StatisticsComponent.jsx'
import ListIncomesComponent from './Incomes/ListIncomesComponent.jsx'
import ListCategoriesComponent from './Categories/ListCategoriesComponent.jsx';
import CategoryComponent from './Categories/CategoryComponent.jsx';
import ListBudgetsComponent from './Budget/ListBudgetComponent.jsx';
import BudgetComponent from './Budget/BudgetComponent.jsx';
import AddUserComponent from './Login/LoginAddComponent.jsx';
import ListSettingsComponent from './Settings/ListSettingsComponent.jsx';

class BudgetApp extends Component {

    render() {
        var rootStyle = {
            backgroundColor: 'white',
            color: 'black',
            height: '100vh',
        }
        return (
            <div style={rootStyle} >
                <Router>

                    <HeaderComponent />
                    <Switch>
                        <Route path="/" exact component={LoginComponent} />
                        <Route path="/login" exact component={LoginComponent} />
                        <AuthenticatedRoute path="/welcome/:name" exact component={WelcomeComponent} />
                        <AuthenticatedRoute path="/expenses/:id" exact component={ExpenseComponent} />
                        <AuthenticatedRoute path="/incomes/:id" exact component={IncomeComponent} />
                        <AuthenticatedRoute path="/expenses" exact component={ListExpensesComponent} />
                        <AuthenticatedRoute path="/statistics" exact component={StatisticsComponent} />
                        <AuthenticatedRoute path="/incomes" exact component={ListIncomesComponent} />
                        <AuthenticatedRoute path="/categories" exact component={ListCategoriesComponent} />
                        <AuthenticatedRoute path="/categories/:id" exact component={CategoryComponent} />
                        <AuthenticatedRoute path="/budgets" exact component={ListBudgetsComponent} />
                        <AuthenticatedRoute path="/budgets/:id" exact component={BudgetComponent} />
                        <AuthenticatedRoute path="/userslist/:id" exact component={AddUserComponent} />
                        <AuthenticatedRoute path="/logout" exact component={LogoutComponent} />
                        <AuthenticatedRoute path="/settings" exact component={ListSettingsComponent} />
                        <AuthenticatedRoute path="/changepassword/:id" exact component={AddUserComponent} />
                        <Route component={ErrorComponent} />
                    </Switch>
                    <FooterComponent />
                </Router>
            </div>
        )
    }
}

export default BudgetApp;