import { ErrorMessage } from "formik";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import HelloWorldService from '../../api/to-do/HelloWorldService.js'
import styles from '../counter/Counter'
import { Bar, Doughnut } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import ExpenseDataService from '../../api/to-do/ExpenseDataService.js';
import AuthenticationService from './AuthenticationService.js';
import ListExpensesComponent from "./Expenses/ListExpensesComponent.jsx";
import randomColor from "randomcolor";
import CategoryDataService from "../../api/to-do/CategoryDataService";
import { CenturyView } from "react-calendar";
import Picker from 'react-month-picker'
import DatePicker from "react-datepicker";
import IncomeDataService from "../../api/to-do/IncomeDataService.js";
import BudgetDataService from "../../api/to-do/BudgetDataService.js";

class WelcomeComponent extends Component {

    constructor(props) {
        super(props)
        this.retrieveWelcomeMessage = this.retrieveWelcomeMessage.bind(this)
        this.state = {
            datatest2: null,
            expenses: [],
            incomes: [],
            budgets: [],
            categories: [],
            selectYear: "All",
            shchild1: false,
            welcomeMessage: ''
        }
        this.handleSuccesfulResponse = this.handleSuccesfulResponse.bind(this)
        this.handleError = this.handleError.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)
        this.refreshBudgets = this.refreshBudgets.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.filterDataMonth = this.filterDataMonth.bind(this)
        this.refreshMonth = this.refreshMonth.bind(this)
    }

    componentDidMount() {
        // console.log(' componentDidMount')
        // var today = new Date();
        // var today2 = moment(Date()).format("YYYY") + "-" + moment(Date()).format("MM");
        // document.getElementById("monthChoiceFilter").value = today2;
        this.refreshExpenses()
        this.refreshIncomes()
        this.refreshBudgets()
        this.refreshCategories()
        this.refreshMonth()
    }
    refreshMonth() {
        var today2 = moment(Date()).format("YYYY") + "-" + moment(Date()).format("MM");
        document.getElementById("monthChoiceFilter").value = today2;
        this.setState({ datatest2: today2, })
    }
    
    refreshExpenses() {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(username).then(response => { this.setState({ expenses: response.data }) })
    }
    refreshIncomes() {
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(username).then(response => { this.setState({ incomes: response.data }) })
    }
    refreshBudgets() {
        let username = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(username).then(response => { this.setState({ budgets: response.data }) })
    }
    refreshCategories() {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username).then(response => { this.setState({ categories: response.data }) })
    }

    // hideComponent(varname) {
    //     console.log(varname);
    //     switch (varname) {
    //         case "shchild1":
    //             this.setState({ shchild1: !this.state.shchild1 });
    //             break;
    //         default: return;
    //     }
    // }

    filterDataMonth() {
        const datatest = document.getElementById('monthChoiceFilter').value;
        this.setState({ datatest2: datatest, })
        // console.log(datatest);
        // var xxx=new Date(datatest.getfullyear(),datatest.getfullmonth()+1,0)
        // console.log(xxx)
    }

    render() {

        var rgbColorByYear = [];
        var totalPrices = [];

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        const uniqueYear = ([...new Set(this.state.expenses.map(expense => moment(expense.targetDate).format('YYYY')))]).sort();

        // var firstDay = function (y, m) {
        //     return new Date(y, m, 1).getDate();
        // }

        // var lastDay = function (y, m) {
        //     return new Date(y, m + 1, 0).getDate();
        // }

        // var firstChoosenMonthDay= firstDay(moment(this.state.datatest2).format("YYYY"), moment(this.state.datatest2).format("M") - 1)
        // var lastChoosenMonthDay = lastDay(moment(this.state.datatest2).format("YYYY"), moment(this.state.datatest2).format("M") - 1)
        //todo two weeks part
        // if (this.state.datatest2 != null) {
        //     var date = new Date(this.state.datatest2);
        //     var firstDay2 = new Date(date.getFullYear(), date.getMonth(), 1);
        //     var lastDay2 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        // console.log(date)
        // console.log(firstDay2)
        // console.log(lastDay2)

        // var twoWeeksExpenses
        // var amountTestFinishDayAndStartDayPozaWybranymMiesiacem = (this.state.expenses.filter(expense =>
        //     moment(expense.targetDate).format("YYYY-MM-DD") <= moment(firstDay2).format("YYYY-MM-DD") &&
        //     moment(expense.finishDate).format("YYYY-MM-DD") >= moment(lastDay2).format("YYYY-MM-DD") &&
        //     expense.cycle == "Every 2 weeks" &&
        //     Math.floor((
        //         (Date.parse(moment(expense.lastDay2).format("YYYY-MM-DD")) / (1000 * 3600 * 24) -
        //             Date.parse(moment(expense.targetDate).format("YYYY-MM-DD")) / (1000 * 3600 * 24))
        //         / 14
        //     ), 0) >= 3)

        //     .reduce((total, currentItem) => total = total + currentItem.price * 3, 0));
        // var amountTestFinishDayBeforeEndDateTargetDayBeforStartDate3 = (this.state.expenses.filter(expense =>
        //     moment(expense.targetDate).format("YYYY-MM-DD") <= moment(firstDay2).format("YYYY-MM-DD") &&
        //     moment(expense.finishDate).format("YYYY-MM-DD") <= moment(lastDay2).format("YYYY-MM-DD") &&
        //     expense.cycle == "Every 2 weeks" &&
        //     Math.floor((
        //         (Date.parse(moment(expense.lastDay2).format("YYYY-MM-DD")) / (1000 * 3600 * 24) -
        //             Date.parse(moment(expense.targetDate).format("YYYY-MM-DD")) / (1000 * 3600 * 24))
        //         / 14
        //     ), 0) >= 3)
        //     .reduce((total, currentItem) => total = total + currentItem.price * 3, 0));

        // var amountTestFinishDayBeforeEndDateTargetDayBeforStartDate2 = (this.state.expenses.filter(expense =>
        //     moment(expense.targetDate).format("YYYY-MM-DD") <= moment(firstDay2).format("YYYY-MM-DD") &&
        //     moment(expense.finishDate).format("YYYY-MM-DD") <= moment(lastDay2).format("YYYY-MM-DD") &&
        //     expense.cycle == "Every 2 weeks" &&
        //     Math.floor((
        //         (Date.parse(moment(expense.lastDay2).format("YYYY-MM-DD")) / (1000 * 3600 * 24) -
        //             Date.parse(moment(expense.targetDate).format("YYYY-MM-DD")) / (1000 * 3600 * 24))
        //         / 14
        //     ), 0) < 3)
        //     .reduce((total, currentItem) => total = total + currentItem.price * 2, 0));

        // var amountTestFinishDayAfterEndDateTargetDayAfterStartDate3 = (this.state.expenses.filter(expense =>
        //     moment(expense.targetDate).format("YYYY-MM-DD") >= moment(firstDay2).format("YYYY-MM-DD") &&
        //     moment(expense.finishDate).format("YYYY-MM-DD") >= moment(lastDay2).format("YYYY-MM-DD") &&
        //     expense.cycle == "Every 2 weeks" &&
        //     Math.floor((
        //         (Date.parse(moment(expense.lastDay2).format("YYYY-MM-DD")) / (1000 * 3600 * 24) -
        //             Date.parse(moment(expense.targetDate).format("YYYY-MM-DD")) / (1000 * 3600 * 24))
        //         / 14
        //     ), 0) >= 3)
        //     .reduce((total, currentItem) => total = total + currentItem.price * 3, 0));

        // var amountTestFinishDayAfterEndDateTargetDayAfterStartDate2 = (this.state.expenses.filter(expense =>
        //     moment(expense.targetDate).format("YYYY-MM-DD") >= moment(firstDay2).format("YYYY-MM-DD") &&
        //     moment(expense.finishDate).format("YYYY-MM-DD") >= moment(lastDay2).format("YYYY-MM-DD") &&
        //     expense.cycle == "Every 2 weeks" &&
        //     Math.floor((
        //         (Date.parse(moment(expense.lastDay2).format("YYYY-MM-DD")) / (1000 * 3600 * 24) -
        //             Date.parse(moment(expense.targetDate).format("YYYY-MM-DD")) / (1000 * 3600 * 24))
        //         / 14
        //     ), 0) < 3)
        //     .reduce((total, currentItem) => total = total + currentItem.price * 2, 0));

        //     var xxxxx = (this.state.expenses.filter(expense =>
        //         moment(expense.targetDate).format("YYYY-MM-DD") >= moment(firstDay2).format("YYYY-MM-DD") )
        //         .reduce((total, currentItem) => total = total + 1, 0));

        // console.log("======")
        // console.log(xxxxx)
        // console.log(amountTestFinishDayBeforeEndDateTargetDayBeforStartDate2 + " amountTestFinishDayBeforeEndDateTargetDayBeforStartDate2")
        // console.log(amountTestFinishDayBeforeEndDateTargetDayBeforStartDate3 + " amountTestFinishDayBeforeEndDateTargetDayBeforStartDate3")
        // console.log(amountTestFinishDayAfterEndDateTargetDayAfterStartDate2 + " amountTestFinishDayAfterEndDateTargetDayAfterStartDate2")
        // console.log(amountTestFinishDayAfterEndDateTargetDayAfterStartDate3 + " amountTestFinishDayBeforeEndDateTargetDayBeforStartDate3")
        // }

        // console(twoWeeksExpenses)

        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================
        // let tttttest;
        // if (this.state.datatest2 == null) {
        //     tttttest = (this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price, 0));
        // } else {
        //     tttttest = (this.state.expenses.filter(expense =>
        //         Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2) ||

        //         (Date.parse(moment(expense.finishDate).format("YYYY-MM")) >= Date.parse(this.state.datatest2)) &&
        //         Date.parse(moment(expense.targetDate).format("YYYY-MM")) <= Date.parse(this.state.datatest2))

        //         .reduce((total, currentItem) => total = total + currentItem.price, 0));
        // }
        // // console.log("tttttest " + tttttest)

        // let monthlyExpenseTotal;
        // if (this.state.datatest2 == null) {
        //     monthlyExpenseTotal = (this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price, 0));
        // } else {
        //     monthlyExpenseTotal = (this.state.expenses.filter(expense =>
        //         Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2) ||

        //         (Date.parse(moment(expense.finishDate).format("YYYY-MM")) >= Date.parse(this.state.datatest2)) &&
        //         Date.parse(moment(expense.targetDate).format("YYYY-MM")) <= Date.parse(this.state.datatest2))

        //         .reduce((total, currentItem) => total = total + currentItem.price, 0));
        // }
        // console.log("monthlyExpenseTotal " + monthlyExpenseTotal)
        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================
        // ==============================================================================================================

        //todo monthly count
        var monthlyExpenseTotal;
        var qtrExpenseTotal;
        var oneTimeExpenseTotal;
        var totalExpenses;
        if (this.state.datatest2 == null) {
            totalExpenses = monthlyExpenseTotal + qtrExpenseTotal + oneTimeExpenseTotal;//(this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price, 0));
        } else {
            monthlyExpenseTotal = (this.state.expenses.filter(expense =>
                expense.cycle == "Every month" &&
                (
                    (
                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    ) ||
                    (
                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    ) ||
                    (
                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) < Date.parse(moment(this.state.datatest2).format("YYYY-MM")) &&
                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) > Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    )
                )

            ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            qtrExpenseTotal = (this.state.expenses.filter(expense =>
                expense.cycle == "Every six months" &&

                ((moment(this.state.datatest2).format("MM") - moment(expense.targetDate).format("MM")) % 6) == 0 &&

                (
                    (
                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    ) || (
                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    ) || (
                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) < Date.parse(moment(this.state.datatest2).format("YYYY-MM")) &&
                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) > Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                    )
                )

            ).reduce((total, currentItem) => total = total + currentItem.price, 0));

            oneTimeExpenseTotal = (this.state.expenses.filter(expense =>
                expense.cycle == "Nie" && Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));

            totalExpenses = monthlyExpenseTotal + qtrExpenseTotal + oneTimeExpenseTotal
        }

        console.log(monthlyExpenseTotal + qtrExpenseTotal + oneTimeExpenseTotal)

        // let totalExpenses;
        // if (this.state.datatest2 == null) {
        //     // totalExpenses = (this.state.expenses.reduce((total, currentItem) => total = total + currentItem.price, 0));
        // } else {
        //     totalExpenses = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Nie" && Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2))
        //         .reduce((total, currentItem) => total = total + currentItem.price, 0));
        // }
        // console.log("totalExpenses " + totalExpenses)

        let totalIncomes;
        if (this.state.datatest2 == null) {
            // totalIncomes = (this.state.incomes.reduce((total, currentItem) => total = total + currentItem.amount, 0));
        } else {
            totalIncomes = (this.state.incomes.filter(income =>
                Date.parse(moment(income.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2))
                .reduce((total, currentItem) => total = total + currentItem.amount, 0));
        }
        // console.log("totalIncomes " + totalIncomes)

        var totalBudgets;
        var totalExpenses2;
        if (this.state.datatest2 == null) {
            totalBudgets = null;
            totalExpenses2 = null;
        } else {
            totalBudgets = (this.state.budgets.filter(budget =>
                Date.parse(moment(budget.targetMonth).format("YYYY-MM")) == Date.parse(this.state.datatest2))
                .reduce((total, currentItem) => total = total + currentItem.amount, 0));
            totalExpenses2 = (this.state.expenses.filter(expense =>
                Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        }
        // console.log("totalBudgets " + totalBudgets)
        // console.log("totalExpenses2 " + totalExpenses2)

        var yearNames = [];
        var totalValueByYear = [];
        for (let i = 0; i < uniqueYear.length; i++) {
            rgbColorByYear[i] = randomColor();
            yearNames[i] = uniqueYear[i];

            totalValueByYear[i] = (this.state.expenses.filter(expense =>
                moment(expense.targetDate).format('yyyy') == uniqueYear[i])
                .reduce((total, currentItem) => total = total + currentItem.price, 0));

            totalPrices[i] = uniqueYear[i] + ": " + formatter.format((this.state.expenses.filter(expense =>
                moment(expense.targetDate).format('yyyy') == uniqueYear[i])
                .reduce((total, currentItem) => total = total + currentItem.price, 0)));
        }

        const allCategories = this.state.categories.map(category => category.categoryname);

        var categoryNames = [];
        var rgbColorByCategory = [];
        var totalValueByCategory = [];

        for (let i = 0; i < allCategories.length; i++) {
            rgbColorByCategory[i] = randomColor();
            categoryNames[i] = allCategories[i];

            totalValueByCategory[i] = this.state.expenses.filter(expense =>
                expense.category == allCategories[i])
                .reduce((total, currentItem) => total = total + currentItem.price, 0);
        }
        // console.log(allCategories)

        let isBackgroundRed1;
        if ((totalIncomes - totalExpenses) >= 0) {
            isBackgroundRed1 = false;
        } else {
            isBackgroundRed1 = true;
        }

        let isBackgroundRed2;
        if ((totalBudgets - totalExpenses) >= 0) {
            isBackgroundRed2 = false;
        } else {
            isBackgroundRed2 = true;
        }
        const dataByYear = {
            labels: yearNames,
            datasets: [{
                data: totalValueByYear,
                backgroundColor: rgbColorByYear,
                // hoverBackgroundColor: ['#FF6384']
            }]
        };
        const dataByCategory = {
            labels: allCategories,
            datasets: [{
                data: totalValueByCategory,
                backgroundColor: rgbColorByCategory,
                // hoverBackgroundColor: ['#FF6384']
            }]
        };
        return (
            <>
                {/* <div className="background-color-all"> */}
                <div>
                    <h1>Podsumowanie</h1>
                    <div className="row">
                        <div className="container-left">
                            <div>
                                Please select the month
                            </div>
                            <div>

                                <input
                                    type="month"
                                    id="monthChoiceFilter"
                                    onChange={this.filterDataMonth}
                                >
                                    {/* value="2017-06"> */}
                                </input>
                            </div>
                            <div className={isBackgroundRed1 ? 'container-container-middle-red' : 'container-container-middle-green'}>
                                Wallet balance
                                <br />
                                {/* {formatter.format(totalIncomes - totalExpenses)} */}
                                {formatter.format(totalExpenses)}/{formatter.format(totalIncomes)}
                            </div>
                            <div class="row">
                                <div className="container-container-left">
                                    <td>
                                        Wydatki
                                        w danym okresie
                                        <br />
                                        {formatter.format(totalExpenses)}
                                    </td>
                                </div>
                                <div className="container-container-right">
                                    <td>
                                        Przychody
                                        w danym okresie
                                        <br />
                                        {formatter.format(totalIncomes)}
                                    </td>
                                </div>
                            </div>
                            <div className={isBackgroundRed2 ? 'container-container-middle-red' : 'container-container-middle-green'}>
                                Budget balance
                                <br />
                                {formatter.format(totalExpenses)}/{formatter.format(totalBudgets)}
                            </div>
                        </div>
                        <div className="container-middle" >
                            middle
                            {/* <Doughnut
                                data={dataByCategory}
                                height={300}
                                options={{
                                    responsive: false,
                                    maintainAspectRatio: false,



                                }} /> */}
                        </div>
                        <div className="container-right">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Opis</th>
                                        <th>Kwota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.expenses.filter
                                            (expense =>
                                                this.state.datatest2 == null ||
                                                (
                                                    (expense.cycle == "Nie" && Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(this.state.datatest2))
                                                ) ||
                                                (
                                                    expense.cycle == "Every month" &&
                                                    (
                                                        (
                                                            Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                        ) ||
                                                        (
                                                            Date.parse(moment(expense.finishDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                        ) ||
                                                        (
                                                            Date.parse(moment(expense.targetDate).format("YYYY-MM")) < Date.parse(moment(this.state.datatest2).format("YYYY-MM")) &&
                                                            Date.parse(moment(expense.finishDate).format("YYYY-MM")) > Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                        )
                                                    )
                                                ) ||
                                                expense.cycle == "Every six months" &&

                                                ((moment(this.state.datatest2).format("MM") - moment(expense.targetDate).format("MM")) % 6) == 0 &&

                                                (
                                                    (
                                                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                    ) || (
                                                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) == Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                    ) || (
                                                        Date.parse(moment(expense.targetDate).format("YYYY-MM")) < Date.parse(moment(this.state.datatest2).format("YYYY-MM")) &&
                                                        Date.parse(moment(expense.finishDate).format("YYYY-MM")) > Date.parse(moment(this.state.datatest2).format("YYYY-MM"))
                                                    )
                                                )

                                            ).slice(0, 10).map(
                                                expense =>
                                                    <tr key={expense.id}>
                                                        <td>{expense.description}</td>
                                                        <td>{formatter.format(expense.price)}</td>
                                                    </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    retrieveWelcomeMessage() {
        HelloWorldService.executeHelloWorldPathVariableService(this.props.match.params.name)
            .then(response => this.handleSuccesfulResponse(response))
            .catch(error => this.handleError(error))
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
}

export default WelcomeComponent