import moment from "moment";
import React, { Component } from "react";
import IncomeDataService from '../../../api/HomeBudget/IncomeDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import "../../../App.css"
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import btnClear from '../../images/clear_button.png';
import btnSort from '../../images/sort_button.png';

class ListIncomesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            incomes: [],
            message: null,
            sortAsc: 1,
        }

        this.deleteIncomeClicked = this.deleteIncomeClicked.bind(this)
        this.updateIncomeClicked = this.updateIncomeClicked.bind(this)
        this.addIncomeClicked = this.addIncomeClicked.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.changeStartDateCal = this.changeStartDateCal.bind(this);
        this.changeEndDateCal = this.changeEndDateCal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.clearDates = this.clearDates.bind(this);
        this.sortByDecs = this.sortByDecs.bind(this);
        this.sortByDate = this.sortByDate.bind(this);
        this.sortByAmount = this.sortByAmount.bind(this);
        this.refreshDate = this.refreshDate.bind(this);

    }

    componentDidMount() {
        this.refreshIncomes()
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

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    this.setState({ incomes: response.data })
                }
            )
    }

    deleteIncomeClicked(incomeid) {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.deleteIncome(usernameid, incomeid)
            .then(
                response => {
                    this.setState({ message: `Przychod usuniety` })
                    this.refreshIncomes()
                }
            )
    }

    updateIncomeClicked(incomeid) {
        this.props.history.push(`/incomes/${incomeid}`)
    }

    addIncomeClicked() {
        this.props.history.push(`/incomes/-1`)
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

    sortByDecs() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort(
                            (a, b) =>
                                (a.description < b.description) ? 1 : -1
                        )
                    } else {
                        response.data.sort((a, b) => (a.description > b.description) ?
                            1 :
                            -1
                        )
                    }
                    this.setState({ incomes: response.data })
                }
            )
    }

    sortByDate() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.target_date > b.target_date) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
                }
            )
    }

    sortByAmount() {
        this.state.sortAsc = this.state.sortAsc * -1;
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    if (this.state.sortAsc == 1) {
                        response.data.sort((a, b) => (a.amount < b.amount) ? 1 : -1)
                    } else {
                        response.data.sort((a, b) => (a.amount > b.amount) ? 1 : -1)
                    }
                    this.setState({ incomes: response.data })
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

        function cycleCount(target_date, finish_date, startDate, endDate, whatCycle, nazwa, cena) {
            var target_date = new Date(target_date);
            var finish_date = new Date(finish_date);
            var startDate = new Date(startDate);
            var endDate = new Date(endDate);

            var target_date1 = changeDateFormat(target_date);
            var finish_date1 = changeDateFormat(finish_date);
            var startDate1 = changeDateFormat(startDate);
            var endDate1 = changeDateFormat(endDate);

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

                } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
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

                } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
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

        function changeDateFormat(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM-DD");
            return datePrased;
        }

        function changeDateFormatWithoutDays(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM");
            return datePrased;
        }

        let totalSingleIncome = (this.state.incomes.filter(income =>
            income.cycle == "Nie" &&
            changeDateFormat(income.target_date) >= changeDateFormat(this.state.startDate) &&
            changeDateFormat(income.target_date) <= changeDateFormat(this.state.endDate))

            .reduce((total, currentItem) => total = total + currentItem.amount, 0));

        let totalCyclical = (this.state.incomes.filter(income => income.cycle != "Nie")
            .reduce((total, currentItem) => total = total + (currentItem.amount *
                cycleCount(currentItem.target_date, currentItem.finish_date, this.state.startDate, this.state.endDate, currentItem.cycle, currentItem.description, currentItem.amount)), 0));

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
                        Przychody
                    </div>
                    <div className="text-25px-white">
                        Suma przychodow w wybranym okresie: {formatter.format(totalSingleIncome + totalCyclical)}
                    </div>
                </div>
                <div className="container-exp-inc-right">

                </div>

                <form onSubmit={this.onFormSubmit}></form>

                <div className="container-incomes-left">
                    <div>
                        <div className="text-25px-white">Przychody pojedy??cze</div>
                        <div className="text-20px-white">Suma w wybranym okresie: {formatter.format(totalSingleIncome)}</div>
                    </div>

                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDecs} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDate} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByAmount} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.incomes.filter(income =>
                                    (changeDateFormat(income.target_date) >= changeDateFormat(this.state.startDate) && changeDateFormat(income.target_date) <= changeDateFormat(this.state.endDate) && income.cycle == "Nie")
                                ).map(income =>
                                    <tr key={income.incomeid}>
                                        <td><div className="text-20px-white">{income.description}</div>
                                            <tr></tr>
                                            {income.comment}
                                        </td>
                                        <td>{moment(income.target_date).format('DD-MM-YYYY')}</td>
                                        <td>{formatter.format(income.amount)}</td>
                                        <td>
                                            <img src={btnEdit} width="40" height="40" onClick={() => this.updateIncomeClicked(income.incomeid)} />
                                            <img src={btnDel} width="40" height="40" onClick={() => this.deleteIncomeClicked(income.incomeid)} />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <div className="container-incomes-right">
                    <div>
                        <div className="text-25px-white">Przychody cykliczne</div>
                        <div className="text-20px-white">Suma w wybranym okresie: {formatter.format(totalCyclical)}</div>
                    </div>
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>
                                    Opis
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDecs} /></div>
                                </th>
                                <th>
                                    Data
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByDate} /></div>
                                </th>
                                <th>
                                    Kwota
                                    <div className="sortButton"><img src={btnSort} width="20" height="20" onClick={this.sortByAmount} /></div>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.incomes.filter(income =>
                                    income.cycle != "Nie" && ((changeDateFormat(this.state.endDate) >= changeDateFormat(this.state.startDate) &&
                                        (
                                            (changeDateFormat(income.target_date) <= changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(income.finish_date) >= changeDateFormat(this.state.endDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (changeDateFormat(income.target_date) > changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(income.finish_date) < changeDateFormat(this.state.endDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (changeDateFormat(income.target_date) <= changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(income.finish_date) < changeDateFormat(this.state.endDate) &&
                                                changeDateFormat(income.finish_date) >= changeDateFormat(this.state.startDate)) &&
                                            cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1 ||

                                            (changeDateFormat(income.target_date) > changeDateFormat(this.state.startDate) &&
                                                changeDateFormat(income.target_date) <= changeDateFormat(this.state.endDate) &&
                                                changeDateFormat(income.finish_date) >= changeDateFormat(this.state.endDate) &&
                                                cycleCount(income.target_date, income.finish_date, this.state.startDate, this.state.endDate, income.cycle, income.description, income.amount) >= 1)
                                        )
                                    ))
                                ).map(income =>
                                    <tr key={income.incomeid}>

                                        <td><div className="text-20px-white">{income.description}</div>
                                            <tr></tr>
                                            {income.cycle}
                                            <tr></tr>
                                            {income.comment}
                                        </td>
                                        <td>
                                            <tr></tr>
                                            Od: {moment(income.target_date).format('DD-MM-YYYY')}
                                            <tr></tr>
                                            Do: {moment(income.finish_date).format('DD-MM-YYYY')}
                                        </td>
                                        <td>{formatter.format(income.amount)}</td>
                                        <td>
                                            <img src={btnEdit} width="40" height="40" onClick={() => this.updateIncomeClicked(income.incomeid)} />
                                            <img src={btnDel} width="40" height="40" onClick={() => this.deleteIncomeClicked(income.incomeid)} />
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

// function cycleCount(target_date, finish_date, startDate, endDate, whatCycle, nazwa, cena) {
//     var target_date = new Date(target_date);
//     var finish_date = new Date(finish_date);
//     var startDate = new Date(startDate);
//     var endDate = new Date(endDate);

//     var target_date1 = changeDateFormat(target_date);
//     var finish_date1 = changeDateFormat(finish_date);
//     var startDate1 = changeDateFormat(startDate);
//     var endDate1 = changeDateFormat(endDate);

//     var firstDayEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
//     var lastDayStartDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

//     var monthsCount = 0;

//     if (target_date1 <= startDate1 && finish_date1 >= endDate1) {
//         monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12;
//         monthsCount -= startDate.getMonth();
//         monthsCount += endDate.getMonth();
//         if (endDate.getDate() - startDate.getDate() >= 0) {
//             monthsCount += 1
//         }
//     } else if (target_date1 <= startDate1 && finish_date1 < endDate1 && finish_date1 >= startDate1) {
//         monthsCount = (finish_date.getFullYear() - startDate.getFullYear()) * 12;
//         monthsCount -= startDate.getMonth();
//         monthsCount += finish_date.getMonth();
//         if ((finish_date.getDate() - startDate.getDate() >= 0)) {
//             monthsCount += 1
//         }
//     } else if (target_date1 > startDate1 && target_date1 <= endDate1 && finish_date1 >= endDate1) {
//         monthsCount = (endDate.getFullYear() - target_date.getFullYear()) * 12;
//         monthsCount -= target_date.getMonth();
//         monthsCount += endDate.getMonth();
//         if (endDate.getDate() - target_date.getDate() >= 0) {
//             monthsCount += 1
//         }
//     } else if (target_date1 > startDate1 && finish_date1 < endDate1) {
//         monthsCount = (finish_date.getFullYear() - target_date.getFullYear()) * 12;
//         monthsCount -= target_date.getMonth();
//         monthsCount += finish_date.getMonth();
//         if (finish_date.getDate() - target_date.getDate() >= 0) {
//             monthsCount += 1
//         }
//     } else { }

//     if (whatCycle == "Co miesiac") {
//         if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {
//         } else if (startDate.getMonth() == endDate.getMonth() && (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
//             monthsCount -= 1;
//         } else if (startDate.getMonth() != endDate.getMonth() && (
//             (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
//             (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
//         )) {
//             monthsCount -= 1;
//         } else { }
//     }

//     if (whatCycle == "Co pol roku") {
//         var yearsCount = Math.floor(monthsCount / 12)
//         var halfYearsCount = Math.ceil(monthsCount / 6)

//         monthsCount = halfYearsCount
//         if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {

//         } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
//             (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
//             monthsCount -= 1;
//         } else if (startDate.getMonth() != endDate.getMonth() && (
//             (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
//             (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
//         )) {
//             monthsCount -= 1;
//         } else if (target_date1 < startDate1 & halfYearsCount <= 1) {
//             monthsCount -= 1;
//         } else { }
//     }

//     if (whatCycle == "Co rok") {
//         var yearsCount = Math.ceil(monthsCount / 12)
//         var halfYearsCount = Math.ceil(monthsCount / 6)
//         monthsCount = yearsCount
//         if (startDate.getFullYear() == "1111" && endDate.getFullYear() == "9999") {

//         } else if (changeDateFormatWithoutDays(startDate) == changeDateFormatWithoutDays(endDate) &&
//             (target_date.getDate() < startDate.getDate() || target_date.getDate() > endDate.getDate())) {
//             monthsCount -= 1;
//         } else if (startDate.getMonth() != endDate.getMonth() && (
//             (target_date.getDate() >= startDate.getDate && target_date.getDate() <= lastDayStartDate.getDate) ||
//             (target_date.getDate() >= firstDayEndDate.getDate && target_date.getDate() <= endDate.getDate)
//         )) {
//             monthsCount -= 1;
//         } else if (target_date1 < startDate1 & yearsCount <= 1) {
//             monthsCount -= 1;
//         } else { }
//     }
//     if (monthsCount < 0) { monthsCount = 0 }
//     return monthsCount;
// }