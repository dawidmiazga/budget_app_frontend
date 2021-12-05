import React, { Component } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import '../../App.css'
import moment from "moment";
import AuthenticationService from "./AuthenticationService";
import ExpenseDataService from "../../api/to-do/ExpenseDataService";
import CategoryDataService from "../../api/to-do/CategoryDataService";
import randomColor from "randomcolor";

class ChartsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expenses: [],
            categories: [],
            selectYear: "All",
            welcomeMessage: ''
        }

        // this.onSubmit = this.onSubmit.bind(this)
        // this.validate = this.validate.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
    }
    componentDidMount() {
        console.log(' componentDidMount')
        this.refreshExpenses()
        this.refreshCategories()
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
    refreshCategories() {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveAllCategories(username)
            .then(
                response => {
                    this.setState({ categories: response.data })
                }
            )
    }
    render() {
        const uniqueYear = ([...new Set(this.state.expenses.map(expense => moment(expense.targetDate).format('YYYY')))]).sort();
        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        var yearNames = [];
        var totalValueByYear = [];
        var rgbColorByYear = [];
        var totalPrices = [];

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
        console.log(allCategories)

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

        const listAmounts = totalPrices.map((link) =>
            <li key={link}>{link}</li>
        );

        return (
            <>
                <h1>Podsumowanie</h1>
                <div>aaa
                    <div id="left">
                        bbb
                    </div>
                    <div id="right" className="tablebordertest">
                        bbb
                    </div>
                    <div id="navigation">eww</div>
                </div>
                {
                    this.state.expenses.map(
                        expense =>
                            // console.log(expense.description)
                            // {options.map((option) => (
                            <>
                                {/* <div>{expense.description}</div>
                                <div>{uniqueYear.id + "X"}</div>

                                <li>{uniqueYear + "x"}</li> */}


                            </>
                        // ))}

                    )


                }

                <div>
                    <div id="header">
                        <h3>

                        </h3>
                    </div>
                    <div id="left">
                        <Doughnut
                            data={dataByYear}
                            // height={300}
                            options={{
                                // responsive: false,
                                maintainAspectRatio: false,

                            }} />
                        <Doughnut
                            data={dataByCategory}
                            // height={300}
                            options={{
                                // responsive: false,
                                maintainAspectRatio: false,

                            }} />
                    </div>
                    <div id="content">
                        {listAmounts}
                    </div>
                    <div className="tablesize2"> 
                        <Doughnut
                            data={dataByCategory}
                            // width={"50%"} grid flexbox
                            // width={300}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,

                            }} />
                    </div>
                    <div id="footer">
                        footer
                    </div>
                </div>
                <div className="container">

                </div>
            </>
        )
    }
}

export default ChartsComponent
