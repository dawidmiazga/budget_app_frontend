import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ExpenseDataService from '../../../api/HomeBudget/ExpenseDataService.js'
import CategoryDataService from '../../../api/HomeBudget/CategoryDataService.js'
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
            cycleValue: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.updateCycle = this.updateCycle.bind(this)
        this.getPeriodicity = this.getPeriodicity.bind(this)
    }

    componentDidMount() {
        if (this.state.id == -1) {
            this.getPeriodicity()
            this.refreshCategories()
            return
        }
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

        this.refreshExpenses()
        this.refreshCategories()
    }

    getPeriodicity() {
        document.getElementById("periodicity").value = "Nie";
        this.setState({ cycleValue: "Nie", })
    }

    refreshExpenses() {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(response => { this.setState({ expenses: response.data }) })

    }

    refreshCategories() {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username)
            .then(response => { this.setState({ categories: response.data }) })
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = "Wpisz nazwe"
        }
        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Podaj prawidlowa date'
        }
        if (!moment(values.finishDate).isValid()) {
            errors.finishDate = 'Podaj prawidlowa date'
        }
        if (values.cycle == "dummy" || values.cycle == "" || values.cycle == null) {
            errors.cycle = 'Wybierz cyklicznosc'
        }
        if (values.price == "dummy" || values.price == "" || values.price == null) {
            errors.price = 'Wpisz poprawna kwote'
        }
        if (values.category == "dummy" || values.category == "" || values.category == null) {
            errors.category = 'Wybierz kategorie'
        }
        return errors
    }

    onSubmit(values) {
        if (values.cycle == "Nie") {
            values.finishDate = values.targetDate
        }

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
        if (this.state.id == -1) {
            ExpenseDataService.createExpense(username, expense).then(() => this.props.history.push('/expenses'))
        } else {
            ExpenseDataService.updateExpense(username, this.state.id, expense).then(() => this.props.history.push('/expenses'))
        }
    }

    updateCycle(event) {
        if (event.target.value != "dummy") {
            this.setState({ cycleValue: event.target.value });
        }
    }

    cancelButton() {
        this.props.history.push(`/expenses`)
    }

    render() {
        let { description, targetDate, finishDate, price, category, comment, cycle } = this.state
        if (this.state.cycleValue == '') {
            this.state.cycleValue = cycle
        }
        return (
            <div className="background-color-all">
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
                                    <ErrorMessage name="price" component="div" className="alert alert-warning" />
                                    <div className="text-40px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Dodaj wydatek</div>
                                    <div className="text-40px-white" style={{ display: (this.state.id != -1 ? 'block' : 'none') }}>Edytuj wydatek</div>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Opis</div>
                                        <Field className="hb-form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group" >
                                        <div className="text-20px-white">Cyklicznosc</div>
                                        <Field id="periodicity" className="hb-form-control" type="text" name="cycle" as="select" onClick={this.updateCycle} >
                                            <option selected value="dummy"> -- wybierz cyklicznosc -- </option>
                                            <option value="Nie">Nie</option>
                                            <option value="Co miesiac">Co miesiac</option>
                                            <option value="Co pol roku">Co pol roku</option>
                                            <option value="Co rok">Co rok</option>
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white" style={{ display: (this.state.cycleValue != 'Nie' ? 'block' : 'none') }}>Data poczatkowa</div>
                                        <div className="text-20px-white" style={{ display: (this.state.cycleValue == 'Nie' ? 'block' : 'none') }}>Data transakcji</div>
                                        <Field className="hb-form-control" type="date" name="targetDate" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.cycleValue != 'Nie' ? 'block' : 'none') }}>
                                        <div className="text-20px-white">Data koncowa</div>
                                        <Field className="hb-form-control" type="date" name="finishDate" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Kwota</div>
                                        <Field className="hb-form-control" type="number" name="price" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Kategoria</div><br />
                                        <Field className="hb-form-control" type="text" name="category" as="select">
                                            <option selected value="dummy"> -- wybierz kategorie -- </option>
                                            {this.state.categories.map(category =>
                                                <option value={category.categoryname}>{category.categoryname}</option>
                                            )}
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Komentarz</div>
                                        <Field className="hb-form-control" type="text" name="comment" />
                                    </fieldset>
                                    <div className="jc-center">
                                        <button className="button-save" type="submit">Zapisz</button>
                                        <button className="button-back" onClick={() => this.cancelButton()}>Cofnij</button>
                                    </div>
                                </Form>

                            )
                        }
                    </Formik>
                </div>
            </div>
        )

    }
}

export default ExpenseComponent