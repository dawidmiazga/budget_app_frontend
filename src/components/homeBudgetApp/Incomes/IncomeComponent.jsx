import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import IncomeDataService from '../../../api/HomeBudget/IncomeDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"

class IncomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            incomes: [],
            id: this.props.match.params.id,
            description: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            finishDate: moment(new Date()).format('YYYY-MM-DD'),
            amount: '',
            comment: '',
            cycle: '',
            cycleValue: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.updateCycle = this.updateCycle.bind(this)
        this.getPeriodicity = this.getPeriodicity.bind(this)
    }

    componentDidMount() {
        if (this.state.id == -1) {
            this.getPeriodicity()
            return
        }
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveIncome(username, this.state.id)
            .then(response => this.setState({
                description: response.data.description,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD'),
                finishDate: moment(response.data.finishDate).format('YYYY-MM-DD'),
                amount: response.data.amount,
                comment: response.data.comment,
                cycle: response.data.cycle,
            }))
        this.refreshIncomes()
    }

    getPeriodicity() {
        document.getElementById("periodicity").value = "Nie";
        this.setState({ cycleValue: "Nie", })
    }

    refreshIncomes() {
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(username)
            .then(response => { this.setState({ incomes: response.data }) })
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
        if (values.amount == "dummy" || values.amount == "" || values.amount == null) {
            errors.amount = 'Wpisz poprawna kwote'
        }
        return errors
    }

    onSubmit(values) {
        if (values.cycle == "Nie") {
            values.finishDate = values.targetDate
        }
        let username = AuthenticationService.getLoggedInUserName()
        let income = {
            id: this.state.id,
            description: values.description,
            targetDate: values.targetDate,
            finishDate: values.finishDate,
            username: username,
            amount: values.amount,
            comment: values.comment,
            cycle: values.cycle,
        }
        if (this.state.id == -1) {
            IncomeDataService.createIncome(username, income).then(() => this.props.history.push('/incomes'))
        } else {
            IncomeDataService.updateIncome(username, this.state.id, income).then(() => this.props.history.push('/incomes'))
        }
    }

    updateCycle(event) {
        if (event.target.value != "dummy") {
            this.setState({ cycleValue: event.target.value });
        }
    }

    updateIncomeClicked() {
        this.props.history.push(`/incomes`)
    }

    render() {
        let { description, targetDate, finishDate, amount, comment, cycle } = this.state
        if (this.state.cycleValue == '') {
            this.state.cycleValue = cycle
        }
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ description, targetDate, finishDate, amount, comment, cycle }}
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
                                    <ErrorMessage name="cycle" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="amount" component="div" className="alert alert-warning" />
                                    <div className="text-40px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Dodaj przychod</div>
                                    <div className="text-40px-white" style={{ display: (this.state.id != -1 ? 'block' : 'none') }}>Edytuj przychod</div>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Opis</div>
                                        <Field className="hb-form-control" type="text" name="description" />
                                    </fieldset>
                                    <fieldset className="form-group" >
                                        <div className="text-20px-white">Cyklicznosc</div>
                                        <Field id="periodicity" className="hb-form-control" type="text" name="cycle" as="select" onClick={this.updateCycle} >
                                            <option selected value="dummy"> -- wybierz Cyklicznosc -- </option>
                                            <option value="Nie">Nie</option>
                                            <option value="Co miesiac">Co miesiac</option>
                                            {/* <option value="Co kwartal">Co kwartal</option> */}
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
                                        <div className="text-20px-white">Data zakonczenia</div>
                                        <Field className="hb-form-control" type="date" name="finishDate" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Kwota</div>
                                        <Field className="hb-form-control" type="number" name="amount" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Komentarz</div>
                                        <Field className="hb-form-control" type="text" name="comment" />
                                    </fieldset>
                                    <div className="jc-center">
                                        <button className="button-save" type="submit">Zapisz</button>
                                        <button className="button-back" onClick={() => this.updateIncomeClicked()}>Cofnij</button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>)
    }
}

export default IncomeComponent
