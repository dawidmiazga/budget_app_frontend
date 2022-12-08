import React, { Component } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik"
import BankAccountDataService from "../../../api/HomeBudget/BankAccountDataService.js"
import AuthenticationService from "../AuthenticationService.js";
import reactCSS from "reactcss"

class BankAccountComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankaccounts: [],
            bankaccountid: this.props.match.params.id,
            bankaccountname: "",
            bankaccountNameMain: "",
            divide: ""
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshBankAccounts = this.refreshBankAccounts.bind(this)
    }

    refreshBankAccounts() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BankAccountDataService.retrieveAllBankAccounts(usernameid)
            .then(
                response => {
                    this.setState({ bankaccounts: response.data })
                }
            )
    }

    componentDidMount() {
        if (this.state.bankaccountid == -1) {
            this.refreshBankAccounts()
            return
        }

        let usernameid = AuthenticationService.getLoggedInUserName()
        BankAccountDataService.retrieveBankAccount(usernameid, this.state.bankaccountid)
            .then(response => this.setState({
                bankaccountname: response.data.bankaccountname,
                divide: response.data.divide
            }))
        this.refreshBankAccounts()
    }

    validate(values) {
        const allBankAccounts = this.state.bankaccounts.map(bankaccount => bankaccount.bankaccountname);
        let errors = {}
        if (!values.bankaccountname) {
            errors.bankaccountname = "Wpisz nazwe"
        }
        if (this.state.bankaccountid == -1 && allBankAccounts.includes(values.bankaccountname) == true) {
            errors.bankaccountname = "Takie konto juz istnieje"
        } else if (values.bankaccountname != this.state.bankaccountname && allBankAccounts.includes(values.bankaccountname) == true) {
            errors.bankaccountname = "Takie konto juz istnieje"
        }
        return errors
    }

    onSubmit(values) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        let bankaccount = {
            bankaccountid: this.state.bankaccountid,
            bankaccountname: values.bankaccountname,
            usernameid: usernameid,
            divide: values.divide
        }
        if (this.state.bankaccountid == -1) {
            BankAccountDataService.createBankAccount(usernameid, bankaccount).then(() => this.props.history.push("/bankaccounts"))
        } else {
            BankAccountDataService.updateBankAccount(usernameid, this.state.bankaccountid, bankaccount).then(() => this.props.history.push("/bankaccounts"))
        }
    }

    cancelButton() {
        this.props.history.push(`/bankaccounts`)
    }

    render() {

        let { bankaccountname, divide } = this.state
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ bankaccountname, divide }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="bankaccountname" component="div" className="alert alert-warning" />
                                    <div className="text-h1-white" style={{ display: (this.state.bankaccountid == -1 ? "block" : "none") }}>Dodaj konto bankowe</div>
                                    <div className="text-h1-white" style={{ display: (this.state.bankaccountid != -1 ? "block" : "none") }}>Edytuj konto bankowe</div>

                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Nazwa</div>
                                        <Field className="hb-form-control" type="text" name="bankaccountname" id="bankaccountnameid" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white">Ilość osob na które podzielone jest konto</div>
                                        <Field className="hb-form-control" type="number" name="divide" id="bankaccountnameid" />
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
            </div>)
    }
}

export default BankAccountComponent