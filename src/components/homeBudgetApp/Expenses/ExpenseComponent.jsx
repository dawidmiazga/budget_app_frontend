import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ExpenseDataService from '../../../api/HomeBudget/ExpenseDataService.js'
import CategoryDataService from '../../../api/HomeBudget/CategoryDataService.js'
import BankAccountDataService from '../../../api/HomeBudget/BankAccountDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import {
    getLastDayOfDate, getFirstDayOfDate, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, arrMthEng, arrMthPol, formatter, categoryMap
} from '../../homeBudgetApp/CommonFunctions.js'

class ExpenseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            categories: [],
            bankaccounts: [],
            expenseid: this.props.match.params.id,
            expenseid2: this.props.match.params.id2,
            description: '',
            target_date: newDateYYYYMMDD(new Date()),
            finish_date: newDateYYYYMMDD(new Date()),
            price: '',
            category: '',
            comment: '',
            cycle: '',
            bankaccountname: '',
            cycleValue: '',
        };

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.refreshBankAccounts = this.refreshBankAccounts.bind(this)
        this.updateCycle = this.updateCycle.bind(this)
        this.getPeriodicity = this.getPeriodicity.bind(this)
    };

    componentDidMount() {
        if (this.state.expenseid2 == null) {
            console.log("null")
        }

        this.refreshCategories()
        this.refreshBankAccounts()

        if (this.state.expenseid == -1 && this.state.expenseid2 == null) {
            this.getPeriodicity()
            // this.refreshCategories()
            // this.refreshBankAccounts()
            return
        }

        this.refreshExpenses()
        // this.refreshCategories()
        // this.refreshBankAccounts()

        let usernameid = AuthenticationService.getLoggedInUserName()
        if (this.state.expenseid == -1) {
            ExpenseDataService.retrieveExpense(usernameid, this.state.expenseid2)
                .then(response => this.setState({
                    description: response.data.description,
                    target_date: newDateYYYYMMDD(response.data.target_date),
                    finish_date: newDateYYYYMMDD(response.data.finish_date),
                    price: response.data.price,
                    category: response.data.category,//categoryMap(response.data.category, this.state.categories),
                    comment: response.data.comment,
                    cycle: response.data.cycle,
                    bankaccountname: response.data.bankaccountname,
                }))
        } else {
            ExpenseDataService.retrieveExpense(usernameid, this.state.expenseid)
                .then(response => this.setState({
                    description: response.data.description,
                    target_date: newDateYYYYMMDD(response.data.target_date),
                    finish_date: newDateYYYYMMDD(response.data.finish_date),
                    price: response.data.price,
                    category: response.data.category,//categoryMap(response.data.category, this.state.categories),
                    comment: response.data.comment,
                    cycle: response.data.cycle,
                    bankaccountname: response.data.bankaccountname,
                }))
        }
    };

    getPeriodicity() {
        document.getElementById("periodicity").value = "Nie";
        this.setState({ cycleValue: "Nie", })
    };

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(response => { this.setState({ expenses: response.data }) })

    };

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid)
            .then(response => { this.setState({ categories: response.data }) })
    };

    refreshBankAccounts() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BankAccountDataService.retrieveAllBankAccounts(usernameid)
            .then(response => { this.setState({ bankaccounts: response.data }) })
    };

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = "Wpisz nazwe"
        }
        if (!moment(values.target_date).isValid()) {
            errors.target_date = 'Podaj prawidlowa date'
        }
        if (!moment(values.finish_date).isValid()) {
            errors.finish_date = 'Podaj prawidlowa date'
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
    };

    onSubmit(values) {
        console.log(values.bankaccountname)
        var divide = this.state.bankaccounts.filter
            (bankaccount => bankaccount.bankaccountname == values.bankaccountname)
            .map(bankaccount => bankaccount.divide)
        console.log(divide[0])
        function categoryMap(name, categoryList) {
            const arrCat = ([(categoryList.map(category => category.categoryname)), (categoryList.map(category => category.categoryid))]);
            if (arrCat[0].includes(name)) {
                var idCurrentCat = arrCat[1][arrCat[0].indexOf(name)]
                return idCurrentCat;
            } else {
                return "N/A";
            }
        }

        if (values.cycle == "Nie") {
            values.finish_date = values.target_date
        }

        let usernameid = AuthenticationService.getLoggedInUserName()
        let expense = {
            expenseid: this.state.expenseid,
            description: values.description,
            target_date: values.target_date,
            finish_date: values.finish_date,
            usernameid: usernameid,
            price: values.price / divide,
            category: categoryMap(values.category, this.state.categories),
            comment: values.comment,
            cycle: values.cycle,
            bankaccountname: values.bankaccountname,
        }
        if (this.state.expenseid == -1) {
            ExpenseDataService.createExpense(usernameid, expense).then(() => this.props.history.push('/expenses'))
        } else {
            ExpenseDataService.updateExpense(usernameid, this.state.expenseid, expense).then(() => this.props.history.push('/expenses'))
        }
    };

    updateCycle(event) {
        if (event.target.value != "dummy") {
            this.setState({ cycleValue: event.target.value });
        }
    };

    cancelButton() {
        this.props.history.push(`/expenses`)
    };

    render() {

        let { description, target_date, finish_date, price, comment, cycle, bankaccountname } = this.state
        let category = categoryMap(this.state.category, this.state.categories)

        if (this.state.cycleValue == '') {
            this.state.cycleValue = cycle
        }
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ description, target_date, finish_date, price, category, comment, cycle, bankaccountname }}
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
                                    <ErrorMessage name="target_date" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="finish_date" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="category" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="cycle" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="price" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="bankaccount" component="div" className="alert alert-warning" />
                                    <div className="text-h1-white" style={{ display: (this.state.expenseid == -1 ? 'block' : 'none') }}>Dodaj wydatek</div>
                                    <div className="text-h1-white" style={{ display: (this.state.expenseid != -1 ? 'block' : 'none') }}>Edytuj wydatek</div>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Opis</div>
                                        <Field className="hb-form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group" >
                                        <div className="text-h5-white">Cyklicznosc</div>
                                        <Field id="periodicity" className="hb-form-control" type="text" name="cycle" as="select" onClick={this.updateCycle} >
                                            <option selected value="dummy"> -- wybierz cyklicznosc -- </option>
                                            <option value="Nie">Nie</option>
                                            <option value="Co miesiac">Co miesiac</option>
                                            <option value="Co pol roku">Co pol roku</option>
                                            <option value="Co rok">Co rok</option>
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white" style={{ display: (this.state.cycleValue != 'Nie' ? 'block' : 'none') }}>Data poczatkowa</div>
                                        <div className="text-h5-white" style={{ display: (this.state.cycleValue == 'Nie' ? 'block' : 'none') }}>Data transakcji</div>
                                        <Field className="hb-form-control" type="date" name="target_date" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.cycleValue != 'Nie' ? 'block' : 'none') }}>
                                        <div className="text-h5-white">Data koncowa</div>
                                        <Field className="hb-form-control" type="date" name="finish_date" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Kwota</div>
                                        <Field className="hb-form-control" type="number" name="price" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Kategoria</div>
                                        <Field className="hb-form-control" type="text" name="category" as="select">
                                            <option selected value="dummy"> -- wybierz kategorie -- </option>
                                            {this.state.categories.map(category =>
                                                <option value={category.categoryname}>{category.categoryname}</option>
                                            )}
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Konto</div>
                                        <Field className="hb-form-control" type="text" name="bankaccountname" as="select">
                                            <option selected value="dummy"> -- wybierz kategorie -- </option>
                                            {this.state.bankaccounts.map(bankaccount =>
                                                <option value={bankaccount.bankaccountname}>{bankaccount.bankaccountname}</option>
                                            )}
                                        </Field>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Komentarz</div>
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