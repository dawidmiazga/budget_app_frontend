import React, { Component } from "react";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import AuthenticationService from "./AuthenticationService";
import ExpenseDataService from "../../api/HomeBudget/ExpenseDataService";
import IncomeDataService from "../../api/HomeBudget/IncomeDataService.js";
import CategoryDataService from "../../api/HomeBudget/CategoryDataService";
import BudgetDataService from "../../api/HomeBudget/BudgetDataService";

class ChartsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            selectYear: "All",
            welcomeMessage: ''
        }
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshCategories()
        this.refreshBudgets()
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

    refreshCategories() {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username)
            .then(
                response => {
                    this.setState({ categories: response.data })
                }
            )
    }

    refreshBudgets() {
        let username = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(username).then(response => { this.setState({ budgets: response.data }) })
    }

    render() {
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

        const uniqueYear = ([...new Set(this.state.expenses.map(expense => changeDateFormatOnlyYear(expense.targetDate)))]).sort();
        const uniqueMonth = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]

        var totalExpensesPastYear = 0;
        var totalIncomesPastYear = 0;
        var totalExpensesCurrentYear = 0;
        var totalIncomesCurrentYear = 0;

        var today = new Date();
        const currentYear = today.getFullYear();
        const pastYear = currentYear - 1

        var totalBudgetCurrentYear = (this.state.budgets.filter
            (budget => changeDateFormatOnlyYear(budget.targetMonth) == currentYear
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

        var totalBudgetPastYear = (this.state.budgets.filter
            (budget => changeDateFormatOnlyYear(budget.targetMonth) == pastYear
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

        var monthNames = [];
        var TotalValueByMonthExpensesPastYear = [];
        var oneTimeValueForByMonthChartExpensesPastYear = [];
        var byYearValueForByMonthChartExpensesPastYear = [];
        var byMonthValueForByMonthChartExpensesPastYear = [];
        var byHalfYearValueForByMonthChartExpensesPastYear = [];
        var newMthFullDatePast = [];
        var newMthParsedDatePast = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            newMthFullDatePast[i] = new Date(monthNames[i])
            newMthParsedDatePast[i] = changeDateFormatWithoutDays(new Date(pastYear, newMthFullDatePast[i].getMonth()))

            oneTimeValueForByMonthChartExpensesPastYear[i] = (this.state.expenses.filter
                (expense => (expense.cycle == "Nie" && changeDateFormatWithoutDays(expense.targetDate) == newMthParsedDatePast[i])
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byYearValueForByMonthChartExpensesPastYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= newMthParsedDatePast[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= newMthParsedDatePast[i] &&
                    changeDateFormatOnlyMonth(expense.targetDate) == changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByMonthChartExpensesPastYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= newMthParsedDatePast[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= newMthParsedDatePast[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByMonthChartExpensesPastYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonthNumber(monthNames[i]) - changeDateFormatOnlyMonthNumber(expense.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(newMthParsedDatePast[i]) &&
                    changeDateFormatOnlyYear(expense.targetDate) <= pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            TotalValueByMonthExpensesPastYear[i] = byYearValueForByMonthChartExpensesPastYear[i] + byHalfYearValueForByMonthChartExpensesPastYear[i] + byMonthValueForByMonthChartExpensesPastYear[i] + oneTimeValueForByMonthChartExpensesPastYear[i]
            totalExpensesPastYear = totalExpensesPastYear + TotalValueByMonthExpensesPastYear[i]
        }

        var monthNames = [];
        var TotalValueByMonthIncomesPastYear = [];
        var oneTimeValueForByMonthChartIncomesPastYear = [];
        var byYearValueForByMonthChartIncomesPastYear = [];
        var byMonthValueForByMonthChartIncomesPastYear = [];
        var byHalfYearValueForByMonthChartIncomesPastYear = [];
        var newMthFullDatePast = [];
        var newMthParsedDatePast = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            newMthFullDatePast[i] = new Date(monthNames[i])
            newMthParsedDatePast[i] = changeDateFormatWithoutDays(new Date(pastYear, newMthFullDatePast[i].getMonth()))
            oneTimeValueForByMonthChartIncomesPastYear[i] = (this.state.incomes.filter
                (income => (income.cycle == "Nie" && changeDateFormatWithoutDays(income.targetDate) == newMthParsedDatePast[i])
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byYearValueForByMonthChartIncomesPastYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(income.targetDate) <= newMthParsedDatePast[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= newMthParsedDatePast[i] &&
                    changeDateFormatOnlyMonth(income.targetDate) == changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byMonthValueForByMonthChartIncomesPastYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(income.targetDate) <= newMthParsedDatePast[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= newMthParsedDatePast[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byHalfYearValueForByMonthChartIncomesPastYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonthNumber(monthNames[i]) - changeDateFormatOnlyMonthNumber(income.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(income.targetDate) <= changeDateFormatWithoutDays(newMthParsedDatePast[i]) &&
                    changeDateFormatOnlyYear(income.targetDate) <= pastYear
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            TotalValueByMonthIncomesPastYear[i] = byYearValueForByMonthChartIncomesPastYear[i] + byHalfYearValueForByMonthChartIncomesPastYear[i] + byMonthValueForByMonthChartIncomesPastYear[i] + oneTimeValueForByMonthChartIncomesPastYear[i]
            totalIncomesPastYear = totalIncomesPastYear + TotalValueByMonthIncomesPastYear[i]
        }

        var monthNames = [];
        var TotalValueByMonthExpensesCurrentYear = [];
        var oneTimeValueForByMonthChartExpensesCurrentYear = [];
        var byYearValueForByMonthChartExpensesCurrentYear = [];
        var byMonthValueForByMonthChartExpensesCurrentYear = [];
        var byHalfYearValueForByMonthChartExpensesCurrentYear = [];
        var newMthFullDateCurr = [];
        var newMthParsedDateCurr = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            newMthFullDateCurr[i] = new Date(monthNames[i])
            newMthParsedDateCurr[i] = changeDateFormatWithoutDays(new Date(currentYear, newMthFullDateCurr[i].getMonth()))
            oneTimeValueForByMonthChartExpensesCurrentYear[i] = (this.state.expenses.filter
                (expense => (
                    expense.cycle == "Nie" &&
                    changeDateFormatWithoutDays(expense.targetDate) == newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byYearValueForByMonthChartExpensesCurrentYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i] &&
                    changeDateFormatOnlyMonth(expense.targetDate) == changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByMonthChartExpensesCurrentYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(expense.targetDate) <= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(expense.finishDate) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByMonthChartExpensesCurrentYear[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonthNumber(monthNames[i]) - changeDateFormatOnlyMonthNumber(expense.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(newMthParsedDateCurr[i]) &&
                    changeDateFormatOnlyYear(expense.targetDate) <= currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            TotalValueByMonthExpensesCurrentYear[i] = byYearValueForByMonthChartExpensesCurrentYear[i] + byHalfYearValueForByMonthChartExpensesCurrentYear[i] + byMonthValueForByMonthChartExpensesCurrentYear[i] + oneTimeValueForByMonthChartExpensesCurrentYear[i]
            totalExpensesCurrentYear = totalExpensesCurrentYear + TotalValueByMonthExpensesCurrentYear[i]
        }

        var monthNames = [];
        var TotalValueByMonthIncomesCurrentYear = [];
        var oneTimeValueForByMonthChartIncomesCurrentYear = [];
        var byYearValueForByMonthChartIncomesCurrentYear = [];
        var byMonthValueForByMonthChartIncomesCurrentYear = [];
        var byHalfYearValueForByMonthChartIncomesCurrentYear = [];
        var newMthFullDateCurr = [];
        var newMthParsedDateCurr = [];
        for (let i = 0; i < uniqueMonth.length; i++) {
            monthNames[i] = uniqueMonth[i];
            newMthFullDateCurr[i] = new Date(monthNames[i])
            newMthParsedDateCurr[i] = changeDateFormatWithoutDays(new Date(currentYear, newMthFullDateCurr[i].getMonth()))
            oneTimeValueForByMonthChartIncomesCurrentYear[i] = (this.state.incomes.filter
                (income => (
                    income.cycle == "Nie" &&
                    changeDateFormatWithoutDays(income.targetDate) == newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byYearValueForByMonthChartIncomesCurrentYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co rok" &&
                    changeDateFormatWithoutDays(income.targetDate) <= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i] &&
                    changeDateFormatOnlyMonth(income.targetDate) == changeDateFormatOnlyMonth(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byMonthValueForByMonthChartIncomesCurrentYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co miesiac" &&
                    changeDateFormatWithoutDays(income.targetDate) <= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(income.finishDate) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byHalfYearValueForByMonthChartIncomesCurrentYear[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co pol roku" &&
                    (changeDateFormatOnlyMonth(monthNames[i]) - changeDateFormatOnlyMonth(income.targetDate)) % 6 == 0 &&
                    changeDateFormatWithoutDays(Date()) >= newMthParsedDateCurr[i] &&
                    changeDateFormatWithoutDays(income.targetDate) <= changeDateFormatWithoutDays(newMthParsedDateCurr[i]) &&
                    changeDateFormatOnlyYear(income.targetDate) <= currentYear
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            TotalValueByMonthIncomesCurrentYear[i] = byYearValueForByMonthChartIncomesCurrentYear[i] + byHalfYearValueForByMonthChartIncomesCurrentYear[i] + byMonthValueForByMonthChartIncomesCurrentYear[i] + oneTimeValueForByMonthChartIncomesCurrentYear[i]
            totalIncomesCurrentYear = totalIncomesCurrentYear + TotalValueByMonthIncomesCurrentYear[i]
        }

        function getMonthsBetween(finishDateFunction, targetDateFunction, dateToday, targetDateItem) {
            var itemTargetDate = new Date(targetDateItem)
            if (targetDateFunction == currentYear || targetDateFunction == pastYear) {
                targetDateFunction = new Date(targetDateFunction, 0, itemTargetDate.getDate());
            }

            var choosenStartDate = new Date(targetDateFunction);
            var choosenEndDate = new Date(finishDateFunction);
            var currentDate = new Date(dateToday);

            if (choosenEndDate.getMonth() > currentDate.getMonth()) {
                choosenEndDate = currentDate
            }

            var howManyMonths = 0;
            var daysDifference = choosenEndDate.getDate() - choosenStartDate.getDate();
            if (daysDifference < 0) {
                howManyMonths = choosenEndDate.getMonth() - choosenStartDate.getMonth()
            } else {
                howManyMonths = choosenEndDate.getMonth() - choosenStartDate.getMonth() + 1
            }
            return howManyMonths;
        }

        function getHalfYearsBetween(finishDateFunction, targetDateFunction, dateToday, targetDateItem) {
            var itemTargetDate = new Date(targetDateItem)
            if (targetDateFunction == currentYear || targetDateFunction == pastYear) {
                targetDateFunction = new Date(targetDateFunction, 0, itemTargetDate.getDate());
            }

            var choosenStartDate = new Date(targetDateFunction);
            var choosenEndDate = new Date(finishDateFunction);
            var currentDate = new Date(dateToday);

            if (changeDateFormatWithoutDays(choosenEndDate) > changeDateFormatWithoutDays(currentDate)) {
                choosenEndDate = currentDate
            }

            var howManyMonths = 0;
            var daysDifference = choosenEndDate.getDate() - choosenStartDate.getDate();
            if (daysDifference < 0) {
                howManyMonths = choosenEndDate.getMonth() - choosenStartDate.getMonth()
            } else {
                howManyMonths = choosenEndDate.getMonth() - choosenStartDate.getMonth() + 1
            }
            howManyMonths = Math.ceil(howManyMonths / 6)
            return howManyMonths;
        }
        const allCategories = this.state.categories.map(category => category.categoryname);
        const categoriesColor = this.state.categories.map(category => category.hexcolor);

        var categoryNamesPastYear = [];
        var categoriesWithValuesPastYear = [];
        var totalPriceByCatPastYear = [];
        var rgbColorByCategoryPastYear = [];
        var TotalValueByCategoryPastYear = [];
        var oneTimeValueForByCategoryChartPastYear = [];
        var byYearValueForByCategoryChartPastYear = [];
        var byMonthValueForByCategoryChartPastYear1 = [];
        var byMonthValueForByCategoryChartPastYear2 = [];
        var byMonthValueForByCategoryChartPastYear3 = [];
        var byMonthValueForByCategoryChartPastYear4 = [];
        var byHalfYearValueForByCategoryChartPastYear1 = [];
        var byHalfYearValueForByCategoryChartPastYear2 = [];
        var byHalfYearValueForByCategoryChartPastYear3 = [];
        var byHalfYearValueForByCategoryChartPastYear4 = [];

        var j = 0;
        for (let i = 0; i < allCategories.length; i++) {
            categoryNamesPastYear[i] = allCategories[i];

            oneTimeValueForByCategoryChartPastYear[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Nie" &&
                    changeDateFormatOnlyYear(expense.targetDate) == pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byYearValueForByCategoryChartPastYear[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co rok" &&
                    changeDateFormatOnlyYear(expense.targetDate) <= pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) >= pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByCategoryChartPastYear1[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) < pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * 12, 0);

            byMonthValueForByCategoryChartPastYear2[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) == pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (13 - changeDateFormatOnlyMonthNumber(currentItem.targetDate)), 0);

            byMonthValueForByCategoryChartPastYear3[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) == pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.finishDate, currentItem.targetDate)), 0);

            byMonthValueForByCategoryChartPastYear4[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) < pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.targetDate, pastYear)), 0);

            byHalfYearValueForByCategoryChartPastYear1[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) < pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * 2, 0);

            byHalfYearValueForByCategoryChartPastYear2[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) == pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * Math.ceil((13 - changeDateFormatOnlyMonthNumber(currentItem.targetDate)) / 6), 0);

            byHalfYearValueForByCategoryChartPastYear3[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) == pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * Math.ceil(getMonthsBetween(currentItem.finishDate, currentItem.targetDate) / 6), 0);

            byHalfYearValueForByCategoryChartPastYear4[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) < pastYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == pastYear
                )).reduce((total, currentItem) => total = total + currentItem.price * Math.ceil(getMonthsBetween(currentItem.targetDate, pastYear) / 6), 0);

            var checkValuePastYear = 0;
            checkValuePastYear =
                byYearValueForByCategoryChartPastYear[i] +
                byHalfYearValueForByCategoryChartPastYear1[i] +
                byHalfYearValueForByCategoryChartPastYear2[i] +
                byHalfYearValueForByCategoryChartPastYear3[i] +
                byHalfYearValueForByCategoryChartPastYear4[i] +
                byMonthValueForByCategoryChartPastYear1[i] +
                byMonthValueForByCategoryChartPastYear2[i] +
                byMonthValueForByCategoryChartPastYear3[i] +
                byMonthValueForByCategoryChartPastYear4[i] +
                oneTimeValueForByCategoryChartPastYear[i]

            if (checkValuePastYear != 0) {
                rgbColorByCategoryPastYear[j] = categoriesColor[i];
                TotalValueByCategoryPastYear[j] = checkValuePastYear
                totalPriceByCatPastYear[j] = categoryNamesPastYear[i] + ": " + TotalValueByCategoryPastYear[i]
                categoriesWithValuesPastYear[j] = categoryNamesPastYear[i]
                j = j + 1
            }
        }

        var categoryNamesCurrentYear = [];
        var categoriesWithValuesCurrentYear = [];
        var totalPriceByCatCurrentYear = [];
        var rgbColorByCategoryCurrentYear = [];
        var TotalValueByCategoryCurrentYear = [];
        var oneTimeValueForByCategoryChartCurrentYear = [];
        var byYearValueForByCategoryChartCurrentYear = [];
        var byMonthValueForByCategoryChartCurrentYear1 = [];
        var byMonthValueForByCategoryChartCurrentYear2 = [];
        var byMonthValueForByCategoryChartCurrentYear3 = [];
        var byMonthValueForByCategoryChartCurrentYear4 = [];
        var byHalfYearValueForByCategoryChartCurrentYear1 = [];
        var byHalfYearValueForByCategoryChartCurrentYear2 = [];
        var byHalfYearValueForByCategoryChartCurrentYear3 = [];
        var byHalfYearValueForByCategoryChartCurrentYear4 = [];

        var j = 0;
        for (let i = 0; i < allCategories.length; i++) {
            categoryNamesCurrentYear[i] = allCategories[i];

            oneTimeValueForByCategoryChartCurrentYear[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Nie" &&
                    changeDateFormatOnlyYear(expense.targetDate) == currentYear && changeDateFormatWithoutDays(expense.targetDate) <= changeDateFormatWithoutDays(Date())
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byYearValueForByCategoryChartCurrentYear[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co rok" &&
                    changeDateFormatOnlyYear(expense.targetDate) <= currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) >= currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByCategoryChartCurrentYear1[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) < currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.finishDate, currentYear, Date(), currentItem.targetDate)), 0);

            byMonthValueForByCategoryChartCurrentYear2[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) == currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.finishDate, currentItem.targetDate, Date())), 0);

            byMonthValueForByCategoryChartCurrentYear3[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) == currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.finishDate, currentItem.targetDate, Date())), 0);

            byMonthValueForByCategoryChartCurrentYear4[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co miesiac" &&
                    changeDateFormatOnlyYear(expense.targetDate) < currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getMonthsBetween(currentItem.finishDate, currentYear, Date(), currentItem.targetDate)), 0);

            byHalfYearValueForByCategoryChartCurrentYear1[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) < currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getHalfYearsBetween(currentItem.finishDate, currentYear, Date(), currentItem.targetDate)), 0);

            byHalfYearValueForByCategoryChartCurrentYear2[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) == currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) > currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getHalfYearsBetween(currentItem.finishDate, currentItem.targetDate, Date(), currentItem.targetDate)), 0);

            byHalfYearValueForByCategoryChartCurrentYear3[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) == currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getHalfYearsBetween(currentItem.finishDate, currentItem.targetDate, Date(), currentItem.targetDate)), 0);

            byHalfYearValueForByCategoryChartCurrentYear4[i] = this.state.expenses.filter
                (expense => (
                    expense.category == allCategories[i] && expense.cycle == "Co pol roku" &&
                    changeDateFormatOnlyYear(expense.targetDate) < currentYear &&
                    changeDateFormatOnlyYear(expense.finishDate) == currentYear
                )).reduce((total, currentItem) => total = total + currentItem.price * (getHalfYearsBetween(currentItem.finishDate, currentYear, Date(), currentItem.targetDate)), 0);

            var checkValueCurrentYear = 0;
            checkValueCurrentYear =
                byYearValueForByCategoryChartCurrentYear[i] +
                byHalfYearValueForByCategoryChartCurrentYear1[i] +
                byHalfYearValueForByCategoryChartCurrentYear2[i] +
                byHalfYearValueForByCategoryChartCurrentYear3[i] +
                byHalfYearValueForByCategoryChartCurrentYear4[i] +
                byMonthValueForByCategoryChartCurrentYear1[i] +
                byMonthValueForByCategoryChartCurrentYear2[i] +
                byMonthValueForByCategoryChartCurrentYear3[i] +
                byMonthValueForByCategoryChartCurrentYear4[i] +
                oneTimeValueForByCategoryChartCurrentYear[i]

            if (checkValueCurrentYear != 0) {
                rgbColorByCategoryCurrentYear[j] = categoriesColor[i];
                TotalValueByCategoryCurrentYear[j] = checkValueCurrentYear
                totalPriceByCatCurrentYear[j] = categoryNamesCurrentYear[i] + ": " + TotalValueByCategoryCurrentYear[i]
                categoriesWithValuesCurrentYear[j] = categoryNamesCurrentYear[i]
                j = j + 1
            }
        }
        
        const dataByMonthExpPastYear = {
            labels: monthNames,
            datasets: [{
                label: 'Wydatki',
                data: TotalValueByMonthExpensesPastYear,
                backgroundColor: '#2177ef'
            },
            {
                label: 'Przychody',
                data: TotalValueByMonthIncomesPastYear,
                backgroundColor: '#333',
            }]
        };

        const dataByMonthExpCurrentYear = {
            labels: monthNames,
            datasets: [{
                label: 'Wydatki',
                data: TotalValueByMonthExpensesCurrentYear,
                backgroundColor: '#2177ef',

            },
            {
                label: 'Przychody',
                data: TotalValueByMonthIncomesCurrentYear,
                backgroundColor: '#333',
            }]
        };
        
        const dataByCategoryPastYear = {
            labels: categoriesWithValuesPastYear,
            datasets: [{
                data: TotalValueByCategoryPastYear,
                backgroundColor: rgbColorByCategoryPastYear,
            }]
        };

        const dataByCategoryCurrentYear = {
            labels: categoriesWithValuesCurrentYear,
            datasets: [{
                data: TotalValueByCategoryCurrentYear,
                backgroundColor: rgbColorByCategoryCurrentYear,
            }]
        };

        const dataForSavingsFromBudgetsPastYear = {
            labels: [pastYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExpensesPastYear],
                backgroundColor: '#b41010',
            },
            {
                label: 'Budzet',
                data: [totalBudgetPastYear],
                backgroundColor: '#1d6c2b',
            }]
        };

        const dataForSavingsFromIncomesPastYear = {
            labels: [pastYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExpensesPastYear],
                backgroundColor: '#b41010',
            },
            {
                label: 'Przychody',
                data: [totalIncomesPastYear],
                backgroundColor: '#1d6c2b',
            }]
        };

        const dataForSavingsFromBudgetsCurrentYear = {
            labels: [currentYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExpensesCurrentYear],
                backgroundColor: '#b41010',
            },
            {
                label: 'Budzet',
                data: [totalBudgetCurrentYear],
                backgroundColor: '#1d6c2b',
            }]
        };

        const dataForSavingsFromIncomesCurrentYear = {
            labels: [currentYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExpensesCurrentYear],
                backgroundColor: '#b41010',
            },
            {
                label: 'Przychody',
                data: [totalIncomesCurrentYear],
                backgroundColor: '#1d6c2b',
            }]
        };
        const optionsBar2 = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
        }

        const optionsBar = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                }
            },
        }

        const optionsLine = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
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
                    <div className="container-stats-middle2">
                        <div className="text-35px-white">
                            Podzial wydatkow i przychodow w:
                        </div>
                    </div>
                    <div className="container-stats-year">
                        <div className="container-stats-middle2">
                            <div className="text-30px-white">
                                {currentYear} roku
                            </div>
                        </div>

                        <div className="container-stats-left" >
                            <div className="text-25px-white">
                                Na kategorie
                            </div>
                        </div>
                        <div className="container-stats-middle" >
                            <div className="text-25px-white">
                                Na miesiac
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            <div className="text-25px-white">
                                Oszczednosci
                            </div>
                        </div>
                        <div className="container-stats-left" >
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCategoryCurrentYear}
                                    height={280}
                                    options={optionsDon}
                                />
                            </div>
                        </div>
                        <div className="container-stats-middle">
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByMonthExpCurrentYear}
                                    height={280}
                                    options={optionsBar}
                                />
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            <div className="text-20px-white">
                                Rzeczywiste: {formatter.format(totalIncomesCurrentYear - totalExpensesCurrentYear)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromIncomesCurrentYear}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                                Zalozone: {formatter.format(totalBudgetCurrentYear - totalExpensesCurrentYear)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromBudgetsCurrentYear}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-stats-year">
                        <div className="container-stats-middle2" >
                            <div className="text-30px-white">
                                {pastYear} roku
                            </div>
                        </div>
                        <div className="container-stats-left" >
                            <div className="text-25px-white">
                                Na kategorie
                            </div>
                        </div>
                        <div className="container-stats-middle" >
                            <div className="text-25px-white">
                                Na miesiac
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            <div className="text-25px-white">
                                Oszczednosci
                            </div>
                        </div>
                        <div className="container-stats-left" >
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCategoryPastYear}
                                    height={280}
                                    options={optionsDon}
                                />
                            </div>
                        </div>
                        <div className="container-stats-middle">
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByMonthExpPastYear}
                                    height={280}
                                    options={optionsBar}
                                />
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            <div className="text-20px-white">
                                Rzeczywiste: {formatter.format(totalIncomesPastYear - totalExpensesPastYear)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromIncomesPastYear}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                                Zalozone: {formatter.format(totalBudgetPastYear - totalExpensesPastYear)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromBudgetsPastYear}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="content">
                        {/* {listAmounts} */}
                    </div>
                    <div id="footer">

                    </div>
                </div>
                <div className="container">

                </div>
            </>
        )
    }
}

export default ChartsComponent
