import moment from "moment";
import React, { Component } from "react";
import BudgetDataService from '../../../api/HomeBudget/BudgetDataService.js';
import LoginDataService from '../../../api/HomeBudget/LoginDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import btnClear from '../../images/clear_button.png';
import btnSort from '../../images/sort_button.png';
import btnCopy from '../../images/copy_button.png';

class ListBudgetsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            budgets: [],
            users: [],
            message: null,
            sortAsc: 1
        }

        this.deleteBudgetClicked = this.deleteBudgetClicked.bind(this)
        this.updateBudgetClicked = this.updateBudgetClicked.bind(this)
        this.copyBudgetClicked = this.copyBudgetClicked.bind(this)
        this.addBudgetClicked = this.addBudgetClicked.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
        this.changeStartDateCal = this.changeStartDateCal.bind(this);
        this.changeEndDateCal = this.changeEndDateCal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.clearDates = this.clearDates.bind(this);
        this.sortByMonth = this.sortByMonth.bind(this);
        this.sortByAmount = this.sortByAmount.bind(this);
        this.refreshLogins = this.refreshLogins.bind(this);
    }

    componentDidMount() {
        this.refreshBudgets()
        this.refreshLogins()
    }

    refreshLogins() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        LoginDataService.retrieveAllLogins(usernameid)
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    }

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_month < b.target_month) ? 1 : -1)
                    this.setState({ budgets: response.data })
                }
            )
    }

    // sortTable(sortType) {
    //     this.state.sortAsc = this.state.sortAsc * -1;
    //     let usernameid = AuthenticationService.getLoggedInUserName()
    //     BudgetDataService.retrieveAllBudgets(usernameid)
    //         .then(
    //             response => {
    //                 if (this.state.sortAsc == 1) {
    //                     if (sortType == "Month") {
    //                         response.data.sort((a, b) => (a.target_month < b.target_month) ? 1 : -1)
    //                     } else if (sortType == "Amount") {
    //                         response.data.sort((a, b) => (a.amount < b.amount) ? 1 : -1)
    //                     }
    //                 } else {
    //                     if (sortType == "Month") {
    //                         response.data.sort((a, b) => (a.target_month > b.target_month) ? 1 : -1)
    //                     } else if (sortType == "Amount") {
    //                         response.data.sort((a, b) => (a.amount > b.amount) ? 1 : -1)
    //                     }
    //                 }
    //                 this.setState({ budgets: response.data })
    //             }
    //         )
    // }

    sortByMonth() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.target_month < b.target_month) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.target_month > b.target_month) ? 1 : -1)
                    }
                    this.setState({ budgets: response.data })
                }
            )
    }

    sortByAmount() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.amount < b.amount) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.amount > b.amount) ? 1 : -1)
                    }
                    this.setState({ budgets: response.data })
                }
            )
    }

    deleteBudgetClicked(budgetid) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.deleteBudget(usernameid, budgetid)
            .then(
                response => {
                    this.setState({ message: `Budget usuniety` })
                    this.refreshBudgets()
                }
            )
    }

    updateBudgetClicked(budgetid) {
        this.props.history.push(`/budgets/${budgetid}`)
    }

    copyBudgetClicked(budgetid) {
        this.props.history.push(`/budgets/${budgetid}/-1`)
    }

    addBudgetClicked() {
        this.props.history.push(`/budgets/-1`)
    }

    changeStartDateCal() {
        const datatest = document.getElementById('startDateIdField').value
        this.setState({ startDate: datatest, })
    }
    changeEndDateCal() {
        const datatest = document.getElementById('endDateIdField').value
        this.setState({ endDate: datatest, })
    }
    clearDates() {
        this.setState({ startDate: "", })
        this.setState({ endDate: "", })
        document.getElementById('startDateIdField').value = ""
        document.getElementById('endDateIdField').value = ""
    }
    onFormSubmit(e) {
        e.preventDefault();
    }

    render() {
        function changeDateFormatWithoutDays(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM");
            return datePrased;
        }

        if (this.state.startDate == "") {
            this.state.startDate = new Date("1111-12-31")
        }
        if (this.state.endDate == "") {
            this.state.endDate = new Date("9999-12-31")
        }

        let totalBudget;
        totalBudget = (this.state.budgets.filter(budget =>
            changeDateFormatWithoutDays(budget.target_month) >= changeDateFormatWithoutDays(this.state.startDate) &&
            changeDateFormatWithoutDays(budget.target_month) <= changeDateFormatWithoutDays(this.state.endDate))

            .reduce((total, currentItem) => total = total + currentItem.amount, 0));

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container-middle">
                    <div className="text-40px-white">
                        Moje budżety
                    </div>

                    <div className="text-20px-white">
                        Wybierz zakres dat:
                    </div>

                    <input type="month" id="startDateIdField" onChange={this.changeStartDateCal}></input>
                    <input type="month" id="endDateIdField" onChange={this.changeEndDateCal}></input>

                    <div className="inline-button-clear">
                        <img src={btnClear} width="30" height="30" onClick={this.clearDates} />
                    </div>
                </div>

                <form onSubmit={this.onFormSubmit}></form>

                <div className="container-categories">
                    <div className="text-25px-white">
                        Suma w wybranym okresie: {formatter.format(totalBudget)}
                    </div>
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th >
                                    Data transakcji
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByMonth} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByAmount} /></div>
                                </th>
                                <th>Komentarz</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.budgets.filter(budget =>
                                (changeDateFormatWithoutDays(budget.target_month) >= changeDateFormatWithoutDays(this.state.startDate) &&
                                    changeDateFormatWithoutDays(budget.target_month) <= changeDateFormatWithoutDays(this.state.endDate))
                                ).map(
                                    budget =>

                                        <tr key={budget.budgetid}>
                                            <td>
                                                <div className="text-20px-white">
                                                    {changeDateFormatWithoutDays(budget.target_month)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-20px-white">
                                                    {formatter.format(budget.amount)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-20px-white">
                                                    {budget.comment}
                                                </div>
                                            </td>
                                            <td>
                                                <img src={btnCopy} width="40" height="40" onClick={() => this.copyBudgetClicked(budget.budgetid)} />
                                                <img src={btnEdit} width="40" height="40" onClick={() => this.updateBudgetClicked(budget.budgetid)} />
                                                <img src={btnDel} width="40" height="40" onClick={() => this.deleteBudgetClicked(budget.budgetid)} />
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                    <button className="button-66" onClick={this.addBudgetClicked}>Dodaj nowy budzet</button>
                </div>
            </div >
        )
    }
}

export default ListBudgetsComponent