import moment from "moment";
import React, { Component } from "react";
import ExpenseDataService from '../../../api/HomeBudget/ExpenseDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import btnClear from '../../images/clear_button.png';
import btnSort from '../../images/sort_button.png';
import btnCopy from '../../images/copy_button.png';
import CategoryDataService from "../../../api/HomeBudget/CategoryDataService";

class ListExpensesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            expenses: [],
            message: null,
            sortAsc: 1,
            categories: []
        }

        this.deleteExpenseClicked = this.deleteExpenseClicked.bind(this)
        this.updateExpenseClicked = this.updateExpenseClicked.bind(this)
        this.addExpenseClicked = this.addExpenseClicked.bind(this)
        this.copyExpenseClicked = this.copyExpenseClicked.bind(this)
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
        this.refreshCategories = this.refreshCategories.bind(this);
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshCategories()
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

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid).then(response => { this.setState({ categories: response.data }) })
    }

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    this.setState({ expenses: response.data })
                }
            )
    }

    deleteExpenseClicked(expenseid) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.deleteExpense(usernameid, expenseid)
            .then(
                response => {
                    this.setState({ message: `Wydatek usuniety` })
                    this.refreshExpenses()
                }
            )
    }

    updateExpenseClicked(expenseid) {
        this.props.history.push(`/expenses/${expenseid}`)
    }

    addExpenseClicked() {
        this.props.history.push(`/expenses/-1`)
    }

    copyExpenseClicked(expenseid) {
        this.props.history.push(`/expenses/${expenseid}/-1`)
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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.target_date < b.target_date) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle == "Nie" && b.cycle == "Nie" && a.target_date > b.target_date) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByDateCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.target_date < b.target_date) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.cycle != "Nie" && b.cycle != "Nie" && a.target_date > b.target_date) ? 1 : -1)
                    }
                    this.setState({ expenses: response.data })
                }
            )
    }

    sortByAmountNotCycle() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
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

        function categoryMap(id, categoryList) {
            const arrCat = ([(categoryList.map(category => category.categoryname)), (categoryList.map(category => category.categoryid))]);
            // console.log(arrCat)
            if (arrCat[1].includes(id)) {
                var idCurrentCat = arrCat[0][arrCat[1].indexOf(id)]
                // console.log("tu " + idCurrentCat)
                return idCurrentCat;
            } else {
                return "N/A";
            }
        }

        if (this.state.startDate == "") {
            this.state.startDate = new Date("1111-12-31")
        }
        if (this.state.endDate == "") {
            this.state.endDate = new Date("9999-12-31")
        }

        function getMonthsBetweenTwoDates3(target_date, finish_date, startDate, endDate, whatCycle, nazwa, cena) {

            var target_date = new Date(target_date);
            var finish_date = new Date(finish_date);
            var startDate = new Date(startDate);
            var endDate = new Date(endDate);

            var target_date1 = newDateYYYYMMDD(target_date);
            var finish_date1 = newDateYYYYMMDD(finish_date);
            var startDate1 = newDateYYYYMMDD(startDate);
            var endDate1 = newDateYYYYMMDD(endDate);

            var firstDayEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            var lastDayStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

            var monthsCount = 0;

            if (target_date1 <= startDate1 && finish_date1 >= endDate1) {
                monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                monthsCount -= startDate.getMonth();
                monthsCount += endDate.getMonth();
                if (endDate.getDate() - startDate.getDate() >= 0) {
                    monthsCount += 1
                }
            } else if (target_date1 <= startDate1 && finish_date1 < endDate1 && finish_date1 >= startDate1) {
                monthsCount = (finish_date.getFullYear() - startDate.getFullYear()) * 12;
                monthsCount -= startDate.getMonth();
                monthsCount += finish_date.getMonth();
                if ((finish_date.getDate() - startDate.getDate() >= 0)) {
                    monthsCount += 1
                }
            } else if (target_date1 > startDate1 && target_date1 <= endDate1 && finish_date1 >= endDate1) {
                monthsCount = (endDate.getFullYear() - target_date.getFullYear()) * 12;
                monthsCount -= target_date.getMonth();
                monthsCount += endDate.getMonth();
                if (endDate.getDate() - target_date.getDate() >= 0) {
                    monthsCount += 1
                }
            } else if (target_date1 > startDate1 && finish_date1 < endDate1) {
                monthsCount = (finish_date.getFullYear() - target_date.getFullYear()) * 12;
                monthsCount -= target_date.getMonth();
                monthsCount += finish_date.getMonth();
                if (finish_date.getDate() - target_date.getDate() >= 0) {
                    monthsCount += 1
                }
            } else { }

            if (whatCycle == "Co miesiac") {
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (startDate.getMonth() == endDate.getMonth() && (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
                    (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else { }
            }

            if (whatCycle == "Co pol roku") {

                var yearsCount = Math.floor(monthsCount / 12)
                var halfYearsCount = Math.ceil(monthsCount / 6)

                monthsCount = halfYearsCount
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (newDateYYYYMM(startDate) == newDateYYYYMM(endDate) &&
                    (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
                    (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else if (target_date1 < startDate1 & halfYearsCount <= 1) {
                    monthsCount -= 1;
                } else { }
            }

            if (whatCycle == "Co rok") {

                var yearsCount = Math.ceil(monthsCount / 12)
                var halfYearsCount = Math.ceil(monthsCount / 6)

                monthsCount = yearsCount
                if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
                } else if (newDateYYYYMM(startDate) == newDateYYYYMM(endDate) &&
                    (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
                    monthsCount -= 1;
                } else if (startDate.getMonth() != endDate.getMonth() && (
                    (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
                    (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
                )) {
                    monthsCount -= 1;
                } else if (target_date1 < startDate1 & yearsCount <= 1) {
                    monthsCount -= 1;
                } else { }
            }
            if (monthsCount < 0) { monthsCount = 0 }
            return monthsCount;
        }

        function newDateYYYYMMDD(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM-DD");
            return datePrased;
        }

        function newDateYYYYMM(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM");
            return datePrased;
        }

        let totalSingleExpense = (this.state.expenses.filter(expense =>
            expense.cycle == "Nie" &&
            newDateYYYYMMDD(expense.target_date) >= newDateYYYYMMDD(this.state.startDate) &&
            newDateYYYYMMDD(expense.target_date) <= newDateYYYYMMDD(this.state.endDate))

            .reduce((total, currentItem) => total = total + currentItem.price, 0));

        let totalCyclical = (this.state.expenses.filter(expense => expense.cycle != "Nie")
            .reduce((total, currentItem) => total = total + (currentItem.price *
                getMonthsBetweenTwoDates3(currentItem.target_date, currentItem.finish_date, this.state.startDate, this.state.endDate, currentItem.cycle, currentItem.description, currentItem.price)), 0));

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
                                (newDateYYYYMMDD(expense.target_date) >= newDateYYYYMMDD(this.state.startDate) &&
                                    newDateYYYYMMDD(expense.target_date) <= newDateYYYYMMDD(this.state.endDate) &&
                                    expense.cycle == "Nie")
                                ).map(expense =>
                                    <tr key={expense.expenseid}>
                                        <td><div className="text-20px-white">{expense.description}</div>
                                            Kategoria: {categoryMap(expense.category, this.state.categories)}
                                            <br />
                                            {expense.comment}
                                        </td>
                                        <td>{moment(expense.target_date).format('DD-MM-YYYY')}</td>
                                        <td>{formatter.format(expense.price)}</td>
                                        <td>
                                            <img src={btnCopy} width="40" height="40" onClick={() => this.copyExpenseClicked(expense.expenseid)} />
                                            <img src={btnEdit} width="40" height="40" onClick={() => this.updateExpenseClicked(expense.expenseid)} />
                                            <img src={btnDel} width="40" height="40" onClick={() => this.deleteExpenseClicked(expense.expenseid)} />
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
                                    expense.cycle != "Nie" && ((newDateYYYYMMDD(this.state.endDate) >= newDateYYYYMMDD(this.state.startDate) &&
                                        (
                                            (newDateYYYYMMDD(expense.target_date) <= newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(expense.finish_date) >= newDateYYYYMMDD(this.state.endDate)) &&
                                            getMonthsBetweenTwoDates3(expense.target_date, expense.finish_date, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (newDateYYYYMMDD(expense.target_date) > newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(expense.finish_date) < newDateYYYYMMDD(this.state.endDate)) &&
                                            getMonthsBetweenTwoDates3(expense.target_date, expense.finish_date, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (newDateYYYYMMDD(expense.target_date) <= newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(expense.finish_date) < newDateYYYYMMDD(this.state.endDate) &&
                                                newDateYYYYMMDD(expense.finish_date) >= newDateYYYYMMDD(this.state.startDate)) &&
                                            getMonthsBetweenTwoDates3(expense.target_date, expense.finish_date, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1 ||

                                            (newDateYYYYMMDD(expense.target_date) > newDateYYYYMMDD(this.state.startDate) &&
                                                newDateYYYYMMDD(expense.target_date) <= newDateYYYYMMDD(this.state.endDate) &&
                                                newDateYYYYMMDD(expense.finish_date) >= newDateYYYYMMDD(this.state.endDate) &&
                                                getMonthsBetweenTwoDates3(expense.target_date, expense.finish_date, this.state.startDate, this.state.endDate, expense.cycle, expense.description, expense.price) >= 1)
                                        )
                                    ))
                                ).map(expense =>
                                    <tr key={expense.expenseid}>
                                        <td><div className="text-20px-white">{expense.description}</div>
                                            Kategoria: {categoryMap(expense.category, this.state.categories)}
                                            <br />
                                            {expense.cycle}
                                            <br />
                                            {expense.comment}
                                        </td>
                                        <td>
                                            Od: {moment(expense.target_date).format('DD-MM-YYYY')}
                                            <br />
                                            Do: {moment(expense.finish_date).format('DD-MM-YYYY')}
                                        </td>
                                        <td>{formatter.format(expense.price)}</td>
                                        <td>
                                            <img src={btnCopy} width="40" height="40" onClick={() => this.copyExpenseClicked(expense.expenseid)} />
                                            <img src={btnEdit} width="40" height="40" onClick={() => this.updateExpenseClicked(expense.expenseid)} />
                                            <img src={btnDel} width="40" height="40" onClick={() => this.deleteExpenseClicked(expense.expenseid)} />
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