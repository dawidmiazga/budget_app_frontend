import React, { Component } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "../../App.css"
import AuthenticationService from "./AuthenticationService.js";
import ExpenseDataService from "../../api/HomeBudget/ExpenseDataService.js";
import CategoryDataService from "../../api/HomeBudget/CategoryDataService";
import IncomeDataService from "../../api/HomeBudget/IncomeDataService.js";
import BudgetDataService from "../../api/HomeBudget/BudgetDataService.js";
import BankAccountDataService from "../../api/HomeBudget/BankAccountDataService.js";
import LoginDataService from "../../api/HomeBudget/LoginDataService.js";
import btnBack from "../images/back_button.png";
import btnNext from "../images/next_button.png";
import btnToday from "../images/today_button.png";
import {
    cycleCount, newDateYYYY, newDateYYYYMM, newDateYYYYMMDD, dateFilter, daysLeftCount,
    arrMthEng, arrMthPol, formatter, checkIfRecordIsInTheMonth, arrayColumn, getCatTotals
} from "./CommonFunctions.js"
import Spinner from 'react-bootstrap/Spinner';
import { waitFor } from "@testing-library/react";

class WelcomeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mthChoice: "",
            bankAccChoice: "",
            mthFilterStart: "",
            mthFilterEnd: "",
            yrChoice: "",
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            bankaccounts: [],
            users: [],
            selectYear: "All",
            shchild1: false,
            welcomeMessage: "",
            loading: true
        };

        this.handleSuccesfulResponse = this.handleSuccesfulResponse.bind(this);
        this.handleError = this.handleError.bind(this);
        this.refreshExpenses = this.refreshExpenses.bind(this);
        this.refreshIncomes = this.refreshIncomes.bind(this);
        this.refreshBudgets = this.refreshBudgets.bind(this);
        this.refreshCategories = this.refreshCategories.bind(this);
        this.refreshBankAccounts = this.refreshBankAccounts.bind(this);
        this.filterDataMonth = this.filterDataMonth.bind(this);
        this.filterDataMonthStart = this.filterDataMonthStart.bind(this);
        this.filterDataMonthEnd = this.filterDataMonthEnd.bind(this);
        this.filterDataYear = this.filterDataYear.bind(this);
        this.refreshMonth = this.refreshMonth.bind(this);
        this.refreshYear = this.refreshYear.bind(this);
        this.changeToPrevMonth = this.changeToPrevMonth.bind(this);
        this.changeToNextMonth = this.changeToNextMonth.bind(this);
        this.changeToCurrMonth = this.changeToCurrMonth.bind(this);
        this.changeBankAccount = this.changeBankAccount.bind(this);
        // this.changeMth = this.changeMth.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this);
    };

    componentDidMount() {
        this.refreshExpenses();
        this.refreshIncomes();
        this.refreshBudgets();
        this.refreshCategories();
        this.refreshBankAccounts();
        this.refreshMonth();
        this.refreshUsers();

        console.log(this.state.loading)
        var choosenMth = newDateYYYYMM(Date());
        if (this.state.loading == false) {
            document.getElementById("mthChoiceID").value = choosenMth;
            document.getElementById("mthFilterStartID").value = choosenMth;
            document.getElementById("mthFilterEndID").value = choosenMth;
        }
    };

    refreshUsers() {
        LoginDataService.retrieveAllLogins()
            .then(
                response => {
                    this.setState({ users: response.data, loading: false })
                }
            )
    };

    refreshMonth() {
        var choosenMth = newDateYYYYMM(Date());
        document.getElementById("mthChoiceID").value = choosenMth;
        document.getElementById("mthFilterStartID").value = choosenMth;
        document.getElementById("mthFilterEndID").value = choosenMth;
        this.setState({ mthChoice: choosenMth, });
        this.setState({ mthFilterStart: choosenMth, });
        this.setState({ mthFilterEnd: choosenMth, });
    };

    refreshYear() {
        var choosenYr = newDateYYYY(Date());
        document.getElementById("yrChoiceID").value = choosenYr;
        this.setState({ mthChoice: choosenYr, });
    };

    refreshExpenses() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
                    response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
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

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName();
        BudgetDataService.retrieveAllBudgets(usernameid)
            .then(
                response => {
                    this.setState({ budgets: response.data })
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

    filterDataMonth() {
        const dataMonth = document.getElementById("mthChoiceID").value;
        this.setState({ mthChoice: dataMonth, });
    };

    filterDataMonthStart() {
        const dataMonth = document.getElementById("mthFilterStartID").value;
        this.setState({ mthFilterStart: dataMonth, });
    };

    filterDataMonthEnd() {
        const dataMonth = document.getElementById("mthFilterEndID").value;
        this.setState({ mthFilterEnd: dataMonth, });
    };

    // changeMth(type) {

    //     var filteredMth;
    //     if (type == "curr") {
    //         filteredMth = moment(Date()).format("YYYY-MM")
    //     } else {
    //         filteredMth = document.getElementById("mthChoiceID").value
    //         if (filteredMth == "") { return }
    //         var newMth = new Date(filteredMth);
    //         newMth.setDate(1);
    //         if (type == "prev") {
    //             newMth.setMonth(newMth.getMonth() - 1);
    //         } else if (type = "next") {
    //             newMth.setMonth(newMth.getMonth() + 1);
    //         }
    //         newMth = moment(newMth).format("YYYY-MM")
    //     }
    //     document.getElementById("mthChoiceID").value = newMth;
    //     this.setState({ mthChoice: newMth, })
    // };

    changeBankAccount() {
        const currBankAcc = document.getElementById("bankAccID").value;
        console.log("changeBankAccount " + currBankAcc);
        document.getElementById("bankAccID").value = currBankAcc;
        this.setState({ bankAccChoice: currBankAcc, });
    };

    changeToPrevMonth() {
        const filteredMth = document.getElementById("mthChoiceID").value;
        if (filteredMth == "") { return; };
        var prevMth = new Date(filteredMth);
        prevMth.setDate(1);
        prevMth.setMonth(prevMth.getMonth() - 1);
        prevMth = newDateYYYYMM(prevMth);
        document.getElementById("mthChoiceID").value = prevMth;
        this.setState({ mthChoice: prevMth, });
    };

    changeToCurrMonth() {
        const filteredMth = newDateYYYYMM(Date());
        document.getElementById("mthChoiceID").value = filteredMth;
        this.setState({ mthChoice: filteredMth, });
    };

    changeToNextMonth() {
        const filteredMth = document.getElementById("mthChoiceID").value;
        if (filteredMth == "") { return; };
        var nextMth = new Date(filteredMth);
        nextMth.setDate(1);
        nextMth.setMonth(nextMth.getMonth() + 1);
        nextMth = newDateYYYYMM(nextMth);
        document.getElementById("mthChoiceID").value = nextMth;
        this.setState({ mthChoice: nextMth, });
    };

    filterDataYear() {
        const dataYear = document.getElementById("yrChoiceID").value;
        this.setState({ yrChoice: dataYear, });
    };

    handleSuccesfulResponse(response) {
        this.setState({ welcomeMessage: response.data.message });
    };

    handleError(error) {
        let errorMessage = "";
        if (error.message)
            errorMessage += error.message;
        if (error.response && error.response.data) {
            errorMessage += error.response.data.message;
        }
        this.setState({ welcomeMessage: errorMessage });
    };

    render() {

        if (this.state.mthFilterStart == "") {
            this.state.mthFilterStart = new Date("1111-12-31");
        };

        if (this.state.mthFilterEnd == "") {
            this.state.mthFilterEnd = new Date("9999-12-31");
        };

        if (this.state.bankAccChoice == "") {
            this.state.bankAccChoice = "Razem";
        };

        var allBankAccounts = this.state.bankaccounts.map(bankaccount => bankaccount.bankaccountname);
        allBankAccounts.unshift('Razem');

        var totalExp;
        if (this.state.mthChoice == "") {
            totalExp = 0;
        } else {
            if (this.state.bankAccChoice == "Razem") {
                totalExp = (this.state.expenses.filter(
                    expense => (
                        dateFilter(expense.target_date, expense.finish_date, this.state.mthChoice, expense.cycle)
                    )
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));
            } else {
                totalExp = (this.state.expenses.filter(
                    expense => (
                        dateFilter(expense.target_date, expense.finish_date, this.state.mthChoice, expense.cycle) &&
                        expense.bankaccountname == this.state.bankAccChoice
                    )
                ).reduce((total, currentItem) => total = total + currentItem.price, 0));
            }
        }

        var totalInc;
        if (this.state.mthChoice == "") {
            totalInc = 0;
        } else {
            totalInc = (this.state.incomes.filter(
                income => (
                    dateFilter(income.target_date, income.finish_date, this.state.mthChoice, income.cycle)
                )
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var totalIncBetwMths;
        if (this.state.mthFilterStart == "" || this.state.mthFilterEnd == "") {
            totalIncBetwMths = 0;
        } else {
            totalIncBetwMths = (this.state.incomes.reduce((total, currentItem) => total = total + currentItem.amount *
                cycleCount(
                    currentItem.target_date,
                    currentItem.finish_date,
                    newDateYYYYMMDD(this.state.mthFilterStart),
                    newDateYYYYMMDD(this.state.mthFilterEnd),
                    currentItem.cycle,
                    currentItem.description,
                    currentItem.amount
                ), 0
            ));
        }

        var totalExpBetwMths;
        if (this.state.mthFilterStart == "" || this.state.mthFilterEnd == "") {
            totalExpBetwMths = 0;
        } else {
            if (this.state.bankAccChoice == "Razem") {
                totalExpBetwMths = (this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(this.state.mthFilterStart),
                        newDateYYYYMMDD(this.state.mthFilterEnd),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    ), 0
                ));
            } else {
                totalExpBetwMths = (this.state.expenses.filter(
                    expense =>
                        expense.bankaccountname == this.state.bankAccChoice
                ).reduce((total, currentItem) => total = total + currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(this.state.mthFilterStart),
                        newDateYYYYMMDD(this.state.mthFilterEnd),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    ), 0
                ));
            }
        }

        var totalBudgets;
        if (this.state.mthChoice == "") {
            totalBudgets = 0;
        } else {
            totalBudgets = (this.state.budgets.filter(
                budget =>
                    newDateYYYYMM(budget.target_month) == newDateYYYYMM(this.state.mthChoice)
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var totalBudgBetwMths;
        if (this.state.mthFilterStart == "" || this.state.mthFilterEnd == "") {
            totalBudgBetwMths = 0;
        } else {
            totalBudgBetwMths = (this.state.budgets.filter(
                budget =>
                    newDateYYYYMM(budget.target_month) >= newDateYYYYMM(this.state.mthFilterStart) &&
                    newDateYYYYMM(budget.target_month) <= newDateYYYYMM(this.state.mthFilterEnd)
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }

        var cntInBudget = 0;
        if (this.state.mthFilterStart == "" || this.state.mthFilterEnd == "" || newDateYYYY(this.state.mthFilterEnd) == "1111" || newDateYYYY(this.state.mthFilterEnd) == "9999") {
            cntInBudget = 0;
        } else {
            var startMth = new Date(this.state.mthFilterStart)
            var stopMth = new Date(this.state.mthFilterEnd)
            var filteredMth = startMth
            while (newDateYYYYMM(filteredMth) <= newDateYYYYMM(stopMth)) {
                var mthBudg = (this.state.budgets.filter(budget =>
                    newDateYYYYMM(budget.target_month) == newDateYYYYMM(filteredMth)
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0));
                var mthExp;
                if (this.state.bankAccChoice == "Razem") {
                    mthExp = (this.state.expenses.filter(expense => (
                        dateFilter(expense.target_date, expense.finish_date, filteredMth, expense.cycle)
                    )).reduce((total, currentItem) => total = total + currentItem.price, 0));
                } else {
                    mthExp = (this.state.expenses.filter(expense => (
                        dateFilter(expense.target_date, expense.finish_date, filteredMth, expense.cycle) &&
                        expense.bankaccountname == this.state.bankAccChoice
                    )).reduce((total, currentItem) => total = total + currentItem.price, 0));
                }
                if (mthBudg >= mthExp && mthBudg > 0) {
                    cntInBudget += 1;
                }
                var filteredMth = filteredMth.setMonth(filteredMth.getMonth() + 1);
                filteredMth = new Date(filteredMth);
            }
        }

        var totalExpByMonth = [];
        var totalIncByMonth = [];
        var newDateParsed = [];

        for (let i = 0; i < arrMthEng.length; i++) {
            newDateParsed[i] = newDateYYYYMM(
                new Date(
                    newDateYYYY(this.state.mthChoice),
                    new Date(arrMthEng[i]).getMonth()
                )
            );

            if (this.state.bankAccChoice == "Razem") {
                totalExpByMonth[i] = this.state.expenses.filter(
                    expense => (
                        checkIfRecordIsInTheMonth(expense.cycle, expense.target_date, expense.finish_date, newDateParsed[i], this.state.mthChoice)
                    ) == true
                ).reduce((total, currentItem) => total = total + currentItem.price, 0);
            } else {
                totalExpByMonth[i] = this.state.expenses.filter(
                    expense => (
                        checkIfRecordIsInTheMonth(expense.cycle, expense.target_date, expense.finish_date, newDateParsed[i], this.state.mthChoice) &&
                        expense.bankaccountname == this.state.bankAccChoice
                    ) == true
                ).reduce((total, currentItem) => total = total + currentItem.price, 0);
            }
        }

        for (let i = 0; i < arrMthEng.length; i++) {
            newDateParsed[i] = newDateYYYYMM(
                new Date(
                    newDateYYYY(this.state.mthChoice),
                    new Date(arrMthEng[i]).getMonth()
                )
            );

            totalIncByMonth[i] = this.state.incomes.filter(
                income => (
                    checkIfRecordIsInTheMonth(income.cycle, income.target_date, income.finish_date, newDateParsed[i], this.state.mthChoice)
                ) == true
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0);

        }

        const allCat = this.state.categories.map(category => category.categoryname);
        const colorCat = this.state.categories.map(category => category.hexcolor);

        var dataCat = [];
        dataCat = getCatTotals(
            allCat,
            this.state.expenses,
            this.state.categories,
            newDateYYYYMMDD(this.state.mthChoice),
            newDateYYYYMMDD(this.state.mthChoice),
            colorCat,
            this.state.bankAccChoice
        );

        let redBgInc;
        if ((totalInc - totalExp) >= 0) {
            redBgInc = false;
        } else {
            redBgInc = true;
        };

        let redBgBudg;
        if ((totalBudgets - totalExp) >= 0) {
            redBgBudg = false;
        } else {
            redBgBudg = true;
        };

        let redBgIncBetwMths;
        if ((totalIncBetwMths - totalExpBetwMths) >= 0) {
            redBgIncBetwMths = false;
        } else {
            redBgIncBetwMths = true;
        };

        let redBgBudgBetwMths;
        if ((totalBudgBetwMths - totalExpBetwMths) >= 0) {
            redBgBudgBetwMths = false;
        } else {
            redBgBudgBetwMths = true;
        };

        let redCntInBudget;
        if (cntInBudget >= 0) {
            redCntInBudget = false;
        } else {
            redCntInBudget = true;
        };

        const dataByMonth = {
            labels: arrMthPol,
            datasets: [{
                label: "Wydatki",
                data: totalExpByMonth,
                backgroundColor: "#2177ef",
            },
            {
                label: "Przychody",
                data: totalIncByMonth,
                backgroundColor: "#333",
            }]
        };

        const dataByCat = {
            labels: arrayColumn(dataCat, 1),
            datasets: [{
                hoverOffset: 20,
                data: arrayColumn(dataCat, 0),
                backgroundColor: arrayColumn(dataCat, 2),
            }]
        };

        const dataExpToBud = {
            labels: ["Wydano: ", "Pozostało: "],
            datasets: [{
                borderWidth: 0,
                cutout: 130,
                circumference: 180,
                rotation: -90,
                data: [totalExp, totalBudgets - totalExp],
                backgroundColor: ["#2177ef", "#4a4a4a"],
            }]
        };

        const dataExpToInc = {
            labels: ["Wydano: ", "Pozostało: "],
            datasets: [{
                borderWidth: 0,
                cutout: 130,
                circumference: 180,
                rotation: -90,
                data: [totalExp, totalInc - totalExp],
                backgroundColor: ["#2177ef", "#4a4a4a"],
            }]
        };

        const optionsBar = {
            // indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                }
            },
        };

        const optionsBar2 = {
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

        var dropdownData = allBankAccounts,
            MakeItem = function (X) {
                return <option>{X}</option>;
            };

        // if (this.state.loading) {
        //     return (
        //         <div className="background-color-all">
        //             <div className="container-middle-41">
        //                 <Spinner animation="border" role="status">
        //                     <span className="visually-hidden"></span>
        //                 </Spinner>
        //                 <br />Ładuję...
        //             </div>
        //         </div>
        //     );
        // } else {
        //     // while (document.getElementById("mthChoiceID") != null) {
        //     //     console.log("x")
        //     // }
        //     const divElement = document.getElementById('mthChoiceID');
        //     console.log(divElement)
        //     var choosenMth = newDateYYYYMM(Date());

        //     // console.log(document.getElementById("mthChoiceID"))//.value = choosenMth;
        //     // console.log(document.getElementById("mthFilterStartID"))//.value = choosenMth;
        //     // console.log(document.getElementById("mthFilterEndID"))//.value = choosenMth;
        // }

        return (
            <>
                <div className="background-color-all">
                    <div className="container-left-26">
                        <div className="text-h5-white">
                            Pokazany miesiąc
                        </div>
                        <div className="container-height-70">
                            <div>
                                <input type="month" id="mthChoiceID" onChange={this.filterDataMonth} data-date-format="MM YYYY"></input>
                                <img src={btnBack} width="50" height="50" onClick={this.changeToPrevMonth} />
                                <img src={btnNext} width="50" height="50" onClick={this.changeToNextMonth} />
                                <img src={btnToday} width="30" height="30" onClick={this.changeToCurrMonth} />
                            </div>
                        </div>
                    </div>

                    <div className="container-middle-41">
                        <div className="container-height-70">
                            <div className="text-h1-white">
                                Oto Twoje podsumowanie:
                            </div>
                        </div>
                    </div>
                    <div className="container-right-26">
                        <div className="text-h5-white">
                            Wybierz konto
                        </div>
                        <select className="hb-form-control" id="bankAccID" onChange={this.changeBankAccount}>{dropdownData.map(MakeItem)}</select>
                    </div>
                    <div className="container-full-width-welcome">
                        <div className="text-h4-white" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            Wydatki i przychody w wybranym miesiącu
                        </div>
                    </div>

                    <div className="container-left-26">
                        <div className="container-top-black">
                            Wydatki do budżetu
                        </div>
                        <div className={redBgBudg ? "container-bottom-red" : "container-bottom-green"} style={{ display: (totalBudgets != 0 && totalExp != 0 ? "block" : "none") }}>
                            {formatter.format(totalExp)}/{formatter.format(totalBudgets)}<br />
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalBudgets == 0 && totalExp != 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Budżet nie został ustalony na wybrany miesiąc
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalExp == 0 && totalBudgets != 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Brak wydatków w wybranym miesiącu
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalExp == 0 && totalBudgets == 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Brak wydatków i budzetu w wybranym miesiącu
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (this.state.mthChoice == "" ? "block" : "none") }}>
                            Miesiąc nie został wybrany
                        </div>
                    </div>

                    <div className="container-middle-41">
                        <div className="container-left-top-black">
                            Oszczędności założone:
                        </div>

                        <div className={redBgBudg ? "container-right-top-red" : "container-right-top-green"}>
                            Pozostało: {formatter.format(totalBudgets - totalExp)}
                            {" ("}Na dzień: {formatter.format((totalBudgets - totalExp) / daysLeftCount(this.state.mthChoice))}{")"}
                        </div>

                        <div className="container-left-bottom-black">
                            Oszczędności rzeczywiste:
                        </div>

                        <div className={redBgInc ? "container-right-bottom-red" : "container-right-bottom-green"}>
                            Pozostało: {formatter.format(totalInc - totalExp)}
                            {" ("}Na dzień: {formatter.format((totalInc - totalExp) / daysLeftCount(this.state.mthChoice))}{")"}
                        </div>
                    </div>

                    <div className="container-right-26">
                        <div className="container-top-black">
                            Wydatki do przychodów
                        </div>
                        <div className={redBgInc ? "container-bottom-red" : "container-bottom-green"} style={{ display: (totalInc != 0 && totalExp != 0 ? "block" : "none") }}>
                            {formatter.format(totalExp)}/{formatter.format(totalInc)}<br />
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalExp == 0 && totalInc != 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Brak wydatków w wybranym miesiącu
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalInc == 0 && totalExp != 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Brak przychodów w wybranym miesiącu
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (totalInc == 0 && totalExp == 0 && this.state.mthChoice != "" ? "block" : "none") }}>
                            Brak przychodów i wydatków w wybranym miesiącu
                        </div>
                        <div className={"container-bottom-black"} style={{ display: (this.state.mthChoice == "" ? "block" : "none") }}>
                            Miesiąc nie został wybrany
                        </div>
                    </div>

                    <div className="container-left-26">
                        <div className="text-h4-white" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            Podział wydatków na kategorie
                        </div>

                        <div className="chart-doughnut">
                            <Doughnut
                                data={dataByCat}
                                height={250}
                                options={optionsDon}
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

                    <div className="container-middle-41" >
                        <div className="text-h4-white" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            {/* Wydatki i przychody w {moment(this.state.mthChoice).format("YYYY")} roku */}
                            Wydatki i przychody w {newDateYYYY(this.state.mthChoice)} roku
                        </div>

                        <div className="chart-bar" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            <Bar
                                title={{ display: false }}
                                data={dataByMonth}
                                height={300}
                                options={optionsBar}
                            />
                        </div>
                        {/* <div className="chart-bar" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            <Bar
                                title={{ display: false }}
                                data={dataByCat}
                                height={300}
                                options={optionsBar2}
                            />
                        </div> */}
                    </div>

                    <div className="container-right-26">
                        <div className="text-h4-white" style={{ display: (this.state.mthChoice != "" ? "block" : "none") }}>
                            Bilans w wybranym przedziale miesięcy
                        </div>

                        <div className="grey-border">
                            <div className="text-h5-white">
                                od:
                                <input type="month" id="mthFilterStartID" onChange={this.filterDataMonthStart}></input>
                                do:
                                <input type="month" id="mthFilterEndID" onChange={this.filterDataMonthEnd}></input>
                            </div>

                            <div className="container-left-black">
                                Oszczędności założone: <br />
                                Pozostało do wydania: <br />
                            </div>

                            <div className={redBgBudgBetwMths ? "container-right-red" : "container-right-green"}>
                                {formatter.format(totalIncBetwMths - totalBudgBetwMths)}<br />
                                {formatter.format(totalBudgBetwMths - totalExpBetwMths)}
                            </div>

                            <div className="container-left-black">
                                Oszczędności rzeczywiste: <br />
                            </div>

                            <div className={redBgIncBetwMths ? "container-right-red" : "container-right-green"}>
                                {formatter.format(totalIncBetwMths - totalExpBetwMths)}
                            </div>

                            <div className="container-left-black">
                                Ilość miesięcy "w budżecie": <br />
                            </div>
                            <div className={redCntInBudget ? "container-right-red" : "container-right-green"}>
                                {cntInBudget}
                            </div>

                            {/* <div className="container-top">5 ostatnich transakcji z wybranego miesiaca</div>
                            <div className="text-h4-white">Wydatki</div>
                            <table className="hb-table-exp">
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
                                                this.state.mthChoice != "" &&
                                                (
                                                    ((expense.cycle == "Nie" && newDateYYYYMM(expense.target_date) == newDateYYYYMM(this.state.mthChoice)))
                                                    || (expense.cycle == "Co miesiac" ||
                                                        (expense.cycle == "Co pol roku" && (newDateMM(this.state.mthChoice) - newDateMM(expense.target_date)) % 6 == 0) ||
                                                        (expense.cycle == "Co rok" && (newDateMM(this.state.mthChoice) - newDateMM(expense.target_date)) % 12 == 0))
                                                    &&
                                                    ((newDateYYYYMM(expense.target_date) == newDateYYYYMM(this.state.mthChoice)) ||
                                                        (newDateYYYYMM(expense.finish_date) == newDateYYYYMM(this.state.mthChoice)) ||
                                                        (newDateYYYYMM(expense.target_date) < newDateYYYYMM(this.state.mthChoice) && newDateYYYYMM(expense.finish_date) > newDateYYYYMM(this.state.mthChoice)))
                                                )
                                        ).slice(0, 5).map(expense =>
                                            <tr key={expense.expenseid}>
                                                <td>{expense.description}</td>
                                                <td>{formatter.format(expense.price)}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table> */}

                        </div>
                    </div>
                    {/* </div> */}
                    <div className="container-left-26"></div>
                    <div className="container-middle-41"></div>
                    <div className="container-right-26"></div>
                </div>
            </>
        )
    }
}

export default WelcomeComponent