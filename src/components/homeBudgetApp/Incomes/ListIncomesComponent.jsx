import React, { Component } from "react";
import IncomeDataService from '../../../api/HomeBudget/IncomeDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import btnClear from '../../images/clear_button.png';
import btnSort from '../../images/sort_button.png';
import btnCopy from '../../images/copy_button.png';
import {
    cycleCount, newDateYYYYMMDD, newDateDDMMYYYY, formatter, categoryMap
} from '../../homeBudgetApp/CommonFunctions.js'

class ListIncomesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            incomes: [],
            message: null,
            sortAsc: 1,
            categories: [],
            incomeCatch: []
        };

        this.deleteIncomeClicked = this.deleteIncomeClicked.bind(this);
        this.updateIncomeClicked = this.updateIncomeClicked.bind(this);
        this.addIncomeClicked = this.addIncomeClicked.bind(this);
        this.copyIncomeClicked = this.copyIncomeClicked.bind(this);
        this.getBackDeletedRecored = this.getBackDeletedRecored.bind(this);
        this.refreshIncomes = this.refreshIncomes.bind(this);
        this.changeStartDateCal = this.changeStartDateCal.bind(this);
        this.changeEndDateCal = this.changeEndDateCal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.clearDates = this.clearDates.bind(this);
        this.sortByDecsNotCycle = this.sortByDecsNotCycle.bind(this);
        this.sortByDecsCycle = this.sortByDecsCycle.bind(this);
        this.sortByDateCycle = this.sortByDateCycle.bind(this);
        this.sortByDateNotCycle = this.sortByDateNotCycle.bind(this);
        this.sortByAmountCycle = this.sortByAmountCycle.bind(this);
        this.sortByAmountNotCycle = this.sortByAmountNotCycle.bind(this);
        this.refreshDate = this.refreshDate.bind(this);
    };

    componentDidMount() {
        this.refreshIncomes()
        this.refreshDate()
    };

    refreshDate() {
        var todayDay = new Date()
        var currentStartDate = newDateYYYYMMDD(new Date(todayDay.getFullYear(), todayDay.getMonth(), 1));
        var currentEndDate = newDateYYYYMMDD(new Date(todayDay.getFullYear(), todayDay.getMonth() + 1, 0));
        document.getElementById("startDateIdField").value = currentStartDate;
        document.getElementById("endDateIdField").value = currentEndDate;
        this.setState({ startDate: currentStartDate, })
        this.setState({ endDate: currentEndDate, })
    };

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(response => {
                response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                this.setState({ incomes: response.data })
            })
    };

    deleteIncomeClicked(incomeid, incomeName, targetDate, amount, income) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.deleteIncome(usernameid, incomeid)
            .then(
                response => {
                    this.setState({
                        message:
                            `Przychód usuniety: ` +
                            incomeName + ` z dnia ` +
                            targetDate + ` na kwotę ` +
                            formatter.format(amount)
                    })
                    this.refreshIncomes()
                    this.setState({ incomeCatch: income })
                }
            )
    };

    updateIncomeClicked(incomeid) {
        this.props.history.push(`/incomes/${incomeid}`)
    };

    addIncomeClicked() {
        this.props.history.push(`/incomes/-1`)
    };

    copyIncomeClicked(incomeid) {
        this.props.history.push(`/incomes/${incomeid}/-1`)
    };

    getBackDeletedRecored() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.createIncome(usernameid, this.state.incomeCatch).then(() => this.props.history.push('/incomes'))
        this.setState({
            message: null
        })
        this.refreshIncomes()
        this.refreshIncomes()
        this.refreshIncomes()
    };

    changeStartDateCal() {
        const datatest = document.getElementById('startDateIdField').value
        this.setState({ startDate: datatest, })
    };

    changeEndDateCal() {
        const datatest = document.getElementById('endDateIdField').value
        this.setState({ endDate: datatest, })
    };

    clearDates() {
        this.setState({ startDate: "", })
        this.setState({ endDate: "", })
        document.getElementById('startDateIdField').value = ""
        document.getElementById('endDateIdField').value = ""
    };

    sortByDecsNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort(
                            (a, b) =>
                                (a.cycle == "Nie" && b.cycle == "Nie" && a.description.toLowerCase() < b.description.toLowerCase()) ? 1 : -1
                        )
                    } else {
                        response.data.sort(
                            (a, b) =>
                                (a.cycle == "Nie" && b.cycle == "Nie" && a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1
                        )
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    sortByDecsCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort(
                            (a, b) =>
                                (a.cycle != "Nie" && b.cycle != "Nie" && a.description.toLowerCase() < b.description.toLowerCase()) ? 1 : -1
                        )
                    } else {
                        response.data.sort(
                            (a, b) =>
                                (a.cycle != "Nie" && b.cycle != "Nie" && a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1
                        )
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    sortByDateNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.target_date < b.target_date) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.target_date > b.target_date) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    sortByDateCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.target_date < b.target_date) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.target_date > b.target_date) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    sortByAmountNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.amount < b.amount) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.amount > b.amount) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    sortByAmountCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.amount < b.amount) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.amount > b.amount) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
                }
            )
    };

    onFormSubmit(e) {
        e.preventDefault();
    };

    render() {

        if (this.state.startDate == "") {
            this.state.startDate = new Date("1111-12-31")
        };

        if (this.state.endDate == "") {
            this.state.endDate = new Date("9999-12-31")
        };

        let totalSingleIncome = (this.state.incomes.filter(income =>
            income.cycle == "Nie" &&
            newDateYYYYMMDD(income.target_date) >= newDateYYYYMMDD(this.state.startDate) &&
            newDateYYYYMMDD(income.target_date) <= newDateYYYYMMDD(this.state.endDate))

            .reduce((total, currentItem) => total = total + currentItem.amount, 0));

        let totalCyclical = (this.state.incomes.filter(income => income.cycle != "Nie")
            .reduce((total, currentItem) => total = total + (currentItem.amount *
                cycleCount(
                    currentItem.target_date,
                    currentItem.finish_date,
                    this.state.startDate,
                    this.state.endDate,
                    currentItem.cycle,
                    currentItem.description,
                    currentItem.amount
                )), 0));

        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-success">{this.state.message} <button className="button-88" onClick={this.getBackDeletedRecored}> Cofnij </button> </div>}

                <div className="container-exp-inc-left-26">
                    <div className="text-h5-white">
                        Wybierz zakres dat:
                    </div>
                    <input type="date" id="startDateIdField" onChange={this.changeStartDateCal}></input>
                    <input type="date" id="endDateIdField" onChange={this.changeEndDateCal}></input>
                    <div className="inline-button-clear">
                        <img src={btnClear} width="50" height="50" onClick={this.clearDates} />
                    </div>
                </div>

                <div className="container-exp-inc-middle-41">
                    <div className="text-h1-white">
                        Przychody
                    </div>
                    <div className="text-h4-white">
                        Suma przychodów w wybranym okresie: {formatter.format(totalSingleIncome + totalCyclical)}
                    </div>
                </div>
                <div className="container-exp-inc-right-26">
                </div>

                <form onSubmit={this.onFormSubmit}></form>

                <div className="container-exp-inc-left-45">
                    <div>
                        <div className="text-h4-white">Przychody pojedyńcze</div>
                        <div className="text-h5-white">Suma w wybranym okresie: {formatter.format(totalSingleIncome)}</div>
                    </div>

                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByDecsNotCycle} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByDateNotCycle} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByAmountNotCycle} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.incomes.filter(income =>
                                (newDateYYYYMMDD(income.target_date) >= newDateYYYYMMDD(this.state.startDate) &&
                                    newDateYYYYMMDD(income.target_date) <= newDateYYYYMMDD(this.state.endDate) &&
                                    income.cycle == "Nie")
                                ).map(income =>
                                    <tr key={income.incomeid}>
                                        <td>
                                            {income.description}<br />
                                            {income.comment}
                                        </td>
                                        <td>{newDateDDMMYYYY(income.target_date)}</td>
                                        <td>{formatter.format(income.amount)}</td>
                                        <td>
                                            <img src={btnCopy} width="32" height="32" onClick={() => this.copyIncomeClicked(income.incomeid)} />
                                            <img src={btnEdit} width="32" height="32" onClick={() => this.updateIncomeClicked(income.incomeid)} />
                                            <img src={btnDel} width="32" height="32" onClick={() => this.deleteIncomeClicked(income.incomeid, income.description, newDateDDMMYYYY(income.target_date), income.amount, income)} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <div className="container-exp-inc-right-45">
                    <div>
                        <div className="text-h4-white">Przychody cykliczne</div>
                        <div className="text-h5-white">Suma w wybranym okresie: {formatter.format(totalCyclical)}</div>
                    </div>
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByDecsCycle} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByDateCycle} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="button-sort"><img src={btnSort} width="20" height="20" onClick={this.sortByAmountCycle} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.incomes.filter(income =>
                                    income.cycle != "Nie" && ((newDateYYYYMMDD(this.state.endDate) >= newDateYYYYMMDD(this.state.startDate) &&
                                        (
                                            (newDateYYYYMMDD(income.target_date) <= newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(income.finish_date) >= newDateYYYYMMDD(this.state.endDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (newDateYYYYMMDD(income.target_date) > newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(income.finish_date) < newDateYYYYMMDD(this.state.endDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (newDateYYYYMMDD(income.target_date) <= newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(income.finish_date) < newDateYYYYMMDD(this.state.endDate) &&
                                                newDateYYYYMMDD(income.finish_date) >= newDateYYYYMMDD(this.state.startDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (newDateYYYYMMDD(income.target_date) > newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(income.target_date) <= newDateYYYYMMDD(this.state.endDate) &&
                                                newDateYYYYMMDD(income.finish_date) >= newDateYYYYMMDD(this.state.endDate) &&
                                                cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1)
                                        )
                                    ))
                                ).map(income =>
                                    <tr key={income.incomeid}>
                                        <td>
                                            {income.description}
                                            <br />
                                            {income.cycle}
                                            <br />
                                            {income.comment}
                                        </td>
                                        <td>
                                            Od: {newDateDDMMYYYY(income.target_date)}
                                            <br />
                                            Do: {newDateDDMMYYYY(income.finish_date)}
                                        </td>
                                        <td>{formatter.format(income.amount)}</td>
                                        <td>
                                            <img src={btnCopy} width="32" height="32" onClick={() => this.copyIncomeClicked(income.incomeid)} />
                                            <img src={btnEdit} width="32" height="32" onClick={() => this.updateIncomeClicked(income.incomeid)} />
                                            <img src={btnDel} width="32" height="32" onClick={() => this.deleteIncomeClicked(income.incomeid, income.description, newDateDDMMYYYY(income.target_date), income.amount, income)} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
            </div >
        )
    }
}

export default ListIncomesComponent