import React, { Component, Suspense } from "react";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import AuthenticationService from "./AuthenticationService";
import ExpenseDataService from "../../api/HomeBudget/ExpenseDataService";
import IncomeDataService from "../../api/HomeBudget/IncomeDataService.js";
import CategoryDataService from "../../api/HomeBudget/CategoryDataService";
import BudgetDataService from "../../api/HomeBudget/BudgetDataService";
import BankAccountDataService from "../../api/HomeBudget/BankAccountDataService";
import btnToday from '../images/today_button.png';
import {
    getLastDayOfDate, getFirstDayOfDate, cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD,
    newDateM, newDateMM, arrMthEng, arrMthPol, formatter, categoryMap, sortFunction, arrayColumn, getCatTotals
} from './CommonFunctions.js'
import { act } from "react-dom/test-utils";
import Spinner from 'react-bootstrap/Spinner';

class ChartsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            bankaccounts: [],
            selectYear: "All",
            welcomeMessage: '',
            displayValue: 'tilldate',
            choosenYear: (new Date()).getFullYear(),
            loading: true,
            bankAccChoice: 'Razem'
        };
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this);
        this.refreshCategories = this.refreshCategories.bind(this);
        this.refreshBankAccounts = this.refreshBankAccounts.bind(this);
        this.refreshBudgets = this.refreshBudgets.bind(this);
        this.changeDisplOption = this.changeDisplOption.bind(this);
        this.changeBankAccount = this.changeBankAccount.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeToCurrYear = this.changeToCurrYear.bind(this);
    };

    componentDidMount() {
        // document.getElementById("displOptionID").value = "tilldate";
        // this.setState({ displayValue: "tilldate", })
        // console.log("xxx")// + this.state.displayValue)

        // let today = new Date();
        // checkToken().then(() => this.setState({ loading: false });

        this.refreshExpenses();
        this.refreshIncomes();
        this.refreshCategories();
        this.refreshBankAccounts();
        this.refreshBudgets();

        // this.setState({ loading: false });

    };

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    this.setState({ expenses: response.data })
                }
            );
    };

    refreshIncomes() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        IncomeDataService.retrieveAllIncomes(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
                    this.setState({ incomes: response.data })
                }
            );
    };

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        CategoryDataService.retrieveAllCategories(usernameid)
            .then(
                response => {
                    this.setState({ categories: response.data })
                }
            );
    };

    refreshBankAccounts() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        BankAccountDataService.retrieveAllBankAccounts(usernameid)
            .then(
                response => {
                    this.setState({ bankaccounts: response.data })
                }
            );
    };

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(
                response => {
                    this.setState({ budgets: response.data, loading: false })
                }
            );
    };

    changeDisplOption() {
        this.setState({ displayValue: document.getElementById("displOptionID").value, });
    };

    changeBankAccount() {
        const choosenAcc = document.getElementById("displBankAccount").value;
        this.setState({ displayValue: choosenAcc, })
        this.setState({ bankAccChoice: choosenAcc })
    };

    changeYear() {
        this.setState({ choosenYear: document.getElementById("choosenYear").value, });
    };

    changeToCurrYear() {
        const currYr = newDateYYYY(Date());
        document.getElementById('choosenYear').value = currYr;
        this.setState({ choosenYear: currYr, });
    };

    render() {

        var today = new Date();

        var expTargYears = (this.state.expenses.map(expense => newDateYYYY(expense.target_date)));//.sort();
        var expFiniYears = (this.state.expenses.map(expense => newDateYYYY(expense.finish_date)));//.sort();

        var maxDate = Math.max(...expFiniYears);
        var minDate = Math.min(...expTargYears);

        const uniqueYears = [];
        for (var i = minDate; i <= maxDate; i++) { uniqueYears.push(i); };

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
                    )), 0
                ));

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
                    )), 0
                ));

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
                    )), 0
                ));

            if (this.state.displayValue == "all") {
                totalExp += totalValueMthExp[i];
                totalInc += totalValueMthInc[i];
                totalBud += totalValueMthBud[i];
            } else {
                if (newMthParsedDate[i] <= currMth) {

                    totalValueMthExp[i] = totalValueMthExp[i];
                    totalExp += totalValueMthExp[i];

                    totalValueMthInc[i] = totalValueMthInc[i];
                    totalInc += totalValueMthInc[i];

                    totalValueMthBud[i] = totalValueMthBud[i];
                    totalBud += totalValueMthBud[i];

                } else if (this.state.displayValue == "tilldate") {
                    totalValueMthExp[i] = 0;
                    totalValueMthInc[i] = 0;
                    totalValueMthBud[i] = 0;
                }
            };

            if (this.state.displayValue == "forecast" && newMthParsedDate[i] == this.state.choosenYear + "-12") {
                let monthsLeft = 12 - today.getMonth() - 1;
                forecastExpense = (totalExp / 12) * monthsLeft;
                forecastIncome = (totalInc / 12) * monthsLeft;
                forecastBudget = (totalBud / 12) * monthsLeft;
            };
        };

        var startdatenew = getFirstDayOfDate(this.state.choosenYear, 0);
        if (this.state.displayValue == "tilldate") {
            var enddatenew = getLastDayOfDate(this.state.choosenYear, today.getMonth());
        } else {
            var enddatenew = getLastDayOfDate(this.state.choosenYear, 11);
        };

        var catData = [];
        catData = getCatTotals(
            allCategories,
            this.state.expenses,
            this.state.categories,
            startdatenew,
            enddatenew,
            categoriesColor,
            this.state.bankAccChoice);

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

        const optionsBar = {
            indexAxis: 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                }
            },
        };

        const optionsBar2 = {
            indexAxis: 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
        };

        const optionsBar3 = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
        };

        const optionsDon = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                }
            },
        };

        var allBankAccounts;
        allBankAccounts = this.state.bankaccounts.map(bankaccount => bankaccount.bankaccountname);
        allBankAccounts.unshift('Razem');

        const displOptions = [
            { label: "Do dzisiaj", value: "tilldate", },
            { label: "Cały rok", value: "all", },
            { label: "Prognoza", value: "forecast", },
        ];

        if (this.state.loading) {
            return (
                <div className="background-color-all">
                    <div className="container-middle-41">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden"></span>
                        </Spinner>
                        <br />Ładuję...
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="background-color-all">
                    <div className="container-left-26">
                    </div>
                    <div className="container-middle-41">
                        <div className="text-h2-white">
                            Podzial wydatkow i przychodow w {this.state.choosenYear} roku
                        </div>
                    </div>
                    <div className="container-right-26">
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
                        <select id="displBankAccount" className="hb-form-control" onChange={this.changeBankAccount}>
                            {allBankAccounts.map((allBankAccounts) => (
                                <option value={allBankAccounts}>{allBankAccounts}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grey-border">
                        <div className="container-left-26" >
                            <div className="text-h2-white">
                                Na kategorie
                            </div>
                            <div className="chart-doughnut">
                                <Doughnut
                                    data={dataByCat}
                                    height={320}
                                    options={optionsDon}
                                />
                            </div>
                        </div>
                        <div className="container-middle-41">
                            <div className="text-h2-white">
                                Na miesiac
                            </div>
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByMthExp}
                                    height={160}
                                    options={optionsBar}
                                />
                            </div>
                            <div className="text-h2-white">
                                Na kategorie
                            </div>
                            <div className="chart-bar">
                                <Bar
                                    title={{ display: false }}
                                    data={dataByCat}
                                    height={160}
                                    options={optionsBar2}
                                />
                            </div>
                        </div>
                        <div className="container-right-26" >
                            <div className="text-h2-white">
                                Oszczednosci
                            </div>
                            <div className="text-h5-white">
                                Rzeczywiste: {formatter.format(totalInc - totalExp + forecastIncome - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromIncomes}
                                        height={60}
                                        options={optionsBar3}
                                    />
                                </div>
                                Zalozone: {formatter.format(totalBud - totalExp + forecastBudget - forecastExpense)} <br />
                                <div className="chart-bar">
                                    <Bar
                                        title={{ display: false }}
                                        data={dataForSavingsFromBudgets}
                                        height={60}
                                        options={optionsBar3}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="container-left-26"></div> */}
                        {/* <div className="container-middle-41"></div> */}
                        {/* <div className="container-right-26" ></div> */}
                    </div>
                    {/* <div id="content"></div> */}
                    {/* <div id="footer"></div> */}
                </div>
            </>
        )
    }
}

export default ChartsComponent
