import React, { Component } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import LoginDataService from '../../../api/HomeBudget/LoginDataService.js'

class LoginAddComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            usernameid: this.props.match.params.id,
            users: [],
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    refreshUsers() {
        if (this.state.usernameid == -1) {
            LoginDataService.retrieveAllLogins()
                .then(
                    response => {
                        this.setState({ users: response.data })
                    }
                )
        } else {
            LoginDataService.retrieveLogin(this.state.usernameid)
                .then(response => this.setState({
                    username: response.data.username,
                    password: response.data.password,
                }))
        }
    }

    componentDidMount() {
        this.refreshUsers()
    }

    validate(values) {
        let errors = {}
        const arrUsers = ([(this.state.users.map(user => user.username))]);
        if (this.state.usernameid == -1) {
            if (!values.username) {
                errors.username = "Wpisz login"
            }
            if (arrUsers[0].includes(values.username)) {
                errors.username = "Podany login jest juz zajety. Prosimy wybrac inny"
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
        if (this.state.usernameid == -1) {
            var userslist = {
                usernameid: this.state.usernameid,
                username: values.username,
                password: values.password,
            }
        } else {
            var userslist = {
                usernameid: this.state.usernameid,
                username: this.state.username,
                password: values.newpassword,
            }
        }
        if (this.state.usernameid == -1) {
            LoginDataService.createLogin(userslist).then(() => this.props.history.push('/login'))
        }
        else {
            LoginDataService.updateLogin(this.state.usernameid, userslist).then(() => this.props.history.push('/settings'))
        }
    }

    cancelButton() {
        if (this.state.usernameid == -1) {
            this.props.history.push(`/login`)
        } else {
            this.props.history.push(`/settings`)
        }
    }

    render() {
        var username = ""
        var password = ""
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ username, password }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="username" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="password" component="div" className="alert alert-warning" />
                                    <fieldset className="form-group">
                                        <div className="text-h3-white" style={{ display: (this.state.usernameid == -1 ? 'block' : 'none') }}>Dodawanie konta</div>
                                        <div className="text-h3-white" style={{ display: (this.state.usernameid == -1 ? 'none' : 'block') }}>Zmiana hasla</div>
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.usernameid == -1 ? 'block' : 'none') }}>
                                        <div className="text-h5-white">Login:</div>
                                        <Field className="hb-form-control" type="text" name="username" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-h5-white" style={{ display: (this.state.usernameid == -1 ? 'block' : 'none') }}>Haslo:</div>
                                        <div className="text-h5-white" style={{ display: (this.state.usernameid == -1 ? 'none' : 'block') }}>Wpisz stare haslo:</div>
                                        <Field className="hb-form-control" type="password" name="password" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.usernameid == -1 ? 'none' : 'block') }}>
                                        <div className="text-h5-white">Nowe haslo:</div>
                                        <Field className="hb-form-control" type="password" name="newpassword" />
                                    </fieldset>
                                    <fieldset className="form-group" style={{ display: (this.state.usernameid == -1 ? 'none' : 'block') }}>
                                        <div className="text-h5-white">Powtorz nowe haslo:</div>
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