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
import btnToday from '../images/today_button.png';
import LoginDataService from '../../api/HomeBudget/LoginDataService.js';
import { toBeRequired } from "@testing-library/jest-dom/dist/matchers";

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
            users: [],
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
        this.changeToCurrMonth = this.changeToCurrMonth.bind(this)
        this.changeMth = this.changeMth.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshBudgets()
        this.refreshCategories()
        this.refreshMonth()
        this.refreshUsers()
    }

    refreshUsers() {
        LoginDataService.retrieveAllLogins()
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    }

    refreshMonth() {
        var choosenMonth = "2022-07"//moment(Date()).format("YYYY-MM")
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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ expenses: response.data })
                }
            )
    }

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ incomes: response.data })
                }
            )
    }

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid).then(response => { this.setState({ budgets: response.data }) })
    }

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid).then(response => { this.setState({ categories: response.data }) })
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

    changeMth(type) {
        console.log(type)
        var currMth;
        if (type == "curr") {
            currMth = moment(Date()).format("YYYY-MM")
        } else {
            currMth = document.getElementById('monthChoiceFilter').value
            if (currMth == "") { return }
            var newMth = new Date(currMth);
            newMth.setDate(1);
            if (type == "prev") {
                newMth.setMonth(newMth.getMonth() - 1);
            } else if (type = "next") {
                newMth.setMonth(newMth.getMonth() + 1);
            }
            newMth = moment(newMth).format("YYYY-MM")
        }
        document.getElementById('monthChoiceFilter').value = newMth;
        this.setState({ dateMonthChoice: newMth, })
    }

    changeToPrevMonth() {
        const currMth = document.getElementById('monthChoiceFilter').value
        if (currMth == "") { return }
        var prevMth = new Date(currMth);
        prevMth.setDate(1);
        prevMth.setMonth(prevMth.getMonth() - 1);
        prevMth = moment(prevMth).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = prevMth;
        this.setState({ dateMonthChoice: prevMth, })
    }

    changeToCurrMonth() {
        const currMth = moment(Date()).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = currMth;
        this.setState({ dateMonthChoice: currMth, })
    }

    changeToNextMonth() {
        const currMth = document.getElementById('monthChoiceFilter').value;
        if (currMth == "") { return }
        var nextMth = new Date(currMth);
        nextMth.setDate(1);
        nextMth.setMonth(nextMth.getMonth() + 1);
        nextMth = moment(nextMth).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = nextMth;
        this.setState({ dateMonthChoice: nextMth, })
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

        function categoryMap(id, categoryList) {
            const arrCat = ([(categoryList.map(category => category.categoryname)), (categoryList.map(category => category.categoryid))]);
            if (arrCat[1].includes(id)) {
                var idCurrentCat = arrCat[0][arrCat[1].indexOf(id)]
                return idCurrentCat;
            } else {
                return "N/A";
            }
        }

        function userMap(id, userList) {
            const arrUser = ([(userList.map(user => user.username)), (userList.map(user => user.usernameid))]);
            var newID = Number(id)
            if (arrUser[1].includes(newID)) {
                var idCurrentUser = arrUser[0][arrUser[1].indexOf(newID)]
                return idCurrentUser;
            } else {
                return "N/A";
            }
        }

        if (this.state.dateMonthChoiceAllFromMth == "") {
            this.state.dateMonthChoiceAllFromMth = new Date("1111-12-31")
        }

        if (this.state.dateMonthChoiceAllToMth == "") {
            this.state.dateMonthChoiceAllToMth = new Date("9999-12-31")
        }

        // function dateFormat(dateToChange, newForamt) {
        //     var datePrased;
        //     if (newForamt == "yyyymmdd") {
        //         datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM-DD");
        //     } else if (newForamt == "yyyymm") {
        //         datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM");
        //     } else if (newForamt == "yyyy") {
        //         datePrased = moment(Date.parse(dateToChange)).format("YYYY");
        //     } else if (newForamt == "mm") {
        //         datePrased = moment(Date.parse(dateToChange)).format("MM");
        //     } else if (newForamt == "m") {
        //         datePrased = moment(Date.parse(dateToChange)).format("M");
        //     }
        //     return datePrased;
        // }

        function newDateYYYYMMDD(dateToChange) {
            var datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM-DD");
            return datePrased;
        }
        function newDateYYYYMM(dateToChange) {
            var datePrased = moment(Date.parse(dateToChange)).format("YYYY-MM");
            return datePrased;
        }
        function newDateYYYY(dateToChange) {
            var datePrased = moment(Date.parse(dateToChange)).format("YYYY");
            return datePrased;
        }
        function newDateMM(dateToChange) {
            var datePrased = moment(Date.parse(dateToChange)).format("MM");
            return datePrased;
        }
        function newDateM(dateToChange) {
            var datePrased = moment(Date.parse(dateToChange)).format("M");
            return datePrased;
        }

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        function cycleCount(target_date, finish_date, startDate, endDate, whatCycle, nazwa, cena) {
            var target_date = new Date(target_date);
            var finish_date = new Date(finish_date);
            var startDate = new Date(startDate);
            var endDate = new Date(endDate);

            var mthCnt = 0;
            var mthCntPrep = 0;
            var yrCnt = 0;

            if (startDate <= endDate) {
                if (startDate < target_date) {
                    startDate = target_date
                }

                if (endDate > finish_date) {
                    endDate = finish_date
                }

                if (whatCycle == "Co miesiac") {
                    yrCnt = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                    mthCnt = yrCnt + endDate.getMonth() - startDate.getMonth() + 1
                } else {
                    var divideNr
                    if (whatCycle == "Co pol roku") {
                        divideNr = 6
                    } else if (whatCycle == "Co rok") {
                        divideNr = 12
                    }

                    if ((startDate.getMonth() - target_date.getMonth()) % divideNr != 0) {
                        if (startDate.getMonth() < target_date.getMonth()) {
                            startDate = new Date(startDate.setMonth(target_date.getMonth()))
                        } else {
                            startDate = new Date(startDate.setMonth(target_date.getMonth() + divideNr))
                        }
                    }

                    yrCnt = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                    mthCntPrep = yrCnt + endDate.getMonth() - startDate.getMonth()
                    mthCnt += Math.ceil(mthCntPrep / divideNr)

                    if ((endDate.getMonth() - target_date.getMonth()) % divideNr == 0) {
                        mthCnt += 1
                    }
                }
            }
            if (mthCnt < 0) { mthCnt = 0 }
            // if (whatCycle=="Co miesiac") {console.log(mthCnt)}
            // console.log("================================")
            return mthCnt;
        }

        function dateFilter(targetDate, finishDate, choosenDate, expType) {

            targetDate = newDateYYYYMM(targetDate)
            finishDate = newDateYYYYMM(finishDate)

            if (choosenDate < targetDate || choosenDate > finishDate) { return false }
            if (expType == "Nie") {
                if (newDateYYYYMM(targetDate) == newDateYYYYMM(choosenDate)) {
                    return true;
                } else { return false; }
            } else if ((newDateYYYYMM(targetDate) == newDateYYYYMM(choosenDate)) || (newDateYYYYMM(finishDate) == newDateYYYYMM(choosenDate)) || (newDateYYYYMM(targetDate) < newDateYYYYMM(choosenDate) && (finishDate) > newDateYYYYMM(choosenDate)) == true) {
                if (expType == "Co miesiac") {
                    return true;
                } else if (expType == "Co pol roku") {
                    if (((newDateMM(choosenDate) - newDateMM(targetDate)) % 6) == 0) {
                        return true;
                    } else { return false; }
                } else if (expType == "Co rok") {
                    if (((newDateMM(choosenDate) - newDateMM(targetDate)) % 12) == 0) {
                        return true;
                    } else { return false; }
                }
            } else { return false; }

        }
        //daysLeftCount(this.state.dateMonthChoice)
        function daysLeftCount(choosenDate) {
            var todayDay = new Date()
            choosenDate = new Date(choosenDate);
            choosenDate = new Date(choosenDate.getFullYear(), choosenDate.getMonth() + 1, 0);

            return (choosenDate.getDate() - todayDay.getDate() + 1);

        }

        const uniqueMonth = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]
        const uniqueMonth2 = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"]

        var totalExpenses;
        if (this.state.dateMonthChoice == "") {
            totalExpenses = 0;
        } else {
            totalExpenses = (this.state.expenses.filter(expense => (
                dateFilter(expense.target_date, expense.finish_date, this.state.dateMonthChoice, expense.cycle)
            )).reduce((total, currentItem) => total = total + currentItem.price, 0));
        }

        var totalIncomes;
        if (this.state.dateMonthChoice == "") {
            totalIncomes = 0;
        } else {
            totalIncomes = (this.state.incomes.filter(income => (
                dateFilter(income.target_date, income.finish_date, this.state.dateMonthChoice, income.cycle)
            )).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var totalCycleIncomesTillDate;
        var totalSingleIncomesTillDate;
        var totalIncomesTillDate;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalIncomesTillDate = 0;
        } else {
            totalCycleIncomesTillDate = (this.state.incomes.filter(income => income.cycle != "Nie"
            ).reduce((total, currentItem) => total = total + currentItem.amount *
                cycleCount(currentItem.target_date, currentItem.finish_date, newDateYYYYMMDD(this.state.dateMonthChoiceAllFromMth), newDateYYYYMMDD(this.state.dateMonthChoiceAllToMth), currentItem.cycle, currentItem.description, currentItem.amount), 0));

            totalSingleIncomesTillDate = (this.state.incomes.filter
                (income =>
                    income.cycle == "Nie" &&
                    newDateYYYYMM(income.target_date) >= newDateYYYYMM(this.state.dateMonthChoiceAllFromMth) &&
                    newDateYYYYMM(income.target_date) <= newDateYYYYMM(this.state.dateMonthChoiceAllToMth)
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
                cycleCount(currentItem.target_date, currentItem.finish_date, newDateYYYYMMDD(this.state.dateMonthChoiceAllFromMth), newDateYYYYMMDD(this.state.dateMonthChoiceAllToMth), currentItem.cycle, currentItem.description, currentItem.price), 0));

            totalSingleExpensesTillDate = (this.state.expenses.filter
                (expense =>
                    expense.cycle == "Nie" &&
                    newDateYYYYMM(expense.target_date) >= newDateYYYYMM(this.state.dateMonthChoiceAllFromMth) &&
                    newDateYYYYMM(expense.target_date) <= newDateYYYYMM(this.state.dateMonthChoiceAllToMth)
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            totalExpensesTillDate = totalCycleExpensesTillDate + totalSingleExpensesTillDate
        }

        var totalBudgets;
        if (this.state.dateMonthChoice == "") {
            totalBudgets = 0;
        } else {
            totalBudgets = (this.state.budgets.filter(budget =>
                newDateYYYYMM(budget.target_month) == newDateYYYYMM(this.state.dateMonthChoice)
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var totalBudgetsTillDate;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalBudgetsTillDate = 0;
        } else {
            totalBudgetsTillDate = (this.state.budgets.filter(
                budget =>
                    newDateYYYYMM(budget.target_month) >= newDateYYYYMM(this.state.dateMonthChoiceAllFromMth) &&
                    newDateYYYYMM(budget.target_month) <= newDateYYYYMM(this.state.dateMonthChoiceAllToMth)
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
            testDate2CurrentYear[i] = newDateYYYYMM(new Date(moment(this.state.dateMonthChoice).format("YYYY"), testDateCurrentYear[i].getMonth()))
            oneTimeValueForByMonthChartExpenses[i] = (this.state.expenses.filter
                (expense => (
                    expense.cycle == "Nie" &&
                    newDateYYYYMM(expense.target_date) == testDate2CurrentYear[i] //&&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0));

            byYearValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co rok" &&
                    newDateYYYYMM(expense.target_date) <= testDate2CurrentYear[i] &&
                    newDateYYYYMM(expense.finish_date) >= testDate2CurrentYear[i] &&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    newDateMM(expense.target_date) == newDateMM(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co miesiac" &&
                    newDateYYYYMM(expense.target_date) <= testDate2CurrentYear[i] &&
                    newDateYYYYMM(expense.finish_date) >= testDate2CurrentYear[i]// &&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByMonthChartExpenses[i] = this.state.expenses.filter
                (expense => (
                    expense.cycle == "Co pol roku" &&
                    (newDateM(monthNames[i]) - newDateM(expense.target_date)) % 6 == 0 &&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    newDateYYYYMM(expense.target_date) <= newDateYYYYMM(testDate2CurrentYear[i]) &&
                    newDateYYYY(expense.target_date) <= newDateYYYY(this.state.dateMonthChoice)
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
            testDate2CurrentYear[i] = newDateYYYYMM(new Date(moment(this.state.dateMonthChoice).format("YYYY"), testDateCurrentYear[i].getMonth()))
            oneTimeValueForByMonthChartIncomes[i] = (this.state.incomes.filter
                (income => (
                    income.cycle == "Nie" &&
                    newDateYYYYMM(income.target_date) == testDate2CurrentYear[i] //&&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0));

            byYearValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co rok" &&
                    newDateYYYYMM(income.target_date) <= testDate2CurrentYear[i] &&
                    newDateYYYYMM(income.finish_date) >= testDate2CurrentYear[i] &&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    newDateMM(income.target_date) >= newDateMM(monthNames[i])
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byMonthValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co miesiac" &&
                    newDateYYYYMM(income.target_date) <= testDate2CurrentYear[i] &&
                    newDateYYYYMM(income.finish_date) >= testDate2CurrentYear[i] //&&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i]
                )).reduce((total, currentItem) => total = total + currentItem.amount, 0);

            byHalfYearValueForByMonthChartIncomes[i] = this.state.incomes.filter
                (income => (
                    income.cycle == "Co pol roku" &&
                    (newDateMM(monthNames[i]) - newDateMM(income.target_date)) % 6 == 0 &&
                    // changeDateFormatWithoutDays(Date()) >= testDate2CurrentYear[i] &&
                    newDateYYYYMM(income.target_date) <= newDateYYYYMM(testDate2CurrentYear[i]) &&
                    newDateYYYY(income.target_date) <= newDateYYYY(this.state.dateMonthChoice)
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
                    categoryMap(expense.category, this.state.categories) == allCategories[i] && expense.cycle == "Nie" &&
                    newDateYYYYMM(expense.target_date) == newDateYYYYMM(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byYearValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    categoryMap(expense.category, this.state.categories) == allCategories[i] && expense.cycle == "Co rok" &&
                    newDateYYYY(expense.target_date) <= newDateYYYY(this.state.dateMonthChoice) &&
                    newDateYYYY(expense.finish_date) >= newDateYYYY(this.state.dateMonthChoice) &&
                    newDateMM(expense.target_date) == newDateMM(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byMonthValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    categoryMap(expense.category, this.state.categories) == allCategories[i] && expense.cycle == "Co miesiac" &&
                    newDateYYYYMM(expense.target_date) <= newDateYYYYMM(this.state.dateMonthChoice) &&
                    newDateYYYYMM(expense.finish_date) >= newDateYYYYMM(this.state.dateMonthChoice)
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);

            byHalfYearValueForByCategoryChart[i] = this.state.expenses.filter
                (expense => (
                    categoryMap(expense.category, this.state.categories) == allCategories[i] && expense.cycle == "Co pol roku" &&
                    (newDateMM(this.state.dateMonthChoice) - newDateMM(expense.target_date)) % 6 == 0 &&
                    newDateYYYYMM(expense.target_date) <= newDateYYYYMM(this.state.dateMonthChoice) &&
                    newDateYYYYMM(expense.finish_date) >= newDateYYYYMM(this.state.dateMonthChoice)
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
                    {/* <div className="hb-row"> */}
                    <div className="container-data-left">
                        <div className="container-height-100">
                            <div className="text-20px-white">
                                Wybierz miesiac
                            </div>
                            <div>
                                <img src={btnBack} width="30" height="30" onClick={this.changeToPrevMonth} />
                                <input type="month" id="monthChoiceFilter" onChange={this.filterDataMonth} data-date-format="MM YYYY"></input>
                                <img src={btnNext} width="30" height="30" onClick={this.changeToNextMonth} />
                                <img src={btnToday} width="30" height="30" onClick={this.changeToCurrMonth} />
                            </div>
                        </div>
                        <div className="container-container-middle2">
                            Wydatki do budzetu
                        </div>
                        <div
                            className={redBgForSavingsFromBudgets ? 'container-container-middle-red' : 'container-container-middle-green'}
                            style={{ display: (totalBudgets != 0 && totalExpenses != 0 ? 'block' : 'none') }}>

                            {formatter.format(totalExpenses)}/{formatter.format(totalBudgets)}<br />
                            Pozostało: {formatter.format(totalBudgets - totalExpenses)}
                            {" ("}Na dzień: {formatter.format((totalBudgets - totalExpenses) / daysLeftCount(this.state.dateMonthChoice))}{")"}

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
                        <div className="container-height-100">
                            <div className="text-40px-white">
                                {/* Witaj {userMap(AuthenticationService.getLoggedInUserName(), this.state.users)}!<br /> */}
                                Oto Twoje podsumowanie:
                            </div>
                        </div>
                        <div className="container-container-middle2">
                            Wydatki do przychodow
                        </div>
                        <div
                            className={redBgForSavingsFromIncomes ? 'container-container-middle-red' : 'container-container-middle-green'}
                            style={{ display: (totalIncomes != 0 && totalExpenses != 0 ? 'block' : 'none') }}>

                            {formatter.format(totalExpenses)}/{formatter.format(totalIncomes)}<br />
                            Pozostało: {formatter.format(totalIncomes - totalExpenses)}
                            {" ("}Na dzień: {formatter.format((totalIncomes - totalExpenses) / daysLeftCount(this.state.dateMonthChoice))}{")"}

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
                        <div className="text-20px-white">
                            Bilans<br />
                            od:
                            <input type="month" id="monthChoiceFilterAllFromMth" onChange={this.filterDataMonthAllFromMth}></input>
                            do:
                            <input type="month" id="monthChoiceFilterAllToMth" onChange={this.filterDataMonthAllToMth}></input>
                        </div>

                        <div className="container-savings-left">
                            Oszczednosci zalozone: <br />
                        </div>

                        <div className={redBgForSavingsFromBudgets1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {totalBudgetsTillDate} / {totalExpensesTillDate}
                        </div>

                        <div className="container-savings-left">
                            Oszczednosci rzeczywiste: <br />
                        </div>

                        <div className={redBgForSavingsFromIncomes1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {totalIncomesTillDate} / {totalExpensesTillDate}
                            {/* {formatter.format(totalIncomesTillDate - totalExpensesTillDate)} */}
                        </div>

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
                                                ((expense.cycle == "Nie" && newDateYYYYMM(expense.target_date) == newDateYYYYMM(this.state.dateMonthChoice)))
                                                || (expense.cycle == "Co miesiac" ||
                                                    (expense.cycle == "Co pol roku" && (newDateMM(this.state.dateMonthChoice) - newDateMM(expense.target_date)) % 6 == 0) ||
                                                    (expense.cycle == "Co rok" && (newDateMM(this.state.dateMonthChoice) - newDateMM(expense.target_date)) % 12 == 0))
                                                &&
                                                ((newDateYYYYMM(expense.target_date) == newDateYYYYMM(this.state.dateMonthChoice)) ||
                                                    (newDateYYYYMM(expense.finish_date) == newDateYYYYMM(this.state.dateMonthChoice)) ||
                                                    (newDateYYYYMM(expense.target_date) < newDateYYYYMM(this.state.dateMonthChoice) && newDateYYYYMM(expense.finish_date) > newDateYYYYMM(this.state.dateMonthChoice)))
                                            )
                                    ).slice(0, 5).map(expense =>
                                        <tr key={expense.expenseid}>
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
                                                    newDateYYYYMM(income.target_date) == newDateYYYYMM(this.state.dateMonthChoice)))
                                                || (
                                                    income.cycle == "Co miesiac" ||
                                                    (income.cycle == "Co pol roku" && (newDateMM(this.state.dateMonthChoice) - newDateMM(income.target_date)) % 6 == 0) ||
                                                    (income.cycle == "Co rok" && (newDateMM(this.state.dateMonthChoice) - newDateMM(income.target_date)) % 12 == 0)
                                                ) &&
                                                (
                                                    (newDateYYYYMM(income.target_date) == newDateYYYYMM(this.state.dateMonthChoice)) ||
                                                    (newDateYYYYMM(income.finish_date) == newDateYYYYMM(this.state.dateMonthChoice)) ||
                                                    (newDateYYYYMM(income.target_date) < newDateYYYYMM(this.state.dateMonthChoice) && newDateYYYYMM(income.finish_date) > newDateYYYYMM(this.state.dateMonthChoice))
                                                )
                                            )
                                    ).slice(0, 5).map(
                                        income =>
                                            <tr key={income.incomeid}>
                                                <td>{income.description}</td>
                                                <td>{formatter.format(income.amount)}</td>
                                            </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* </div> */}
                    <div className="container-data-left"></div>
                    <div className="container-data-middle"></div>
                    <div className="container-data-right"></div>
                </div>
            </>
        )
    }
}

export default WelcomeComponent