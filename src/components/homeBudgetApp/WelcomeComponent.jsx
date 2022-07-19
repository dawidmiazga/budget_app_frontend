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

//blue #044B8D

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
        // console.log(type)
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

        if (this.state.dateMonthChoiceAllFromMth == "") {
            this.state.dateMonthChoiceAllFromMth = new Date("1111-12-31")
        }

        if (this.state.dateMonthChoiceAllToMth == "") {
            this.state.dateMonthChoiceAllToMth = new Date("9999-12-31")
        }

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        const formatPercentage = (value, locale = "en-GB") => {
            return Intl.NumberFormat(locale, {
                style: "percent",
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            }).format(value);
        };

        const arrMthEng = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]
        const arrMthPol = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"]

        function categoryMap(id, categoryList) {
            const arrCat = ([
                (categoryList.map(category => category.categoryname)),
                (categoryList.map(category => category.categoryid))
            ]);
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

        function cycleCount(target_date, finish_date, startDate, endDate, whatCycle, nazwa, cena) {
            var target_date = new Date(target_date);
            var finish_date = new Date(finish_date);
            var startDate = new Date(startDate);
            var endDate = new Date(endDate);

            var firstDayStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            var lastDayEndDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

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
                if (whatCycle == "Nie" &&
                    newDateYYYYMMDD(target_date) >= newDateYYYYMMDD(firstDayStartDate) &&
                    newDateYYYYMMDD(target_date) <= newDateYYYYMMDD(lastDayEndDate)
                ) {
                    mthCnt += 1
                } else if (whatCycle == "Nie" && (
                    newDateYYYYMMDD(target_date) >= newDateYYYYMMDD(firstDayStartDate) ||
                    newDateYYYYMMDD(target_date) <= newDateYYYYMMDD(lastDayEndDate))
                ) {
                    mthCnt = 0
                } else if (whatCycle == "Co miesiac") {
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

        function daysLeftCount(choosenDate) {
            var todayDay = new Date()
            choosenDate = new Date(choosenDate);
            choosenDate = new Date(choosenDate.getFullYear(), choosenDate.getMonth() + 1, 0);
            return (choosenDate.getDate() - todayDay.getDate() + 1);
        }

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

        var totalIncomesBetweendDates;

        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalIncomesBetweendDates = 0;
        } else {
            totalIncomesBetweendDates = (this.state.incomes.reduce((total, currentItem) => total = total + currentItem.amount *
                cycleCount(
                    currentItem.target_date,
                    currentItem.finish_date,
                    newDateYYYYMMDD(this.state.dateMonthChoiceAllFromMth),
                    newDateYYYYMMDD(this.state.dateMonthChoiceAllToMth),
                    currentItem.cycle,
                    currentItem.description,
                    currentItem.amount
                ), 0));
        }

        var totalExpensesBetweendDates;
        if (this.state.dateMonthChoiceAllFromMth == "" || this.state.dateMonthChoiceAllToMth == "") {
            totalExpensesBetweendDates = 0;
        } else {
            totalExpensesBetweendDates = (this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price *
                cycleCount(
                    currentItem.target_date,
                    currentItem.finish_date,
                    newDateYYYYMMDD(this.state.dateMonthChoiceAllFromMth),
                    newDateYYYYMMDD(this.state.dateMonthChoiceAllToMth),
                    currentItem.cycle,
                    currentItem.description,
                    currentItem.price
                ), 0));
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

        var totalExpensesByMonth = [];
        var totalIncomesByMonth = [];
        var newDateParsed = [];

        function checkIfRecordIsInTheMonth(cycle, targetDate, finishDate, CurrMonth, ChoosenMonth) {
            if (cycle == "Nie") {
                if (newDateYYYYMM(targetDate) == CurrMonth) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co miesiac") {
                if (newDateYYYYMM(targetDate) <= CurrMonth &&
                    newDateYYYYMM(finishDate) >= CurrMonth) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co pol roku") {
                if ((newDateM(CurrMonth) - newDateM(targetDate)) % 6 == 0 &&
                    newDateYYYYMM(targetDate) <= newDateYYYYMM(CurrMonth) &&
                    newDateYYYY(targetDate) <= newDateYYYY(ChoosenMonth)) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co rok") {
                if (newDateYYYYMM(targetDate) <= CurrMonth &&
                    newDateYYYYMM(finishDate) >= CurrMonth &&
                    newDateMM(targetDate) == newDateMM(CurrMonth)) {
                    return true;
                } else { return false; }
            }
        }

        for (let i = 0; i < arrMthEng.length; i++) {

            newDateParsed[i] = newDateYYYYMM(
                new Date(
                    newDateYYYY(this.state.dateMonthChoice),
                    new Date(arrMthEng[i]).getMonth()
                )
            )
            totalExpensesByMonth[i] = this.state.expenses.filter
                (expense => (checkIfRecordIsInTheMonth(expense.cycle, expense.target_date, expense.finish_date,
                    newDateParsed[i], this.state.dateMonthChoice)) == true
                ).reduce((total, currentItem) => total = total + currentItem.price, 0);
        }

        for (let i = 0; i < arrMthEng.length; i++) {
            newDateParsed[i] = newDateYYYYMM(
                new Date(
                    newDateYYYY(this.state.dateMonthChoice),
                    new Date(arrMthEng[i]).getMonth()
                )
            )
            totalIncomesByMonth[i] = this.state.incomes.filter
                (income => (checkIfRecordIsInTheMonth(income.cycle, income.target_date, income.finish_date,
                    newDateParsed[i], this.state.dateMonthChoice)) == true
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0);

        }

        const allCategories = this.state.categories.map(category => category.categoryname);
        const categoriesColor = this.state.categories.map(category => category.hexcolor);

        var categoriesWithValues = [];

        function forCategories(expCategory, allCategories, currCategory, cycle, choosenMth, targetDate, finishDate) {
            if (cycle == "Nie") {
                if (categoryMap(expCategory, allCategories) == currCategory &&
                    newDateYYYYMM(targetDate) == newDateYYYYMM(choosenMth)) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co miesiac") {
                if (categoryMap(expCategory, allCategories) == currCategory &&
                    newDateYYYYMM(targetDate) <= newDateYYYYMM(choosenMth) &&
                    newDateYYYYMM(finishDate) >= newDateYYYYMM(choosenMth)) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co pol roku") {
                if (categoryMap(expCategory, allCategories) == currCategory &&
                    (newDateMM(choosenMth) - newDateMM(targetDate)) % 6 == 0 &&
                    newDateYYYYMM(targetDate) <= newDateYYYYMM(choosenMth) &&
                    newDateYYYYMM(finishDate) >= newDateYYYYMM(choosenMth)) {
                    return true;
                } else { return false; }
            } else if (cycle == "Co rok") {
                if (categoryMap(expCategory, allCategories) == currCategory &&
                    newDateYYYY(targetDate) <= newDateYYYY(choosenMth) &&
                    newDateYYYY(finishDate) >= newDateYYYY(choosenMth) &&
                    newDateMM(targetDate) == newDateMM(choosenMth)) {
                    return true;
                } else { return false; }
            }
        }

        var totalPriceByCat = [];
        var rgbColorByCategory = [];
        var totalValueByCategory = [];
        var j = 0;
        var checkValue = 0;
        var checkValue2 = [];

        for (let i = 0; i < allCategories.length; i++) {
            checkValue2[i] = this.state.expenses.filter
                (expense => (
                    forCategories(expense.category, this.state.categories, allCategories[i], expense.cycle, this.state.dateMonthChoice,
                        expense.target_date, expense.finish_date) == true
                )).reduce((total, currentItem) => total = total + currentItem.price, 0);
            checkValue = checkValue2[i]
            if (checkValue != 0) {
                rgbColorByCategory[j] = categoriesColor[i];
                totalValueByCategory[j] = checkValue2[i]
                totalPriceByCat[j] = allCategories[i] + ": " + totalValueByCategory[i]
                categoriesWithValues[j] = allCategories[i]
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
        if ((totalIncomesBetweendDates - totalExpensesBetweendDates) >= 0) { redBgForSavingsFromIncomes1 = false; }
        else { redBgForSavingsFromIncomes1 = true; }

        let redBgForSavingsFromBudgets1;
        if ((totalBudgetsTillDate - totalExpensesBetweendDates) >= 0) { redBgForSavingsFromBudgets1 = false; }
        else { redBgForSavingsFromBudgets1 = true; }

        const dataByMonth = {
            labels: arrMthPol,
            datasets: [{
                label: 'Wydatki',
                data: totalExpensesByMonth,
                backgroundColor: '#2177ef',
            },
            {
                label: 'Przychody',
                data: totalIncomesByMonth,
                backgroundColor: '#333',
            }]
        };
        const dataByCategory = {
            labels: categoriesWithValues,
            datasets: [{
                hoverOffset: 20,
                data: totalValueByCategory,
                backgroundColor: rgbColorByCategory,
            }]
        };
        const dataExpToBud = {
            labels: ["Wydano: ", "Pozostało: "],
            datasets: [{
                borderWidth: 0,
                cutout: 130,
                circumference: 180,
                rotation: -90,
                data: [totalExpenses, totalBudgets - totalExpenses],
                backgroundColor: ['#2177ef', '#4a4a4a'],
            }]
        };
        const dataExpToInc = {
            labels: ["Wydano: ", "Pozostało: "],
            datasets: [{
                borderWidth: 0,
                cutout: 130,
                circumference: 180,
                rotation: -90,
                data: [totalExpenses, totalIncomes - totalExpenses],
                backgroundColor: ['#2177ef', '#4a4a4a'],
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
        const optionsDonNoLabels = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
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
                                <img src={btnBack} onClick={this.changeToPrevMonth} />
                                <input type="month" id="monthChoiceFilter" onChange={this.filterDataMonth} data-date-format="MM YYYY"></input>
                                <img src={btnNext} onClick={this.changeToNextMonth} />
                                <img src={btnToday} width="50" height="50" onClick={this.changeToCurrMonth} />
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
                            {formatter.format(totalBudgetsTillDate)} / {formatter.format(totalExpensesBetweendDates)}
                        </div>

                        <div className="container-savings-left">
                            Oszczednosci rzeczywiste: <br />
                        </div>

                        <div className={redBgForSavingsFromIncomes1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {formatter.format(totalIncomesBetweendDates)} / {formatter.format(totalExpensesBetweendDates)}
                            {/* {formatter.format(totalIncomesBetweendDates - totalExpensesBetweendDates)} */}
                        </div>
                        {/* <div className="container-data-middle-insideleft"> */}

                        <div className="chart-bar" style={{ display: (this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                            <Bar
                                title={{ display: false }}
                                data={dataByCategory}
                                height={300}
                                options={optionsBar}
                            />
                        </div>

                        <div className="chart-doughnut">
                            <Doughnut
                                data={dataExpToBud}
                                height={300}
                                options={optionsDonNoLabels}
                            />
                        </div>
                        <div className="text-25px-white">
                            {formatPercentage(totalExpenses / totalBudgets)}
                        </div>

                        {/* </div> */}
                        {/* <div className="container-data-middle-insideright"> */}
                        <div className="chart-doughnut">
                            <Doughnut
                                data={dataExpToInc}
                                height={300}
                                options={optionsDonNoLabels}
                            />
                        </div>
                        <div className="text-25px-white">
                            {formatPercentage(totalExpenses / totalIncomes)}
                        </div>
                        {/* </div> */}
                        {/* <div className="container-container-middle">5 ostatnich transakcji z wybranego miesiaca</div>
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
                            */}
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