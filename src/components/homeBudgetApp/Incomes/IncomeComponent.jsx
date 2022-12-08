import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import IncomeDataService from '../../../api/HomeBudget/IncomeDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import {
    getLastDayOfDate, getFirstDayOfDate, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, arrMthEng, arrMthPol, formatter
} from '../../homeBudgetApp/CommonFunctions.js'

class IncomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            incomes: [],
            incomeid: this.props.match.params.id,
            incomeid2: this.props.match.params.id2,
            description: '',
            target_date: newDateYYYYMMDD(new Date()),
            finish_date: newDateYYYYMMDD(new Date()),
            amount: '',
            comment: '',
            cycle: '',
            cycleValue: '',
        };

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.updateCycle = this.updateCycle.bind(this)
        this.getPeriodicity = this.getPeriodicity.bind(this)
    };

    componentDidMount() {
        if (this.state.incomeid2 == null) {
            console.log("null")
        }

        if (this.state.incomeid == -1 && this.state.incomeid2 == null) {
            this.getPeriodicity()
            return
        }

        this.refreshIncomes()

        let usernameid = AuthenticationService.getLoggedInUserName()
        if (this.state.incomeid == -1) {
            IncomeDataService.retrieveIncome(usernameid, this.state.incomeid2)
                .then(response => this.setState({
                    description: response.data.description,
                    target_date: newDateYYYYMMDD(response.data.target_date),
                    finish_date: newDateYYYYMMDD(response.data.finish_date),
                    amount: response.data.amount,
                    comment: response.data.comment,
                    cycle: response.data.cycle,
                }))
        } else {
            IncomeDataService.retrieveIncome(usernameid, this.state.incomeid)
                .then(response => this.setState({
                    description: response.data.description,
                    target_date: newDateYYYYMMDD(response.data.target_date),
                    finish_date: newDateYYYYMMDD(response.data.finish_date),
                    amount: response.data.amount,
                    comment: response.data.comment,
                    cycle: response.data.cycle,
                }))
        }
    };

    getPeriodicity() {
        document.getElementById("periodicity").value = "Nie";
        this.setState({ cycleValue: "Nie", })
    };

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(response => { this.setState({ incomes: response.data }) })

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
        if (values.amount == "dummy" || values.amount == "" || values.amount == null) {
            errors.amount = 'Wpisz poprawna kwote'
        }
        return errors
    };

    onSubmit(values) {
        if (values.cycle == "Nie") {
            values.finish_date = values.target_date
        }

        let usernameid = AuthenticationService.getLoggedInUserName()
        let income = {
            incomeid: this.state.incomeid,
            description: values.description,
            target_date: values.target_date,
            finish_date: values.finish_date,
            usernameid: usernameid,
            amount: values.amount,
            comment: values.comment,
            cycle: values.cycle,
        }
        if (this.state.incomeid == -1) {
            IncomeDataService.createIncome(usernameid, income).then(() => this.props.history.push('/incomes'))
        } else {
            IncomeDataService.updateIncome(usernameid, this.state.incomeid, income).then(() => this.props.history.push('/incomes'))
        }
    };

    updateCycle(event) {
        if (event.target.value != "dummy") {
            this.setState({ cycleValue: event.target.value });
        }
    };

    cancelButton() {
        this.props.history.push(`/incomes`)
    };

    render() {

        let { description, target_date, finish_date, amount, comment, cycle } = this.state

        if (this.state.cycleValue == '') {
            this.state.cycleValue = cycle
        }
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ description, target_date, finish_date, amount, comment, cycle }}
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
                                    <ErrorMessage name="cycle" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="amount" component="div" className="alert alert-warning" />
                                    <div className="text-h1-white" style={{ display: (this.state.incomeid == -1 ? 'block' : 'none') }}>Dodaj wydatek</div>
                                    <div className="text-h1-white" style={{ display: (this.state.incomeid != -1 ? 'block' : 'none') }}>Edytuj wydatek</div>
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
                                        <Field className="hb-form-control" type="number" name="amount" />
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

export default IncomeComponent