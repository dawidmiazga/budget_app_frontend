import React, { Component } from "react";
import AuthenticationService from "../AuthenticationService.js";
import LoginDataService from '../../../api/HomeBudget/LoginDataService.js';
import btnEdit from '../../images/edit_button.png';

class ListSettingsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            usernameid: this.props.match.params.id,
            username: '',
            password: '',
            displayColorPicker: false,
            categoryNameMain: '',
        }
    }

    componentDidMount() {
        LoginDataService.retrieveAllLogins()
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    }

    updateLoginClicked(usernameid) {
        this.props.history.push(`/changepassword/${usernameid}`)
    }

    render() {
        var currentuser = AuthenticationService.getLoggedInUserName()
        return (
            <div className="background-color-all">
                <div className="text-h1-white">
                    Ustawienia
                </div>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container-bud-cat">
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.filter(user => user.usernameid == currentuser).map(
                                    user =>
                                        <tr key={user.usernameid}>
                                            <td>
                                                Edytuj haslo
                                            </td>
                                            <td>
                                                <img src={btnEdit} width="32" height="32" onClick={() => this.updateLoginClicked(user.usernameid)} />
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        )
    }
}
export default ListSettingsComponent