import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import IncomeDataService from '../../../api/to-do/IncomeDataService.js'
import AuthenticationService from '../AuthenticationService.js';

class IncomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            description: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            amount: '',
            comment: '',
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidMount() {

        if (this.state.id === -1) {
            return
        }

        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveIncome(username, this.state.id)
            .then(response => this.setState({
                description: response.data.description,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD'),
                amount: response.data.amount,
                comment: response.data.comment,
            }))
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = "Enter a description"
        } else if (values.description.length < 2) {
            errors.description = "Za malo liter"
        }

        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Enter the valid date'
        }

        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()

        let income = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate,
            username: username,
            amount: values.amount,
            comment: values.comment,
        }

        if (this.state.id === -1) {
            IncomeDataService.createIncome(username, income).then(() => this.props.history.push('/incomes'))
        } else {
            IncomeDataService.updateIncome(username, this.state.id, income).then(() => this.props.history.push('/incomes'))
        }
    }
    render() {
        let { description, targetDate, amount, comment } = this.state
        return (
            <div>
                <h1>Add expensive</h1>
                <div className="container">
                    <Formik
                        initialValues={{ description, targetDate, amount, comment }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>

                                    <ErrorMessage name="description" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="targetDate" component="div" className="alert alert-warning" />
                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Date</label>
                                        <Field className="form-control" type="date" name="targetDate" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Amount</label>
                                        <Field className="form-control" type="number" name="amount" />
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <label>Comment</label>
                                        <Field className="form-control" type="text" name="comment" />
                                    </fieldset>

                                    <div className="jc-center">
                                        <button className="button" type="submit">Save</button>
                                        <button className="button" onClick={() => this.updateIncomeClicked()}>Back</button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>

                {/* <button className="btn btn-success" onClick={() => this.updateIncomeClicked()}>Back</button> */}
            </div>)
    }


    updateIncomeClicked() {
        this.props.history.push(`/incomes`)
    }

}

export default IncomeComponent