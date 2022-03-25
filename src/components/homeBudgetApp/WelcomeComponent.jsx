import React, { Component } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import ExpenseDataService from '../../api/HomeBudget/ExpenseDataService.js';
import AuthenticationService from './AuthenticationService.js';
import CategoryDataService from "../../api/HomeBudget/CategoryDataService";
import IncomeDataService from "../../api/HomeBudget/IncomeDataService.js";
import BudgetDataService from "../../api/HomeBudget/BudgetDataService.js";
import btnBack from '../images/back_button.png';
import btnNext from '../images/next_button.png';

class WelcomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateMonthChoice: "",
            dateMonthChoiceAllFromMth: "",
            dateMonthChoiceAllToMth: "",
            dateYearChoice: "",
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            selectYear: "All",
            shchild1: false,
            welcomeMessage: '',
        }

        this.handleSuccesfulResponse = this.handleSuccesfulResponse.bind(this)
        this.handleError = this.handleError.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.filterDataMonth = this.filterDataMonth.bind(this)
        this.filterDataMonthAllFromMth = this.filterDataMonthAllFromMth.bind(this)
        this.filterDataMonthAllToMth = this.filterDataMonthAllToMth.bind(this)
        this.filterDataYear = this.filterDataYear.bind(this)
        this.refreshMonth = this.refreshMonth.bind(this)
        this.refreshYear = this.refreshYear.bind(this)
        this.changeToPrevMonth = this.changeToPrevMonth.bind(this)
        this.changeToNextMonth = this.changeToNextMonth.bind(this)
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshBudgets()
        this.refreshCategories()
        this.refreshMonth()
    }

    refreshMonth() {
        var choosenMonth = moment(Date()).format("YYYY-MM")
        document.getElementById("monthChoiceFilter").value = choosenMonth;
        document.getElementById("monthChoiceFilterAllFromMth").value = choosenMonth;
        document.getElementById("monthChoiceFilterAllToMth").value = choosenMonth;
        this.setState({ dateMonthChoice: choosenMonth, })
        this.setState({ dateMonthChoiceAllFromMth: choosenMonth, })
        this.setState({ dateMonthChoiceAllToMth: choosenMonth, })
    }

    refreshYear() {
        var choosenYear = moment(Date()).format("YYYY");
        document.getElementById("yearChoiceFilter").value = choosenYear;
        this.setState({ dateMonthChoice: choosenYear, })
    }

    refreshExpenses() {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username)
            .then(
                response => {
                    response.data.sort((a, b) => (a.targetDate < b.targetDate) ? 1 : -1)
                    this.setState({ expenses: response.data })
                }
            )
    }

    refreshIncomes() {
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(username)
            .then(
                response => {
                    response.data.sort((a, b) => (a.targetDate < b.targetDate) ? 1 : -1)
                    this.setState({ incomes: response.data })
                }
            )
    }

    refreshBudgets() {
        let username = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(username).then(response => { this.setState({ budgets: response.data }) })
    }

    refreshCategories() {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username).then(response => { this.setState({ categories: response.data }) })
    }

    filterDataMonth() {
        const dataMonth = document.getElementById('monthChoiceFilter').value;
        this.setState({ dateMonthChoice: dataMonth, })
    }

    filterDataMonthAllFromMth() {
        const dataMonth = document.getElementById('monthChoiceFilterAllFromMth').value;
        this.setState({ dateMonthChoiceAllFromMth: dataMonth, })
    }

    filterDataMonthAllToMth() {
        const dataMonth = document.getElementById('monthChoiceFilterAllToMth').value;
        this.setState({ dateMonthChoiceAllToMth: dataMonth, })
    }

    changeToPrevMonth() {
        const dataMonthCurrentChoice = document.getElementById('monthChoiceFilter').value
        if (dataMonthCurrentChoice==""){return}
        var dataMonthNewChoice = new Date(dataMonthCurrentChoice);
        dataMonthNewChoice.setDate(1);
        dataMonthNewChoice.setMonth(dataMonthNewChoice.getMonth() - 1);
        dataMonthNewChoice = moment(dataMonthNewChoice).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = dataMonthNewChoice;
        this.setState({ dateMonthChoice: dataMonthNewChoice, })
    }

    changeToNextMonth() {
        const dataMonthCurrentChoice = document.getElementById('monthChoiceFilter').value;
        if (dataMonthCurrentChoice==""){return}
        var dataMonthNewChoice = new Date(dataMonthCurrentChoice);
        dataMonthNewChoice.setDate(1);
        dataMonthNewChoice.setMonth(dataMonthNewChoice.getMonth() + 1);
        dataMonthNewChoice = moment(dataMonthNewChoice).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = dataMonthNewChoice;
        this.setState({ dateMonthChoice: dataMonthNewChoice, })
    }

    filterDataYear() {
        const dataYear = document.getElementById('yearChoiceFilter').value;
        this.setState({ dateYearChoice: dataYear, })
    }

    handleSuccesfulResponse(response) {
        this.setState({ welcomeMessage: response.data.message })
    }

    handleError(error) {
        let errorMessage = '';
        if (error.message)
            errorMessage += error.message
        if (error.response && error.response.data) {
            errorMessage += error.response.data.message
        }
        this.setState({ welcomeMessage: errorMessage })
    }

    render() {

        if (this.state.dateMonthChoiceAllFromMth == "") {
            this.state.dateMonthChoiceAllFromMth = new Date("1111-12-31")
        }
        if (this.state.dateMonthChoiceAllToMth == "") {
            this.state.dateMonthChoiceAllToMth = new Date("9999-12-31")
        }

        function changeDateFormat(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM-DD");
            return datePrased;
        }

        function changeDateFormatWithoutDays(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY-MM");
            return datePrased;
        }

        function changeDateFormatOnlyYear(date1) {
            var datePrased = moment(Date.parse(date1)).format("YYYY");
            return datePrased;
        }

        function changeDateFormatOnlyMonth(date1) {
            var datePrased = moment(Date.parse(date1)).format("MM");
            return datePrased;
        }

        function changeDateFormatOnlyMonthNumber(date1) {
            var datePrased = moment(Date.parse(date1)).format("M");
            return datePrased;
        }

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

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

        const uniqueMonth = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]
        const uniqueMonth2 = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"]

        var byMonthExpenseTotal;
        var byHalfYearExpenseTotal;
        var oneTimeExpenseTotal;
        var byYearExpenseTotal;
        var totalExpenses;
        if (this.state.dateMonthChoice == "") {
            totalExpenses = 0;
        } else {
            byMonthExpenseTotal = (this.state.expenses.filter
                (expense => expense.cycle == "Co miesiac" && (
                    (changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                    (changeDateFormatWithoutDays(expense.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                    (changeDateFormatWithoutDays(expense.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(expense.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byHalfYearExpenseTotal = (this.state.expenses.filter
                (expense => expense.cycle == "Co pol roku" && (
                    (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(expense.targetDate)) % 6) == 0 &&
                    (
                        (changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(expense.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(expense.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(expense.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                    )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byYearExpenseTotal = (this.state.expenses.filter
                (expense => expense.cycle == "Co rok" && (
                    (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(expense.targetDate)) % 12) == 0 &&
                    (
                        (changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(expense.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(expense.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(expense.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                    )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            oneTimeExpenseTotal = (this.state.expenses.filter
                (expense => expense.cycle == "Nie" && changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            totalExpenses = byMonthExpenseTotal + byHalfYearExpenseTotal + byYearExpenseTotal + oneTimeExpenseTotal
        }

        var byMonthIncomeTotal;
        var byYearIncomeTotal;
        var byHalfYearIncomeTotal;
        var oneTimeIncomeTotal;
        var totalIncomes;
        if (this.state.dateMonthChoice == "") {
            totalIncomes = 0;
        } else {
            byMonthIncomeTotal = (this.state.incomes.filter
                (income => income.cycle == "Co miesiac" &&
                    (
                        (changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(income.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                    )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byHalfYearIncomeTotal = (this.state.incomes.filter
                (income => income.cycle == "Co pol roku" && (
                    (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(income.targetDate)) % 6) == 0 &&
                    (
                        (changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(income.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                    )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byYearIncomeTotal = (this.state.incomes.filter
                (income => income.cycle == "Co rok" && (
                    (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(income.targetDate)) % 12) == 0 &&
                    (
                        (changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                        (changeDateFormatWithoutDays(income.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(income.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                    )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            oneTimeIncomeTotal = (this.state.incomes.filter
                (income => income.cycle == "Nie" && changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            totalIncomes = byMonthIncomeTotal + byHalfYearIncomeTotal + byYearIncomeTotal + oneTimeIncomeTotal
        }

        var totalCycleIncomesTillDate;
        var totalSingleIncomesTillDate;
        var totalIncomesTillDate;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalIncomesTillDate = 0;
        } else {
            totalCycleIncomesTillDate = (this.state.incomes.filter(income => income.cycle != "Nie"
            ).reduce((total, currentItem) => total = total + currentItem.amount *
                getMonthsBetweenTwoDates3(currentItem.targetDate, currentItem.finishDate, changeDateFormat(this.state.dateMonthChoiceAllFromMth), changeDateFormat(this.state.dateMonthChoiceAllToMth), currentItem.cycle, currentItem.description, currentItem.amount), 0));

            totalSingleIncomesTillDate = (this.state.incomes.filter
                (income =>
                    income.cycle == "Nie" &&
                    changeDateFormatWithoutDays(income.targetDate) >= changeDateFormatWithoutDays(this.state.dateMonthChoiceAllFromMth) &&
                    changeDateFormatWithoutDays(income.targetDate) <= changeDateFormatWithoutDays(this.state.dateMonthChoiceAllToMth)
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            totalIncomesTillDate = totalCycleIncomesTillDate + totalSingleIncomesTillDate
        }

        var totalCycleExpensesTillDate;
        var totalSingleExpensesTillDate;
        var totalExpensesTillDate;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalExpensesTillDate = 0;
        } else {
            totalCycleExpensesTillDate = (this.state.expenses.filter(expense => expense.cycle != "Nie"
            ).reduce((total, currentItem) => total = total + currentItem.price *
                getMonthsBetweenTwoDates3(currentItem.targetDate, currentItem.finishDate, changeDateFormat(this.state.dateMonthChoiceAllFromMth), changeDateFormat(this.state.dateMonthChoiceAllToMth), currentItem.cycle, currentItem.description, currentItem.price), 0));

            totalSingleExpensesTillDate = (this.state.expenses.filter
                (expense =>
                    expense.cycle == "Nie" &&
                    changeDateFormatWithoutDays(expense.targetDate) >= changeDateFormatWithoutDays(this.state.dateMonthChoiceAllFromMth) &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(Date())
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            totalExpensesTillDate = totalCycleExpensesTillDate + totalSingleExpensesTillDate
        }

        var totalBudgets;
        if (this.state.dateMonthChoice == "") {
            totalBudgets = 0;
        } else {
            totalBudgets = (this.state.budgets.filter(budget => changeDateFormatWithoutDays(budget.targetMonth) == changeDateFormatWithoutDays(this.state.dateMonthChoice)
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var totalBudgetsTillDate;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalBudgetsTillDate = 0;
        } else {
            totalBudgetsTillDate = (this.state.budgets.filter(
                budget =>
                    changeDateFormatWithoutDays(budget.targetMonth) >= changeDateFormatWithoutDays(this.state.dateMonthChoiceAllFromMth) &&
                    changeDateFormatWithoutDays(budget.targetMonth) <= changeDateFormatWithoutDays(this.state.dateMonthChoiceAllToMth)
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var monthNames = [];
        var TotalValueByMonthExpenses = [];
        var oneTimeValueForByMonthChartExpenses = [];
        var byYearValueForByMonthChartExpenses = [];
        var byMonthValueForByMonthChartExpenses = [];
        var byHalfYearValueForByMonthChartExpenses = [];
        var testDateCurrentYear = [];
        var testDate2CurrentYear = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            testDateCurrentYear[i] = new Date(monthNames[i])
            testDate2CurrentYear[i] = changeDateFormatWithoutDays(new Date(moment(this.state.dateMonthChoice).format("YYYY"), testDateCurrentYear[i].getMonth()))
            oneTimeValueForByMonthChartExpenses[i] = (this.state.expenses.filter
                (expense => (
                    expense.cycle == "Nie" &&
                    changeDateFormatWithoutDays(expense.targetDate) == testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byYearValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    changeDateFormatOnlyMonth(expense.targetDate) == changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonthNumber(monthNames[i]) - changeDateFormatOnlyMonthNumber(expense.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(testDate2CurrentYear[i]) &&
                    changeDateFormatOnlyYear(expense.targetDate) <= changeDateFormatOnlyYear(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            TotalValueByMonthExpenses[i] = byYearValueForByMonthChartExpenses[i] + byHalfYearValueForByMonthChartExpenses[i] + byMonthValueForByMonthChartExpenses[i] + oneTimeValueForByMonthChartExpenses[i]
        }

        var monthNames = [];
        var TotalValueByMonthIncomes = [];
        var oneTimeValueForByMonthChartIncomes = [];
        var byYearValueForByMonthChartIncomes = [];
        var byMonthValueForByMonthChartIncomes = [];
        var byHalfYearValueForByMonthChartIncomes = [];
        var testDateCurrentYear = [];
        var testDate2CurrentYear = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            testDateCurrentYear[i] = new Date(monthNames[i])
            testDate2CurrentYear[i] = changeDateFormatWithoutDays(new Date(moment(this.state.dateMonthChoice).format("YYYY"), testDateCurrentYear[i].getMonth()))
            oneTimeValueForByMonthChartIncomes[i] = (this.state.incomes.filter
                (income => (
                    income.cycle == "Nie" &&
                    changeDateFormatWithoutDays(income.targetDate) == testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byYearValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(income.targetDate) <= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    changeDateFormatOnlyMonth(income.targetDate) >= changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byMonthValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(income.targetDate) <= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byHalfYearValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonth(monthNames[i]) - changeDateFormatOnlyMonth(income.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    changeDateFormatWithoutDays(income.targetDate) <= changeDateFormatWithoutDays(testDate2CurrentYear[i]) &&
                    changeDateFormatOnlyYear(income.targetDate) <= changeDateFormatOnlyYear(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            TotalValueByMonthIncomes[i] = byYearValueForByMonthChartIncomes[i] + byHalfYearValueForByMonthChartIncomes[i] + byMonthValueForByMonthChartIncomes[i] + oneTimeValueForByMonthChartIncomes[i]
        }

        const allCategories = this.state.categories.map(category => category.categoryname);
        const categoriesColor = this.state.categories.map(category => category.hexcolor);

        var categoriesWithValues = [];

        var totalPriceByCat = [];
        var categoryNames = [];
        var rgbColorByCategory = [];
        var TotalValueByCategory = [];
        var oneTimeValueForByCategoryChart = [];
        var byYearValueForByCategoryChart = [];
        var byMonthValueForByCategoryChart = [];
        var byHalfYearValueForByCategoryChart = [];
        var j = 0;
        for (let i = 0; i < allCategories.length; i++) {
            categoryNames[i] = allCategories[i];
            oneTimeValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Nie" &&
                    changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byYearValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co rok" &&
                    changeDateFormatOnlyYear(expense.targetDate) <= changeDateFormatOnlyYear(this.state.dateMonthChoice) &&
                    changeDateFormatOnlyYear(expense.finishDate) >= changeDateFormatOnlyYear(this.state.dateMonthChoice) &&
                    changeDateFormatOnlyMonth(expense.targetDate) == changeDateFormatOnlyMonth(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(this.state.dateMonthChoice) &&
                    changeDateFormatWithoutDays(expense.finishDate) >= changeDateFormatWithoutDays(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(expense.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(this.state.dateMonthChoice) &&
                    changeDateFormatWithoutDays(expense.finishDate) >= changeDateFormatWithoutDays(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            var checkValue = 0;
            checkValue = byYearValueForByCategoryChart[i] + byHalfYearValueForByCategoryChart[i] + byMonthValueForByCategoryChart[i] + oneTimeValueForByCategoryChart[i]

            if (checkValue != 0) {
                rgbColorByCategory[j] = categoriesColor[i];
                TotalValueByCategory[j] = byYearValueForByCategoryChart[i] + byHalfYearValueForByCategoryChart[i] + byMonthValueForByCategoryChart[i] + oneTimeValueForByCategoryChart[i]
                totalPriceByCat[j] = categoryNames[i] + ": " + TotalValueByCategory[i]
                categoriesWithValues[j] = categoryNames[i]
                j = j + 1
            }
        }

        const listAmountsByCat = totalPriceByCat.map((link) =>
            <div className="listByCategory">{link} zł</div>
        );

        let redBgForSavingsFromIncomes;
        if ((totalIncomes - totalExpenses) >= 0) { redBgForSavingsFromIncomes = false; }
        else { redBgForSavingsFromIncomes = true; }

        let redBgForSavingsFromBudgets;
        if ((totalBudgets - totalExpenses) >= 0) { redBgForSavingsFromBudgets = false; }
        else { redBgForSavingsFromBudgets = true; }

        let redBgForSavingsFromIncomes1;
        if ((totalIncomesTillDate - totalExpensesTillDate) >= 0) { redBgForSavingsFromIncomes1 = false; }
        else { redBgForSavingsFromIncomes1 = true; }

        let redBgForSavingsFromBudgets1;
        if ((totalBudgetsTillDate - totalExpensesTillDate) >= 0) { redBgForSavingsFromBudgets1 = false; }
        else { redBgForSavingsFromBudgets1 = true; }

        const dataByMonth = {
            labels: monthNames,
            datasets: [{
                label: 'Wydatki',
                data: TotalValueByMonthExpenses,
                backgroundColor: '#2177ef',
            },
            {
                label: 'Przychody',
                data: TotalValueByMonthIncomes,
                backgroundColor: '#333',
            }]
        };
        const dataByCategory = {
            labels: categoriesWithValues,
            datasets: [{
                data: TotalValueByCategory,
                backgroundColor: rgbColorByCategory,
            }]
        };

        const optionsBar = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                }
            },
        }
        const optionsDon = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "left",
                }
            },
        }

        return (
            <>
                <div className="background-color-all">
                    <div className="container-welcome-left">
                        <div className="text-20px-white">
                            Wybierz miesiac
                        </div>
                        <div>
                            <img src={btnBack} width="30" height="30" onClick={this.changeToPrevMonth} />
                            <input
                                type="month"
                                id="monthChoiceFilter"
                                onChange={this.filterDataMonth}
                                data-date-format="MM YYYY"
                            >
                            </input>
                            <img src={btnNext} width="30" height="30" onClick={this.changeToNextMonth} />
                        </div>
                    </div>
                    <div className="container-welcome-middle">
                        <div className="text-40px-white">
                            Witaj {AuthenticationService.getLoggedInUserName()}!<br />
                            Oto Twoje podsumowanie:
                        </div>
                    </div>
                    <div className="container-welcome-right-stats">
                        <div className="text-20px-white">
                            Bilans
                            <br />od:
                            <input
                                type="month"
                                id="monthChoiceFilterAllFromMth"
                                onChange={this.filterDataMonthAllFromMth}
                            >
                            </input>
                            do:
                            <input
                                type="month"
                                id="monthChoiceFilterAllToMth"
                                onChange={this.filterDataMonthAllToMth}
                            >
                            </input>
                        </div>

                        <div className="container-savings-left">
                            Oszczednosci zalozone: <br />
                        </div>
                        <div className={redBgForSavingsFromBudgets1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {formatter.format(totalBudgetsTillDate - totalExpensesTillDate)}
                        </div>


                        <div className="container-savings-left">
                            Oszczednosci rzeczywiste: <br />
                        </div>
                        <div className={redBgForSavingsFromIncomes1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {formatter.format(totalIncomesTillDate - totalExpensesTillDate)}
                        </div>
                    </div>
                    <div className="hb-row">
                        <div className="container-data-left">
                            <div className="container-container-middle2">
                                Wydatki do budzetu
                            </div>
                            <div
                                className={redBgForSavingsFromBudgets ? 'container-container-middle-red' : 'container-container-middle-green'}
                                style={{ display: (totalBudgets != 0 && totalExpenses != 0 ? 'block' : 'none') }}>

                                {formatter.format(totalExpenses)}/{formatter.format(totalBudgets)}
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalBudgets == 0 && totalExpenses != 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Budzet nie zostal ustalony na wybrany miesiac
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalExpenses == 0 && totalBudgets != 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Brak wydatkow w wybranym miesiacu
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalExpenses == 0 && totalBudgets == 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Brak wydatkow i budzetu w wybranym miesiacu
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (this.state.dateMonthChoice == "" ? 'block' : 'none') }}>
                                Miesiac nie zostal wybrany
                            </div>
                            <div className="text-25px-white" style={{ display: (this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Podzial wydatkow na kategorie w wybranym miesiacu
                            </div>
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCategory}
                                    height={300}
                                    options={optionsDon}
                                />
                            </div>
                        </div>
                        <div className="container-data-middle" >
                            <div className="container-container-middle2">
                                Wydatki do przychodow
                            </div>
                            <div
                                className={redBgForSavingsFromIncomes ? 'container-container-middle-red' : 'container-container-middle-green'}
                                style={{ display: (totalIncomes != 0 && totalExpenses != 0 ? 'block' : 'none') }}>

                                {formatter.format(totalExpenses)}/{formatter.format(totalIncomes)}
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalExpenses == 0 && totalIncomes != 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Brak wydatkow w wybranym miesiacu
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalIncomes == 0 && totalExpenses != 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Brak przychodow w wybranym miesiacu
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (totalIncomes == 0 && totalExpenses == 0 && this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Brak przychodow i wydatkow w wybranym miesiacu
                            </div>
                            <div className={'container-container-middle-black'} style={{ display: (this.state.dateMonthChoice == "" ? 'block' : 'none') }}>
                                Miesiac nie zostal wybrany
                            </div>
                            <div className="text-25px-white" style={{ display: (this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                Wydatki i przychody w {moment(this.state.dateMonthChoice).format("YYYY")} roku
                            </div>
                            <div className="chart-bar" style={{ display: (this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                                <Bar
                                    title={{ display: false }}
                                    data={dataByMonth}
                                    height={300}
                                    options={optionsBar}
                                />
                            </div>
                        </div>

                        <div className="container-data-right">
                            <div className="container-container-middle">5 ostatnich transakcji z wybranego miesiaca</div>
                            <div className="text-25px-white">Wydatki</div>
                            <table className="hb-table-red">
                                <thead>
                                    <tr>
                                        <th>Opis</th>
                                        <th>Kwota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.expenses.filter(
                                            expense =>
                                                this.state.dateMonthChoice != "" &&
                                                (
                                                    ((expense.cycle == "Nie" && changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)))
                                                    || (expense.cycle == "Co miesiac" ||
                                                        (expense.cycle == "Co pol roku" && (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(expense.targetDate)) % 6 == 0) ||
                                                        (expense.cycle == "Co rok" && (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(expense.targetDate)) % 12 == 0))
                                                    &&
                                                    ((changeDateFormatWithoutDays(expense.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                                                        (changeDateFormatWithoutDays(expense.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                                                        (changeDateFormatWithoutDays(expense.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(expense.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice)))
                                                )
                                        ).slice(0, 5).map(expense =>
                                            <tr key={expense.id}>
                                                <td>{expense.description}</td>
                                                <td>{formatter.format(expense.price)}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            <div className="text-25px-white">Przychody</div>
                            <table className="hb-table-green">
                                <thead>
                                    <tr>
                                        <th>Opis</th>
                                        <th>Kwota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.incomes.filter(
                                            income =>
                                                this.state.dateMonthChoice != "" &&
                                                (
                                                    ((
                                                        income.cycle == "Nie" &&
                                                        changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)))
                                                    || (
                                                        income.cycle == "Co miesiac" ||
                                                        (income.cycle == "Co pol roku" && (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(income.targetDate)) % 6 == 0) ||
                                                        (income.cycle == "Co rok" && (changeDateFormatOnlyMonth(this.state.dateMonthChoice) - changeDateFormatOnlyMonth(income.targetDate)) % 12 == 0)
                                                    ) &&
                                                    (
                                                        (changeDateFormatWithoutDays(income.targetDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                                                        (changeDateFormatWithoutDays(income.finishDate) == changeDateFormatWithoutDays(this.state.dateMonthChoice)) ||
                                                        (changeDateFormatWithoutDays(income.targetDate) < changeDateFormatWithoutDays(this.state.dateMonthChoice) && changeDateFormatWithoutDays(income.finishDate) > changeDateFormatWithoutDays(this.state.dateMonthChoice))
                                                    )
                                                )
                                        ).slice(0, 5).map(
                                            income =>
                                                <tr key={income.id}>
                                                    <td>{income.description}</td>
                                                    <td>{formatter.format(income.amount)}</td>
                                                </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="container-data-left"></div>
                    <div className="container-data-middle"></div>
                    <div className="container-data-right"></div>
                </div>
            </>
        )
    }
}

export default WelcomeComponent