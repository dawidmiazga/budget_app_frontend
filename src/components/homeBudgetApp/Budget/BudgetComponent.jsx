import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import BudgetDataService from '../../../api/HomeBudget/BudgetDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"

class BudgetComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            budgets: [],
            id: this.props.match.params.id,
            targetMonth: moment(new Date()).format('YYYY-MM'),
            amount: '',
            comment: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.cancelButton = this.cancelButton.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
    }

    componentDidMount() {
        if (this.state.id == -1) {
            this.refreshBudgets()
            return
        }
        let username = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveBudget(username, this.state.id)
            .then(response => this.setState({
                targetMonth: moment(response.data.targetMonth).format('YYYY-MM'),
                amount: response.data.amount,
                comment: response.data.comment,
            }))
        this.refreshBudgets()
    }

    refreshBudgets() {
        let username = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(username)
            .then(response => {
                this.setState({ budgets: response.data })
            })
    }

    validate(values) {
        const allPeriods = this.state.budgets.map(budget => moment(budget.targetMonth).format("YYYY-MM"));
        let errors = {}
        if (!moment(values.targetMonth).isValid()) {
            errors.targetMonth = 'Wybierz poprawna date'
        }
        if (values.amount == "dummy" || values.amount == "" || values.amount == null) {
            errors.amount = 'Wpisz kwote'
        }
        if (this.state.id == -1 && allPeriods.includes(values.targetMonth) == true) {
            errors.targetMonth = "Budzet na wybrany miesiac juz istnieje"
        } else if (values.targetMonth != this.state.targetMonth && allPeriods.includes(values.targetMonth) == true) {
            errors.targetMonth = "Budzet na wybrany miesiac juz istnieje"
        }
        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()
        let budget = {
            id: this.state.id,
            targetMonth: moment(values.targetMonth).format("YYYY-MM-DD"),
            username: username,
            amount: values.amount,
            comment: values.comment,
        }
        if (this.state.id === -1) {
            BudgetDataService.createBudget(username, budget).then(() => this.props.history.push('/budgets'))
        } else {
            BudgetDataService.updateBudget(username, this.state.id, budget).then(() => this.props.history.push('/budgets'))
        }
    }

    cancelButton() {
        this.props.history.push(`/budgets`)
    }

    render() {
        let { targetMonth, amount, comment } = this.state
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ targetMonth, amount, comment }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="targetMonth" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="amount" component="div" className="alert alert-warning" />
                                    <div className="text-40px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Dodaj budzet</div>
                                    <div className="text-40px-white" style={{ display: (this.state.id != -1 ? 'block' : 'none') }}>Edytuj budzet</div>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Miesiac</div>
                                        <Field className="hb-form-control" type="month" name="targetMonth" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Kwota</div>
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