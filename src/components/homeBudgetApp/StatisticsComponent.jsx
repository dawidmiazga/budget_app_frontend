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
        let usernameid = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.retrieveAllExpenses(usernameid)
            .then(
                response => {
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

    refreshCategories() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(usernameid)
            .then(
                response => {
                    this.setState({ categories: response.data })
                }
            )
    }

    refreshBudgets() {
        let usernameid = AuthenticationService.getLoggedInUserName()
        BudgetDataService.retrieveAllBudgets(usernameid).then(response => { this.setState({ budgets: response.data }) })
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

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        function cycleCount(tDate, fDate, sDate, eDate, whatCycle, nazwa, cena) {
            var tDate = new Date(tDate);
            var fDate = new Date(fDate);
            var sDate = new Date(sDate);
            var eDate = new Date(eDate);

            var firstDayStartDate = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
            var lastDayEndDate = new Date(eDate.getFullYear(), eDate.getMonth() + 1, 0);

            var mthCnt = 0;
            var mthCntPrep = 0;
            var yrCnt = 0;

            if (sDate <= eDate) {
                if (sDate < tDate) {
                    sDate = tDate
                }
                if (eDate > fDate) {
                    eDate = fDate
                }
                if (whatCycle == "Nie" &&
                    newDateYYYYMMDD(tDate) >= newDateYYYYMMDD(firstDayStartDate) &&
                    newDateYYYYMMDD(tDate) <= newDateYYYYMMDD(lastDayEndDate)
                ) {
                    mthCnt += 1
                } else if (whatCycle == "Nie" && (
                    newDateYYYYMMDD(tDate) >= newDateYYYYMMDD(firstDayStartDate) ||
                    newDateYYYYMMDD(tDate) <= newDateYYYYMMDD(lastDayEndDate))
                ) {
                    mthCnt = 0
                } else if (whatCycle == "Co miesiac") {
                    yrCnt = (eDate.getFullYear() - sDate.getFullYear()) * 12;
                    mthCnt = yrCnt + eDate.getMonth() - sDate.getMonth() + 1
                } else {
                    var divideNr
                    if (whatCycle == "Co pol roku") {
                        divideNr = 6
                    } else if (whatCycle == "Co rok") {
                        divideNr = 12
                    }
                    if ((sDate.getMonth() - tDate.getMonth()) % divideNr != 0) {
                        if (sDate.getMonth() < tDate.getMonth()) {
                            sDate = new Date(sDate.setMonth(tDate.getMonth()))
                        } else {
                            sDate = new Date(sDate.setMonth(tDate.getMonth() + divideNr))
                        }
                    }
                    yrCnt = (eDate.getFullYear() - sDate.getFullYear()) * 12;
                    mthCntPrep = yrCnt + eDate.getMonth() - sDate.getMonth()
                    mthCnt += Math.ceil(mthCntPrep / divideNr)
                    if ((eDate.getMonth() - tDate.getMonth()) % divideNr == 0) {
                        mthCnt += 1
                    }
                }
            }
            if (mthCnt < 0) { mthCnt = 0 }
            return mthCnt;
        }

        const arrMthEng = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun", "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"]
        const arrMthPol = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"]

        var totalExpensesPastYear = 0;
        var totalIncomesPastYear = 0;
        var totalExpensesCurrentYear = 0;
        var totalExpensesCurrentYearTillDate = 0;
        var totalIncomesCurrentYear = 0;
        var totalIncomesCurrentYearTillDate = 0;

        var today = new Date();
        const currMth = newDateYYYYMM(new Date(today.getFullYear(), today.getMonth()))
        const currentYear = today.getFullYear();
        const pastYear = currentYear - 1

        var totalBudgetCurrentYear = (this.state.budgets.filter
            (budget => newDateYYYY(budget.target_month) == currentYear
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

        var totalBudgetCurrentYearTillDate = (this.state.budgets.filter
                (budget => newDateYYYY(budget.target_month) == currentYear && newDateYYYYMM(budget.target_month) <= currMth
                ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

                
        var totalBudgetPastYear = (this.state.budgets.filter
            (budget => newDateYYYY(budget.target_month) == pastYear
            ).reduce((total, currentItem) => total = total + currentItem.amount, 0));

        var TotalValueByMonthExpensesPastYear = [];
        var newMthFullDatePast = [];
        var newMthParsedDatePast = [];
        for (let i = 0; i < arrMthEng.length; i++) {
            newMthFullDatePast[i] = new Date(arrMthEng[i])
            newMthParsedDatePast[i] = newDateYYYYMM(new Date(pastYear, newMthFullDatePast[i].getMonth()))
            TotalValueByMonthExpensesPastYear[i] =
                (this.state.expenses.reduce((total, currentItem) => total = total + (currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDatePast[i]),
                        newDateYYYYMMDD(newMthParsedDatePast[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    )), 0));
            totalExpensesPastYear += TotalValueByMonthExpensesPastYear[i]
        }

        var TotalValueByMonthIncomesPastYear = [];
        var newMthFullDatePast = [];
        var newMthParsedDatePast = [];
        for (let i = 0; i < arrMthEng.length; i++) {
            newMthFullDatePast[i] = new Date(arrMthEng[i])
            newMthParsedDatePast[i] = newDateYYYYMM(new Date(pastYear, newMthFullDatePast[i].getMonth()))
            TotalValueByMonthIncomesPastYear[i] =
                (this.state.incomes.reduce((total, currentItem) => total = total + (currentItem.amount *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDatePast[i]),
                        newDateYYYYMMDD(newMthParsedDatePast[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.amount
                    )), 0));
            totalIncomesPastYear += TotalValueByMonthIncomesPastYear[i]
        }

        var TotalValueByMonthExpensesCurrentYear = [];
        var TotalValueByMonthExpensesCurrentYearTillDate = [];
        var newMthFullDateCurr = [];
        var newMthParsedDateCurr = [];
        for (let i = 0; i < arrMthEng.length; i++) {
            newMthFullDateCurr[i] = new Date(arrMthEng[i])
            newMthParsedDateCurr[i] = newDateYYYYMM(new Date(currentYear, newMthFullDateCurr[i].getMonth()))
            TotalValueByMonthExpensesCurrentYear[i] =
                (this.state.expenses.reduce((total, currentItem) => total = total + (currentItem.price *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDateCurr[i]),
                        newDateYYYYMMDD(newMthParsedDateCurr[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.price
                    )), 0));

            if (newMthParsedDateCurr[i] <= currMth) {
                TotalValueByMonthExpensesCurrentYearTillDate[i]=TotalValueByMonthExpensesCurrentYear[i]
                totalExpensesCurrentYearTillDate += TotalValueByMonthExpensesCurrentYear[i]
            }
            
            totalExpensesCurrentYear += TotalValueByMonthExpensesCurrentYear[i]
        }

        var TotalValueByMonthIncomesCurrentYear = [];
        var TotalValueByMonthIncomesCurrentYearTillDate = [];
        var newMthFullDateCurr = [];
        var newMthParsedDateCurr = [];
        for (let i = 0; i < arrMthEng.length; i++) {
            newMthFullDateCurr[i] = new Date(arrMthEng[i])
            newMthParsedDateCurr[i] = newDateYYYYMM(new Date(currentYear, newMthFullDateCurr[i].getMonth()))
            TotalValueByMonthIncomesCurrentYear[i] =
                (this.state.incomes.reduce((total, currentItem) => total = total + (currentItem.amount *
                    cycleCount(
                        currentItem.target_date,
                        currentItem.finish_date,
                        newDateYYYYMMDD(newMthParsedDateCurr[i]),
                        newDateYYYYMMDD(newMthParsedDateCurr[i]),
                        currentItem.cycle,
                        currentItem.description,
                        currentItem.amount
                    )), 0));

            if (newMthParsedDateCurr[i] <= currMth) {
                TotalValueByMonthIncomesCurrentYearTillDate[i] = TotalValueByMonthIncomesCurrentYear[i]
                totalIncomesCurrentYearTillDate += TotalValueByMonthIncomesCurrentYear[i]
            }

            totalIncomesCurrentYear += TotalValueByMonthIncomesCurrentYear[i]
        }

        const allCategories = this.state.categories.map(category => category.categoryname);
        const categoriesColor = this.state.categories.map(category => category.hexcolor);

        var categoryNamesPastYear = [];
        var categoriesWithValuesPastYear = [];
        var totalPriceByCatPastYear = [];
        var rgbColorByCategoryPastYear = [];
        var TotalValueByCategoryPastYear = [];
        var tempSum = []

        var j = 0;
        for (let i = 0; i < allCategories.length; i++) {
            categoryNamesPastYear[i] = allCategories[i];
            var checkValuePastYear = 0
            var startdatenew = getFirstDayOfYear(pastYear)
            var enddatenew = getLastDayOfYear(pastYear)
            tempSum[i] =
                (this.state.expenses
                    .filter(expense => (
                        categoryMap(expense.category, this.state.categories) == allCategories[i]
                    ))
                    .reduce((total, currentItem) => total = total + (currentItem.price *
                        cycleCount(
                            currentItem.target_date,
                            currentItem.finish_date,
                            newDateYYYYMMDD(startdatenew),
                            newDateYYYYMMDD(enddatenew),
                            currentItem.cycle,
                            currentItem.description,
                            currentItem.price
                        )), 0));

            checkValuePastYear += tempSum[i]

            if (checkValuePastYear != 0) {
                rgbColorByCategoryPastYear[j] = categoriesColor[i];
                TotalValueByCategoryPastYear[j] = tempSum[i]
                totalPriceByCatPastYear[j] = categoryNamesPastYear[i] + ": " + TotalValueByCategoryPastYear[i]
                categoriesWithValuesPastYear[j] = categoryNamesPastYear[i]
                j = j + 1
            }
        }

        function getFirstDayOfYear(year) {
            return new Date(year, 0, 1);
        }
        function getLastDayOfYear(year) {
            return new Date(year, 11, 31);
        }

        var categoryNamesCurrentYear = [];
        var categoriesWithValuesCurrentYear = [];
        var totalPriceByCatCurrentYear = [];
        var rgbColorByCategoryCurrentYear = [];
        var TotalValueByCategoryCurrentYear = [];

        var j = 0;
        for (let i = 0; i < allCategories.length; i++) {
            categoryNamesCurrentYear[i] = allCategories[i];
            var checkValueCurrentYear = 0
            var startdatenew = getFirstDayOfYear(currentYear)
            var enddatenew = getLastDayOfYear(currentYear)
            tempSum[i] =
                (this.state.expenses
                    .filter(expense => (
                        categoryMap(expense.category, this.state.categories) == allCategories[i]
                    ))
                    .reduce((total, currentItem) => total = total + (currentItem.price *
                        cycleCount(
                            currentItem.target_date,
                            currentItem.finish_date,
                            newDateYYYYMMDD(startdatenew),
                            newDateYYYYMMDD(enddatenew),
                            currentItem.cycle,
                            currentItem.description,
                            currentItem.price
                        )), 0));

            checkValueCurrentYear += tempSum[i]

            if (checkValueCurrentYear != 0) {
                rgbColorByCategoryCurrentYear[j] = categoriesColor[i];
                TotalValueByCategoryCurrentYear[j] = checkValueCurrentYear
                totalPriceByCatCurrentYear[j] = categoryNamesCurrentYear[i] + ": " + TotalValueByCategoryCurrentYear[i]
                categoriesWithValuesCurrentYear[j] = categoryNamesCurrentYear[i]
                j = j + 1
            }
        }

        const dataByMonthExpPastYear = {
            labels: arrMthPol,
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
            labels: arrMthPol,
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

        const dataByMonthExpCurrentYearTillDate = {
            labels: arrMthPol,
            datasets: [{
                label: 'Wydatki',
                data: TotalValueByMonthExpensesCurrentYearTillDate,
                backgroundColor: '#2177ef',

            },
            {
                label: 'Przychody',
                data: TotalValueByMonthIncomesCurrentYearTillDate,
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

        const dataByCategoryCurrentYearTillDate = {
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
data={dataByCategoryCurrentYearTillDate}
height={300}
options={optionsDon}
/>
</div>
</div>
<div className="container-stats-middle">
<div className="chart-bar">
<Bar
title={{ display: false }}
data={dataByMonthExpCurrentYearTillDate}
height={280}
options={optionsBar}
/>
</div>
</div>
<div className="container-stats-right" >
<div className="text-20px-white">
Rzeczywiste: {formatter.format(totalIncomesCurrentYearTillDate - totalExpensesCurrentYearTillDate)} <br />
<div className="chart-bar">
<Bar
title={{ display: false }}
data={dataForSavingsFromIncomesCurrentYear}
height={80}
options={optionsBar2}
/>
</div>
Zalozone: {formatter.format(totalBudgetCurrentYearTillDate - totalExpensesCurrentYearTillDate)} <br />
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
