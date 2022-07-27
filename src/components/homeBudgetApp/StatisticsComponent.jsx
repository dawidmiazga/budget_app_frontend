import React, { Component } from "react";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import AuthenticationService from "./AuthenticationService";
import ExpenseDataService from "../../api/HomeBudget/ExpenseDataService";
import IncomeDataService from "../../api/HomeBudget/IncomeDataService.js";
import CategoryDataService from "../../api/HomeBudget/CategoryDataService";
import BudgetDataService from "../../api/HomeBudget/BudgetDataService";
import btnToday from '../images/today_button.png';
import {
    getLastDayOfYear, getFirstDayOfYear, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, arrMthEng, arrMthPol, formatter, categoryMap, sortFunction, arrayColumn, getCatTotals
} from './CommonFunctions.js'
import { act } from "react-dom/test-utils";

class ChartsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            selectYear: "All",
            welcomeMessage: '',
            displayValue: 'tilldate',
            choosenYear: (new Date()).getFullYear(),
        };
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
        this.changeDisplOption = this.changeDisplOption.bind(this)
        this.changeYear = this.changeYear.bind(this)
        this.changeToCurrYear = this.changeToCurrYear.bind(this)
    };

    componentDidMount() {
        // document.getElementById("displOptionID").value = "tilldate";
        // this.setState({ displayValue: "tilldate", })
        // console.log("xxx")// + this.state.displayValue)

        // let today = new Date();

        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshCategories()
        this.refreshBudgets()
    };

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
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

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid)
            .then(
                response => {
                    this.setState({ categories: response.data })
                }
            )
    };

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid).then(response => { this.setState({ budgets: response.data }) })
    };

    changeDisplOption() {
        this.setState({ displayValue: document.getElementById("displOptionID").value, })
    };

    changeYear() {
        this.setState({ choosenYear: document.getElementById("choosenYear").value, })
    };

    changeToCurrYear() {
        const currYr = moment(Date()).format("YYYY");
        document.getElementById('choosenYear').value = currYr;
        this.setState({ choosenYear: currYr, });
    };

    render() {

        var today = new Date();

        var expTargYears = (this.state.expenses.map(expense => newDateYYYY(expense.target_date)));//.sort();
        var expFiniYears = (this.state.expenses.map(expense => newDateYYYY(expense.finish_date)));//.sort();

        var maxDate = Math.max(...expFiniYears);
        var minDate = Math.min(...expTargYears);

        const uniqueYears = []
        for (var i = minDate; i <= maxDate; i++) { uniqueYears.push(i); }

        const currMth = newDateYYYYMM(new Date(today.getFullYear(), today.getMonth()));
        const allCategories = this.state.categories.map(category => category.categoryname);
        const categoriesColor = this.state.categories.map(category => category.hexcolor);

        var totalExp = 0;
        var totalInc = 0;
        var totalBud = 0;
        var totalBudget = 0;
        var forecastBudget = 0;
        var forecastExpense = 0;
        var forecastIncome = 0;
        var j = 0;

        var totalValueMthExp = [];
        var totalValueMthBud = [];
        var newMthFullDate = [];
        var newMthParsedDate = [];

        var totalValueMthInc = [];
        var newMthFullDate = [];

        var tempSum = [];

        var catNames = [];


        for (let i = 0; i < arrMthEng.length; i++) {
            newMthFullDate[i] = new Date(arrMthEng[i])
            newMthParsedDate[i] = newDateYYYYMM(new Date(this.state.choosenYear, newMthFullDate[i].getMonth()))
            totalValueMthExp[i] =
                (this.state.expenses.reduce((total, currentItem) => total = total + (currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    )), 0));

            totalValueMthInc[i] =
                (this.state.incomes.reduce((total, currentItem) => total = total + (currentItem.amount *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.amount
                    )), 0));

            totalValueMthBud[i] =
                (this.state.budgets.reduce((total, currentItem) => total = total + (currentItem.amount *
                    cycleCount(
                        currentItem.target_month,
                        currentItem.target_month,
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        newDateYYYYMMDD(newMthParsedDate[i]),
                        "Nie",
                        "",
                        currentItem.amount
                    )), 0));

            if (this.state.displayValue == "all") {
                totalExp += totalValueMthExp[i]
                totalInc += totalValueMthInc[i]
                totalBud += totalValueMthBud[i]
            } else {
                if (newMthParsedDate[i] <= currMth) {

                    totalValueMthExp[i] = totalValueMthExp[i]
                    totalExp += totalValueMthExp[i]

                    totalValueMthInc[i] = totalValueMthInc[i]
                    totalInc += totalValueMthInc[i]

                    totalValueMthBud[i] = totalValueMthBud[i]
                    totalBud += totalValueMthBud[i]

                } else if (this.state.displayValue == "tilldate") {
                    totalValueMthExp[i] = 0;
                    totalValueMthInc[i] = 0;
                    totalValueMthBud[i] = 0;
                }
            }
            if (this.state.displayValue == "forecast" && newMthParsedDate[i] == this.state.choosenYear + "-12") {
                let monthsLeft = 12 - today.getMonth() - 1;
                forecastExpense = (totalExp / 12) * monthsLeft;
                forecastIncome = (totalInc / 12) * monthsLeft;
                forecastBudget = (totalBud / 12) * monthsLeft;

            }
        };
      
        var startdatenew = getFirstDayOfYear(this.state.choosenYear, 0);
        if (this.state.displayValue == "tilldate") {
            var enddatenew = getLastDayOfYear(this.state.choosenYear, today.getMonth())
        } else {
            var enddatenew = getLastDayOfYear(this.state.choosenYear, 11)
        };

        var catData = [];
        catData = getCatTotals(
            allCategories,
            this.state.expenses,
            this.state.categories,
            startdatenew,
            enddatenew,
            categoriesColor);


        const dataByMthExp = {
            labels: arrMthPol,
            datasets: [{
                label: 'Wydatki',
                data: totalValueMthExp,
                backgroundColor: '#2177ef',
            },
            {
                label: 'Budżet',
                data: totalValueMthBud,
                backgroundColor: '#000',
            },
            {
                label: 'Przychody',
                data: totalValueMthInc,
                backgroundColor: '#333',
            }]
        };

        const dataByCat = {
            labels: arrayColumn(catData, 1),//catWithVal,
            datasets: [{
                data: arrayColumn(catData, 0),//totalValueCat,
                backgroundColor: arrayColumn(catData, 2),//rgbColorCat,
            }]
        };

        const dataForSavingsFromBudgets = {
            labels: [this.state.choosenYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExp + forecastExpense],
                backgroundColor: '#b41010',
            },
            {
                label: 'Budzet',
                data: [totalBud + forecastBudget],
                backgroundColor: '#1d6c2b',
            }]
        };

        const dataForSavingsFromIncomes = {
            labels: [this.state.choosenYear],
            datasets: [{
                label: 'Wydatki',
                data: [totalExp + forecastExpense],
                backgroundColor: '#b41010',
            },
            {
                label: 'Przychody',
                data: [totalInc + forecastIncome],
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
        };

        const optionsBar = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
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

        const displOptions = [
            { label: "Do dzisiaj", value: "tilldate", },
            { label: "Cały rok", value: "all", },
            { label: "Prognoza", value: "forecast", },
        ];

        return (
            <>
                <div className="background-color-all">
                    <div className="container-stats-middle2-left">
                        <div style={{ display: this.state.displayValue == "all" ? 'block' : 'none' }}>x</div>
                    </div>
                    <div className="container-stats-middle2">
                        <div className="text-35px-white">
                            Podzial wydatkow i przychodow w:
                        </div>

                    </div>
                    <div className="container-stats-middle2-right">
                        {/* <img src={btnToday} width="50" height="50" onClick={this.changeToCurrYear} /> */}
                        <select id="choosenYear" className="hb-form-control" onChange={this.changeYear}>
                            <option selected disabled hidden={(new Date()).getFullYear()}>{(new Date()).getFullYear()}</option>
                            {uniqueYears.map((uniqueYears) => (
                                <option value={uniqueYears}>{uniqueYears}</option>
                            ))}
                        </select>
                        <select id="displOptionID" className="hb-form-control" onChange={this.changeDisplOption}>
                            {displOptions.map((displOptions) => (
                                <option value={displOptions.value}>{displOptions.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="container-stats-year">
                        <div className="container-stats-middle2-left">

                        </div>
                        <div className="container-stats-middle2">
                            <div className="text-30px-white">
                                {this.state.choosenYear} roku
                            </div>
                        </div>
                        <div className="container-stats-middle2-right">

                        </div>
                        {/* <div className="container-stats-left" >
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
                        </div> */}
                        <div className="container-stats-left" >
                            <div className="text-25px-white">
                                Na kategorie
                            </div>
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCat}
                                    height={280}
                                    options={optionsDon}
                                />
                            </div>
                        </div>
                        <div className="container-stats-middle">
                            <div className="text-25px-white">
                                Na miesiac
                            </div>
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByMthExp}
                                    height={280}
                                    options={optionsBar}
                                />
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            <div className="text-25px-white">
                                Oszczednosci
                            </div>
                            <div className="text-20px-white">
                                Rzeczywiste: {formatter.format(totalInc - totalExp + forecastIncome - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromIncomes}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                                Zalozone: {formatter.format(totalBud - totalExp + forecastBudget - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromBudgets}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="container-stats-left" >
                            {/* <div className="text-25px-white">
                                Na kategorie
                            </div>
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCat}
                                    height={280}
                                    options={optionsDon}
                                />
                            </div> */}
                        </div>
                        <div className="container-stats-middle">
                            <div className="text-25px-white">
                                Na kategorie
                            </div>
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByCat}
                                    height={280}
                                    options={optionsBar}
                                />
                            </div>
                        </div>
                        <div className="container-stats-right" >
                            {/* <div className="text-25px-white">
                                Oszczednosci
                            </div>
                            <div className="text-20px-white">
                                Rzeczywiste: {formatter.format(totalInc - totalExp + forecastIncome - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromIncomes}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                                Zalozone: {formatter.format(totalBudget - totalExp + forecastBudget - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromBudgets}
                                        height={80}
                                        options={optionsBar2}
                                    />
                                </div>
                            </div> */}
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
