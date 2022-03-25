import moment from "moment";
import React, { Component } from "react";
import ExpenseDataService from '../../../api/HomeBudget/ExpenseDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import btnClear from '../../images/clear_button.png';
import btnSort from '../../images/sort_button.png';

class ListExpensesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            expenses: [],
            message: null,
            sortAsc: 1,
        }

        this.deleteExpenseClicked = this.deleteExpenseClicked.bind(this)
        this.updateExpenseClicked = this.updateExpenseClicked.bind(this)
        this.addExpenseClicked = this.addExpenseClicked.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
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
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshDate()
    }

    refreshDate() {
        var todayDay = new Date()
        var currentStartDate = moment(new Date(todayDay.getFullYear(), todayDay.getMonth(), 1)).format("YYYY-MM-DD");
        var currentEndDate = moment(new Date(todayDay.getFullYear(), todayDay.getMonth() + 1, 0)).format("YYYY-MM-DD");
        document.getElementById("startDateIdField").value = currentStartDate;
        document.getElementById("endDateIdField").value = currentEndDate;
        this.setState({ startDate: currentStartDate, })
        this.setState({ endDate: currentEndDate, })
    }

    refreshExpenses() {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    this.setState({ expenses: response.data })
                }
            )
    }

    deleteExpenseClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.deleteExpense(username, id)
            .then(
                response => {
                    this.setState({ message: `Wydatek usuniety` })
                    this.refreshExpenses()
                }
            )
    }

    updateExpenseClicked(id) {
        this.props.history.push(`/expenses/${id}`)
    }

    addExpenseClicked() {
        this.props.history.push(`/expenses/-1`)
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

    sortByDecsNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
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
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByDecsCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
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
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByDateNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.targetDate < b.targetDate) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.targetDate > b.targetDate) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByDateCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.targetDate < b.targetDate) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.targetDate > b.targetDate) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByAmountNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.price < b.price) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.price > b.price) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByAmountCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.price < b.price) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.price > b.price) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    onFormSubmit(e) {
        e.preventDefault();
    }

    render() {

        if (this.state.startDate == "") {
            this.state.startDate = new Date("1111-12-31")
        }
        if (this.state.endDate == "") {
            this.state.endDate = new Date("9999-12-31")
        }

        function getMonthsBetweenTwoDates3(targetDate, finishDate, startDate, endDate, whatCycle, nazwa, cena) {

            var targetDate = new Date(targetDate);
            var finishDate = new Date(finishDate);
            var startDate = new Date(startDate);
            var endDate = new Date(endDate);

            var targetDate1 = changeDateFormat(targetDate);
            var finishDate1 = changeDateFormat(finishDate);
            var startDate1 = changeDateFormat(startDate);
            var endDate1 = changeDateFormat(endDate);

            var firstDayEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            var lastDayStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

            var monthsCount = 0;

            if (targetDate1 <= startDate1 && finishDate1 >= endDate1) {
                monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                monthsCount -= startDate.getMonth();
                monthsCount += endDate.getMonth();
                if (endDate.getDate() - startDate.getDate() >= 0) {
                    monthsCount += 1
                }
            } else if (targetDate1 <= startDate1 && finishDate1 < endDate1 && finishDate1 >= startDate1) {
                monthsCount = (finishDate.getFullYear() - startDate.getFullYear()) * 12;
                monthsCount -= startDate.getMonth();
                monthsCount += finishDate.getMonth();
                if ((finishDate.getDate() - startDate.getDate() >= 0)) {
                    monthsCount += 1
                }
            } else if (targetDate1 > startDate1 && targetDate1 <= endDate1 && finishDate1 >= endDate1) {
                monthsCount = (endDate.getFullYear() - targetDate.getFullYear()) * 12;
                monthsCount -= targetDate.getMonth();
                monthsCount += endDate.getMonth();
                if (endDate.getDate() - targetDate.getDate() >= 0) {
                    monthsCount += 1
                }
            } else if (targetDate1 > startDate1 && finishDate1 < endDate1) {
                monthsCount = (finishDate.getFullYear() - targetDate.getFullYear()) * 12;
                monthsCount -= targetDate.getMonth();
                monthsCount += finishDate.getMonth();
                if (finishDate.getDate() - targetDate.getDate() >= 0) {
                    monthsCount += 1
                }
            } else { }

            if (whatCycle == "Co miesiac") {
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (startDate.getMonth() == endDate.getMonth() && (targetDate.getDate() < startDate.getDate() || targetDate.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (targetDate.getDate() >= startDate.getDate && targetDate.getDate() <= lastDayStartDate.getDate) ||
                    (targetDate.getDate() >= firstDayEndDate.getDate && targetDate.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else { }
            }

            if (whatCycle == "Co pol roku") {

                var yearsCount = Math.floor(monthsCount / 12)
                var halfYearsCount = Math.ceil(monthsCount / 6)

                monthsCount = halfYearsCount
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
                    (targetDate.getDate() < startDate.getDate() || targetDate.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (targetDate.getDate() >= startDate.getDate && targetDate.getDate() <= lastDayStartDate.getDate) ||
                    (targetDate.getDate() >= firstDayEndDate.getDate && targetDate.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else if (targetDate1 < startDate1 & halfYearsCount <= 1) {
                    monthsCount -= 1;
                } else { }
            }

            if (whatCycle == "Co rok") {

                var yearsCount = Math.ceil(monthsCount / 12)
                var halfYearsCount = Math.ceil(monthsCount / 6)

                monthsCount = yearsCount
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
                    (targetDate.getDate() < startDate.getDate() || targetDate.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (targetDate.getDate() >= startDate.getDate && targetDate.getDate() <= lastDayStartDate.getDate) ||
                    (targetDate.getDate() >= firstDayEndDate.getDate && targetDate.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else if (targetDate1 < startDate1 & yearsCount <= 1) {
                    monthsCount -= 1;
                } else { }
            }
            if (monthsCount < 0) { monthsCount = 0 }
            return monthsCount;
        }

        function changeDateFormat(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM-DD");
            return datePrased;
        }

        function changeDateFormatWithoutDays(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM");
            return datePrased;
        }

        let totalSingleExpense = (this.state.expenses.filter(expense =>
            expense.cycle == "Nie" &&
            changeDateFormat(expense.targetDate) >= changeDateFormat(this.state.startDate) &&
            changeDateFormat(expense.targetDate) <= changeDateFormat(this.state.endDate))

            .reduce((total, currentItem) => total = total + currentItem.price, 0));

        let totalCyclical = (this.state.expenses.filter(expense => expense.cycle != "Nie")
            .reduce((total, currentItem) => total = total + (currentItem.price *
                getMonthsBetweenTwoDates3(currentItem.targetDate, currentItem.finishDate, this.state.startDate, this.state.endDate, currentItem.cycle, currentItem.description, currentItem.price)), 0));

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container-exp-inc-left">
                    <div className="text-20px-white">
                        Wybierz zakres dat:
                    </div>
                    <input type="date" id="startDateIdField" onChange={this.changeStartDateCal}></input>
                    <input type="date" id="endDateIdField" onChange={this.changeEndDateCal}></input>
                    <div className="inline-button-clear">
                        <img src={btnClear} width="30" height="30" onClick={this.clearDates} />
                    </div>
                </div>

                <div className="container-exp-inc-middle">
                    <div className="text-40px-white">
                        Wydatki
                    </div>
                    <div className="text-25px-white">
                        Suma wydatkow w wybranym okresie: {formatter.format(totalSingleExpense + totalCyclical)}
                    </div>
                </div>
                <div className="container-exp-inc-right">
                </div>

                <form onSubmit={this.onFormSubmit}></form>

                <div className="container-expenses-left">
                    <div>
                        <div className="text-25px-white">Wydatki pojedyńcze</div>
                        <div className="text-20px-white">Suma w wybranym okresie: {formatter.format(totalSingleExpense)}</div>
                    </div>

                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDecsNotCycle} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDateNotCycle} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByAmountNotCycle} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.expenses.filter(expense =>
                                (changeDateFormat(expense.targetDate) >= changeDateFormat(this.state.startDate) &&
                                    changeDateFormat(expense.targetDate) <= changeDateFormat(this.state.endDate) &&
                                    expense.cycle == "Nie")
                                ).map(expense =>
                                    <tr key={expense.id}>
                                        <td><div className="text-20px-white">{expense.description}</div>
                                            <tr></tr>Kategoria: {expense.category}
                                            <tr></tr>{expense.comment}
                                        </td>
                                        <td>{moment(expense.targetDate).format('DD-MM-YYYY')}</td>
                                        <td>{formatter.format(expense.price)}</td>
                                        <td>
                                            <img src={btnEdit}
                                                width="40" height="40"
                                                onClick={() => this.updateExpenseClicked(expense.id)} />
                                            <img src={btnDel}
                                                width="40" height="40"
                                                onClick={() => this.deleteExpenseClicked(expense.id)} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <div className="container-expenses-right">
                    <div>
                        <div className="text-25px-white">Wydatki cykliczne</div>
                        <div className="text-20px-white">Suma w wybranym okresie: {formatter.format(totalCyclical)}</div>
                    </div>
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDecsCycle} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDateCycle} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByAmountCycle} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.expenses.filter(expense =>
                                    expense.cycle != "Nie" && ((changeDateFormat(this.state.endDate) >= changeDateFormat(this.state.startDate) &&
                                        (
                                            (changeDateFormat(expense.targetDate) <= changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(expense.finishDate) >= changeDateFormat(this.state.endDate)) &&
                                            getMonthsBetweenTwoDates3(expense.targetDate, expense.finishDate, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (changeDateFormat(expense.targetDate) > changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(expense.finishDate) < changeDateFormat(this.state.endDate)) &&
                                            getMonthsBetweenTwoDates3(expense.targetDate, expense.finishDate, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (changeDateFormat(expense.targetDate) <= changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(expense.finishDate) < changeDateFormat(this.state.endDate) &&
                                                changeDateFormat(expense.finishDate) >= changeDateFormat(this.state.startDate)) &&
                                            getMonthsBetweenTwoDates3(expense.targetDate, expense.finishDate, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (changeDateFormat(expense.targetDate) > changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(expense.targetDate) <= changeDateFormat(this.state.endDate) &&
                                                changeDateFormat(expense.finishDate) >= changeDateFormat(this.state.endDate) &&
                                                getMonthsBetweenTwoDates3(expense.targetDate, expense.finishDate, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1)
                                        )
                                    ))
                                ).map(expense =>
                                    <tr key={expense.id}>
                                        <td><div className="text-20px-white">{expense.description}</div>
                                            <tr></tr>
                                            Kategoria: {expense.category}
                                            <tr></tr>
                                            {expense.cycle}
                                            <tr></tr>
                                            {expense.comment}
                                        </td>
                                        <td>
                                            <tr></tr>
                                            Od: {moment(expense.targetDate).format('DD-MM-YYYY')}
                                            <tr></tr>
                                            Do: {moment(expense.finishDate).format('DD-MM-YYYY')}
                                        </td>
                                        <td>{formatter.format(expense.price)}</td>
                                        <td>
                                            <img src={btnEdit} width="40" height="40" onClick={() => this.updateExpenseClicked(expense.id)} />
                                            <img src={btnDel} width="40" height="40" onClick={() => this.deleteExpenseClicked(expense.id)} />
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

export default ListExpensesComponent