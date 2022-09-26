import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import BudgetDataService from '../../../api/HomeBudget/BudgetDataService.js'
import IncomeDataService from "../../../api/HomeBudget/IncomeDataService.js";
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import {
    getLastDayOfYear, getFirstDayOfYear, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, categoryMap, dateFilter, daysLeftCount, arrMthEng, arrMthPol, formatter, formatPercentage,
    checkIfRecordIsInTheMonth, sortFunction, arrayColumn, getCatTotals
} from '../CommonFunctions.js'

class BudgetComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            budgets: [],
            incomes: [],
            budgetid: this.props.match.params.id,
            budgetid2: this.props.match.params.id2,
            target_month: newDateYYYYMM(new Date()),
            amount: '',
            comment: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.cancelButton = this.cancelButton.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.changeMth = this.changeMth.bind(this)
    }

    componentDidMount() {
        this.refreshIncomes()
        if (this.state.budgetid == -1 && this.state.budgetid2 == null) {
            this.refreshBudgets()
            return
        }
        let usernameid = AuthenticationService.getLoggedInUserName()
        if (this.state.budgetid == -1) {
            BudgetDataService.retrieveBudget(usernameid, this.state.budgetid2)
                .then(response => this.setState({
                    target_month: newDateYYYYMM(response.data.target_month),
                    amount: response.data.amount,
                    comment: response.data.comment,
                }))
        } else {
            BudgetDataService.retrieveBudget(usernameid, this.state.budgetid)
                .then(response => this.setState({
                    target_month: newDateYYYYMM(response.data.target_month),
                    amount: response.data.amount,
                    comment: response.data.comment,
                }))
        }
        this.refreshBudgets()
    }

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(response => {
                this.setState({ budgets: response.data })
            })
    }

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ incomes: response.data })
                }
            )
    };

    changeMth() {
        var choosenMth = document.getElementById("choosenMth").value;
        this.setState({ target_month: choosenMth, })
    }

    validate(values) {
        const allPeriods = this.state.budgets.map(budget => newDateYYYYMM(budget.target_month));
        let errors = {}
        if (!moment(values.target_month).isValid()) {
            errors.target_month = 'Wybierz poprawna date'
        }
        if (values.amount == "dummy" || values.amount == "" || values.amount == null) {
            errors.amount = 'Wpisz kwote'
        }
        if (this.state.budgetid == -1 && allPeriods.includes(values.target_month) == true) {
            errors.target_month = "Budzet na wybrany miesiac juz istnieje"
        } else if (values.target_month != this.state.target_month && allPeriods.includes(values.target_month) == true) {
            errors.target_month = "Budzet na wybrany miesiac juz istnieje"
        }
        return errors
    }

    onSubmit(values) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        let budget = {
            budgetid: this.state.budgetid,
            target_month: newDateYYYYMMDD(values.target_month),
            usernameid: usernameid,
            amount: values.amount,
            comment: values.comment,
        }
        if (this.state.budgetid === -1) {
            BudgetDataService.createBudget(usernameid, budget).then(() => this.props.history.push('/budgets'))
        } else {
            BudgetDataService.updateBudget(usernameid, this.state.budgetid, budget).then(() => this.props.history.push('/budgets'))
        }
    }

    cancelButton() {
        this.props.history.push(`/budgets`)
    }

    render() {
        let { target_month, amount, comment } = this.state;
        var savings = 1750;
        var totalIncomes;
        if (this.state.target_month == "") {
            totalIncomes = 0;
        } else {
            totalIncomes = (this.state.incomes.filter(income => (
                dateFilter(income.target_date, income.finish_date, this.state.target_month, income.cycle)
            )).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ target_month, amount, comment }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="target_month" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="amount" component="div" className="alert alert-warning" />
                                    <div className="text-40px-white" style={{ display: (this.state.budgetid == -1 ? 'block' : 'none') }}>Dodaj budzet</div>
                                    <div className="text-40px-white" style={{ display: (this.state.budgetid != -1 ? 'block' : 'none') }}>Edytuj budzet</div>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Miesiac</div>
                                        <Field className="hb-form-control" id="choosenMth" type="month" name="target_month" onChange={this.changeMth} />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Kwota {"("}Suma przychodów: {totalIncomes}, sugerowany budżet: {totalIncomes - savings}{")"}</div>
                                        <Field className="hb-form-control" type="number" name="amount" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Komentarz</div>
                                        <Field className="hb-form-control" type="text" name="comment" />
                                    </fieldset>
                                    <button className="button-save" type="submit">Zapisz</button>
                                    <button className="button-back" onClick={() => this.cancelButton()}>Cofnij</button>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>)
    }
}

export default BudgetComponent