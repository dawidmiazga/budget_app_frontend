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
import {
    getLastDayOfYear, getFirstDayOfYear, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, categoryMap, dateFilter, daysLeftCount, arrMthEng, arrMthPol, formatter, formatPercentage,
    checkIfRecordIsInTheMonth, sortFunction, arrayColumn, getCatTotals
} from './CommonFunctions.js'

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
        };

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
        // this.changeMth = this.changeMth.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    };

    componentDidMount() {
        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshBudgets()
        this.refreshCategories()
        this.refreshMonth()
        this.refreshUsers()
    };

    refreshUsers() {
        LoginDataService.retrieveAllLogins()
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    };

    refreshMonth() {
        var choosenMonth = newDateYYYYMM(Date()) 
        document.getElementById("monthChoiceFilter").value = choosenMonth;
        document.getElementById("monthChoiceFilterAllFromMth").value = choosenMonth;
        document.getElementById("monthChoiceFilterAllToMth").value = choosenMonth;
        this.setState({ dateMonthChoice: choosenMonth, })
        this.setState({ dateMonthChoiceAllFromMth: choosenMonth, })
        this.setState({ dateMonthChoiceAllToMth: choosenMonth, })
    };

    refreshYear() {
        var choosenYear = newDateYYYY(Date()) 
        document.getElementById("yearChoiceFilter").value = choosenYear;
        this.setState({ dateMonthChoice: choosenYear, })
    };

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ expenses: response.data })
                }
            )
    };

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ incomes: response.data })
                }
            )
    };

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid).then(response => { this.setState({ budgets: response.data }) })
    };

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid).then(response => { this.setState({ categories: response.data }) })
    };

    filterDataMonth() {
        const dataMonth = document.getElementById('monthChoiceFilter').value;
        this.setState({ dateMonthChoice: dataMonth, })
    };

    filterDataMonthAllFromMth() {
        const dataMonth = document.getElementById('monthChoiceFilterAllFromMth').value;
        this.setState({ dateMonthChoiceAllFromMth: dataMonth, })
    };

    filterDataMonthAllToMth() {
        const dataMonth = document.getElementById('monthChoiceFilterAllToMth').value;
        this.setState({ dateMonthChoiceAllToMth: dataMonth, })
    };

    // changeMth(type) {

    //     var currMth;
    //     if (type == "curr") {
    //         currMth = moment(Date()).format("YYYY-MM")
    //     } else {
    //         currMth = document.getElementById('monthChoiceFilter').value
    //         if (currMth == "") { return }
    //         var newMth = new Date(currMth);
    //         newMth.setDate(1);
    //         if (type == "prev") {
    //             newMth.setMonth(newMth.getMonth() - 1);
    //         } else if (type = "next") {
    //             newMth.setMonth(newMth.getMonth() + 1);
    //         }
    //         newMth = moment(newMth).format("YYYY-MM")
    //     }
    //     document.getElementById('monthChoiceFilter').value = newMth;
    //     this.setState({ dateMonthChoice: newMth, })
    // };

    changeToPrevMonth() {
        const currMth = document.getElementById('monthChoiceFilter').value
        if (currMth == "") { return }
        var prevMth = new Date(currMth);
        prevMth.setDate(1);
        prevMth.setMonth(prevMth.getMonth() - 1);
        prevMth = newDateYYYYMM(prevMth) //moment(prevMth).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = prevMth;
        this.setState({ dateMonthChoice: prevMth, })
    };

    changeToCurrMonth() {
        const currMth = newDateYYYYMM(Date()) //moment(Date()).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = currMth;
        this.setState({ dateMonthChoice: currMth, })
    };

    changeToNextMonth() {
        const currMth = document.getElementById('monthChoiceFilter').value;
        if (currMth == "") { return }
        var nextMth = new Date(currMth);
        nextMth.setDate(1);
        nextMth.setMonth(nextMth.getMonth() + 1);
        nextMth = newDateYYYYMM(nextMth) //moment(nextMth).format("YYYY-MM")
        document.getElementById('monthChoiceFilter').value = nextMth;
        this.setState({ dateMonthChoice: nextMth, })
    };

    filterDataYear() {
        const dataYear = document.getElementById('yearChoiceFilter').value;
        this.setState({ dateYearChoice: dataYear, })
    };

    handleSuccesfulResponse(response) {
        this.setState({ welcomeMessage: response.data.message })
    };

    handleError(error) {
        let errorMessage = '';
        if (error.message)
            errorMessage += error.message
        if (error.response && error.response.data) {
            errorMessage += error.response.data.message
        }
        this.setState({ welcomeMessage: errorMessage })
    };

    render() {

        if (this.state.dateMonthChoiceAllFromMth == "") {
            this.state.dateMonthChoiceAllFromMth = new Date("1111-12-31")
        };

        if (this.state.dateMonthChoiceAllToMth == "") {
            this.state.dateMonthChoiceAllToMth = new Date("9999-12-31")
        };

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

        var catData = [];
        catData = getCatTotals(
            allCategories,
            this.state.expenses,
            this.state.categories,
            newDateYYYYMMDD(this.state.dateMonthChoice),
            newDateYYYYMMDD(this.state.dateMonthChoice),
            categoriesColor);

        let redBgForSavingsFromIncomes;
        if ((totalIncomes - totalExpenses) >= 0) { redBgForSavingsFromIncomes = false; }
        else { redBgForSavingsFromIncomes = true; };

        let redBgForSavingsFromBudgets;
        if ((totalBudgets - totalExpenses) >= 0) { redBgForSavingsFromBudgets = false; }
        else { redBgForSavingsFromBudgets = true; };

        let redBgForSavingsFromIncomes1;
        if ((totalIncomesBetweendDates - totalExpensesBetweendDates) >= 0) { redBgForSavingsFromIncomes1 = false; }
        else { redBgForSavingsFromIncomes1 = true; };

        let redBgForSavingsFromBudgets1;
        if ((totalBudgetsTillDate - totalExpensesBetweendDates) >= 0) { redBgForSavingsFromBudgets1 = false; }
        else { redBgForSavingsFromBudgets1 = true; };

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
            labels: arrayColumn(catData, 1),
            datasets: [{
                hoverOffset: 20,
                data: arrayColumn(catData, 0),
                backgroundColor: arrayColumn(catData, 2),
            }]
        };

        // const dataByCategory_2 = {
        //     labels: arrayColumn(catData_2, 1),
        //     datasets: [{
        //         hoverOffset: 20,
        //         data: arrayColumn(catData_2, 0),
        //         backgroundColor: arrayColumn(catData_2, 2),
        //     }]
        // };

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
        };

        const optionsDon = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "left",
                }
            },
        };

        const optionsDonNoLabels = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
        };

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

                        <div className="chart-bar" style={{ display: (this.state.dateMonthChoice != "" ? 'block' : 'none') }}>
                            <Bar
                                title={{ display: false }}
                                data={dataByCategory}
                                // height={300}
                                options={optionsBar}
                            />
                        </div>
                        {/* <div className="chart-doughnut">
                            <Doughnut
                                data={dataByCategory_2}
                                height={300}
                                options={optionsDon}
                            />
                        </div> */}
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
                            {/* Wydatki i przychody w {moment(this.state.dateMonthChoice).format("YYYY")} roku */}
                            Wydatki i przychody w {newDateYYYY(this.state.dateMonthChoice)} roku
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
                            Pozostało do wydania: <br />
                        </div>

                        <div className={redBgForSavingsFromBudgets1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {formatter.format(totalIncomesBetweendDates-totalBudgetsTillDate)}<br />
                            {formatter.format(totalBudgetsTillDate - totalExpensesBetweendDates)}
                        </div>

                        <div className="container-savings-left">
                            Oszczednosci rzeczywiste: <br />
                        </div>

                        <div className={redBgForSavingsFromIncomes1 ? "container-savings-right-red" : "container-savings-right-green"}>
                            {/* {formatter.format(totalIncomesBetweendDates)} / {formatter.format(totalExpensesBetweendDates)}<br /> */}
                            {formatter.format(totalIncomesBetweendDates - totalExpensesBetweendDates)}
                        </div>
                        {/* <div className="container-data-middle-insideleft">


                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataExpToBud}
                                    // height={70}
                                    options={optionsDonNoLabels}
                                />
                            </div>
                            <div className="text-25px-white">
                                {formatPercentage(totalExpenses / totalBudgets)}
                            </div>

                        </div>
                        <div className="container-data-middle-insideright">
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataExpToInc}
                                    // height={300}
                                    options={optionsDonNoLabels}
                                />
                            </div>
                            <div className="text-25px-white">
                                {formatPercentage(totalExpenses / totalIncomes)}
                            </div>
                        </div> */}
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