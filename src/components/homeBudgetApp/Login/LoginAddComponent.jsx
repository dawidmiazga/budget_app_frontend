import React, { Component } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import LoginDataService from '../../../api/HomeBudget/LoginDataService.js'

class LoginAddComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            users: [],
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    refreshUsers() {
        if (this.state.id == -1) {
            LoginDataService.retrieveAllLogins()
                .then(
                    response => {
                        this.setState({ users: response.data })
                    }
                )
        } else {
            LoginDataService.retrieveLogin(this.state.id)
                .then(response => this.setState({
                    login: response.data.login,
                    password: response.data.password,
                }))
        }
    }

    componentDidMount() {
        this.refreshUsers()
    }

    validate(values) {
        let errors = {}
        const arrUsers = ([(this.state.users.map(user => user.login))]);
        if (this.state.id == -1) {
            if (!values.login) {
                errors.login = "Wpisz login"
            }
            if (arrUsers[0].includes(values.login)) {
                errors.login = "Podany login jest juz zajety. Prosimy wybrac inny"
            }
            if (!values.password) {
                errors.password = "Wpisz haslo"
            }
        } else {
            if (!values.password) {
                errors.password = "Wpisz stare haslo"
            }
            if (!values.newpassword) {
                errors.password = "Wpisz nowe haslo"
            }
            if (!values.newpassword2) {
                errors.password = "Powtorz nowe haslo"
            }
            if (values.newpassword != values.newpassword2) {
                errors.password = "Zle powtorzone haslo"
            }
            if (this.state.password != values.password) {
                errors.password = "Zle stare haslo"
            }
        }
        return errors
    }

    onSubmit(values) {
        if (this.state.id == -1) {
            var userslist = {
                id: this.state.id,
                login: values.login,
                password: values.password,
            }
        } else {
            var userslist = {
                id: this.state.id,
                login: this.state.login,
                password: values.newpassword,
            }
        }
        if (this.state.id == -1) {
            LoginDataService.createLogin(userslist).then(() => this.props.history.push('/login'))
        }
        else {
            LoginDataService.updateLogin(this.state.id, userslist).then(() => this.props.history.push('/settings'))
        }
    }

    cancelButton() {
        if (this.state.id == -1) {
            this.props.history.push(`/login`)
        } else {
            this.props.history.push(`/settings`)
        }
    }

    render() {
        var login = ""
        var password = ""
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ login, password }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="login" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="password" component="div" className="alert alert-warning" />
                                    <fieldset className="form-group">
                                        <div className="text-30px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Dodawanie konta</div>
                                        <div className="text-30px-white" style={{ display: (this.state.id == -1 ? 'none' : 'block') }}>Zmiana hasla</div>
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>
                                        <div className="text-20px-white">Login:</div>
                                        <Field className="hb-form-control" type="text" name="login" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Haslo:</div>
                                        <div className="text-20px-white" style={{ display: (this.state.id == -1 ? 'none' : 'block') }}>Wpisz stare haslo:</div>
                                        <Field className="hb-form-control" type="password" name="password" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.id == -1 ? 'none' : 'block') }}>
                                        <div className="text-20px-white">Nowe haslo:</div>
                                        <Field className="hb-form-control" type="password" name="newpassword" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.id == -1 ? 'none' : 'block') }}>
                                        <div className="text-20px-white">Powtorz nowe haslo:</div>
                                        <Field className="hb-form-control" type="password" name="newpassword2" />
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

export default LoginAddComponent