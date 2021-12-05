import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ExpenseDataService from '../../../api/to-do/ExpenseDataService.js'
import CategoryDataService from '../../../api/to-do/CategoryDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"

class ExpenseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            categories: [],
            id: this.props.match.params.id,
            description: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            finishDate: moment(new Date()).format('YYYY-MM-DD'),
            price: '',
            category: '',
            comment: '',
            cycle: '',
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.updateCycle = this.updateCycle.bind(this)
        this.refreshTest = this.refreshTest.bind(this)

    }

    componentDidMount() {

        if (this.state.id === "-1") {
            console.log(' return')
            this.refreshTest()
            return
        }
        // console.log(this.state.id + " idsss")
        // console.log(this.state.cycle + " cyclesss")

        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveExpense(username, this.state.id)
            .then(response => this.setState({
                description: response.data.description,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD'),
                finishDate: moment(response.data.finishDate).format('YYYY-MM-DD'),
                price: response.data.price,
                category: response.data.category,
                comment: response.data.comment,
                cycle: response.data.cycle,
            }))

        console.log(' componentDidMount2')

        // if (this.state.id === "-1") {//|| this.state.cycle == "Nie" || this.state.cycle == ""){
        //     console.log("-1")
        //     this.refreshTest()
        // }

        this.refreshExpenses()
        this.refreshCategories()

        // this.updateInput()
    }

    refreshTest() {
        document.getElementById("periodicity").value = "Nie";
        this.setState({ value222: "Nie", })
    }

    refreshExpenses() {
        console.log(' refreshExpenses')
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(response => { this.setState({ expenses: response.data }) })
    }
    refreshCategories() {
        console.log(' refreshCategories')
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username)
            .then(response => { this.setState({ categories: response.data }) })
    }
    // componentDidMount() {
    //     console.log(' componentDidMount')
    //     this.refreshExpenses()
    // }


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

        if (!moment(values.finishDate).isValid()) {
            errors.finishDate = 'Enter the valid date'
        }

        if (values.cycle == "dummy" || values.cycle == "" || values.cycle == null) {
            errors.description = 'Please choose periodicity'
        }

        if (values.price == "dummy" || values.price == "" || values.price == null) {
            errors.description = 'Please enter the amount'
        }

        if (values.category == "dummy" || values.category == "" || values.category == null) {
            errors.description = 'Please select the category'
        }

        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()

        let expense = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate,
            finishDate: values.finishDate,
            username: username,
            price: values.price,
            category: values.category,
            comment: values.comment,
            cycle: values.cycle,
        }
        console.log(values.description)
        console.log(values.category.value)

        if (this.state.id === -1) {
            ExpenseDataService.createExpense(username, expense).then(() => this.props.history.push('/expenses'))
        } else {
            ExpenseDataService.updateExpense(username, this.state.id, expense).then(() => this.props.history.push('/expenses'))
        }
    }

    handleChange(event) {
        console.log(event.target.value);
        console.log(event.target.name);
    }

    updateCycle(event) {
        if (event.target.value != "dummy") {
            this.setState({ value222: event.target.value });
        }
    }

    render() {
        let { description, targetDate, finishDate, price, category, comment, cycle } = this.state
        return (
            <div>
                <h1>Add expensive</h1>
                <div className="container">
                    <Formik
                        initialValues={{ description, targetDate, finishDate, price, category, comment, cycle }}
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
                                    <ErrorMessage name="finishDate" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="category" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="cycle" component="div" className="alert alert-warning" />

                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Date</label>
                                        <Field className="form-control" type="date" name="targetDate" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.value222 != 'Nie' ? 'block' : 'none') }}>
                                        <label>End Date</label>
                                        <Field className="form-control" type="date" name="finishDate" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Price</label>
                                        <Field className="form-control" type="number" name="price" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Category</label><br />
                                        <Field className="form-control" type="text" name="category" as="select">
                                            <option selected value="dummy"> -- select an option -- </option>
                                            {this.state.categories.map(category =>
                                                <option value={category.categoryname}>{category.categoryname}</option>
                                            )}
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label>Comment</label>
                                        <Field className="form-control" type="text" name="comment" />
                                    </fieldset>
                                    <fieldset className="form-group" >
                                        <label>Cyklicznosc</label>
                                        <Field id="periodicity" className="form-control" type="text" name="cycle" as="select" onClick={this.updateCycle} >
                                            <option selected value="dummy"> -- select an option -- </option>
                                            <option value="Nie">Nie</option>
                                            <option value="Every week">Every week</option>
                                            <option value="Every 2 weeks">Every 2 weeks</option>
                                            <option value="Every month">Every month</option>
                                            <option value="Every quater">Every quater</option>
                                            <option value="Every six months">Every six months</option>
                                            <option value="Every year">Every year</option>
                                        </Field>
                                    </fieldset>
                                    <div className="jc-center">
                                        <button className="button" type="submit">Save</button>
                                        <button className="button" onClick={() => this.updateExpenseClicked()}>Back</button>
                                    </div>
                                </Form>

                            )
                        }
                    </Formik>
                </div>



                {/* Total: {total} */}
                {/* <button className="btn btn-success" onClick={() => this.updateExpenseClicked()}>Back</button> */}
            </div>)
    }


    updateExpenseClicked() {
        this.props.history.push(`/expenses`)
    }

}

export default ExpenseComponent