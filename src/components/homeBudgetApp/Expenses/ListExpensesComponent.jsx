import moment from "moment";
import React, { Component } from "react";
import ExpenseDataService from '../../../api/to-do/ExpenseDataService.js';
import AuthenticationService from '../AuthenticationService.js';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-datepicker/dist/react-datepicker.css'
import "../../../App.css"
import DatePicker from "react-datepicker";
import SortTable from "../SortTable.jsx";

class ListExpensesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
            endDate: "",
            startDate2: null,
            endDate2: null,
            expenses: [],
            message: null,
            selectYear: "All",
            selectMonth: "All",
            selectDate: Date(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
        }

        this.deleteExpenseClicked = this.deleteExpenseClicked.bind(this)
        this.updateExpenseClicked = this.updateExpenseClicked.bind(this)
        this.addExpenseClicked = this.addExpenseClicked.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
        this.handleSelect = this.handleSelect.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.handleChange2 = this.handleChange2.bind(this);
        this.changeStartDateCal = this.changeStartDateCal.bind(this);
        this.changeEndDateCal = this.changeEndDateCal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);

    }

    componentWillUnmount() {
        // console.log('componoentWillUnmoiunt')
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate')
        return true;
    }

    componentDidMount() {
        // console.log(' componentDidMount')
        this.refreshExpenses()
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

    deleteExpenseClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        ExpenseDataService.deleteExpense(username, id)
            .then(
                response => {
                    this.setState({ message: `Expense deleted` })
                    this.refreshExpenses()
                }
            )
    }

    updateExpenseClicked(id) {
        this.props.history.push(`/expenses/${id}`)
    }

    addExpenseClicked() {
        this.props.history.push(`/expenses/-1`)
    }

    handleSelect(date) {
        // console.log("eee");
    }

    handleSelect2(ranges) {
        // console.log("Start date: " + (ranges.selection.startDate.getMonth()) + (ranges.selection.startDate.getFullYear()));
        // console.log("End date: " + (ranges.selection.endDate.getMonth()) + (ranges.selection.endDate.getFullYear()));
        // console.log("Start date: " + ranges.selection.startDate);
        // console.log("End date: " + ranges.selection.endDate);
    }

    // handleChange(date) {
    //     // const datatest = document.getElementById('startDate22').value
    //     // console.log(this.state.startDate)
    //     this.setState({ startDate: date, })
    //     console.log("startDate2 " + date)
    // }
    // handleChange2(date) {
    //     this.setState({ endDate: date, })
    // }

    changeStartDateCal() {
        const datatest = document.getElementById('startDateIdField').value
        this.setState({ startDate: datatest, })
        console.log("startDate2 " + datatest)
    }
    changeEndDateCal() {
        const datatest = document.getElementById('endDateIdField').value
        this.setState({ endDate: datatest, })
        console.log("endDate2 " + datatest)
    }

    onFormSubmit(e) {
        e.preventDefault();
        // console.log("onFormSubmit" + this.state.startDate)
    }

    render() {

        // let howManyWeeks;
        // // howManyWeeks = Math.round(Date.parse(this.state.expense.finishDate) / (1000 * 3600 * 24), 0) -
        // //     Math.round(Date.parse(this.state.expense.targetDate) / (1000 * 3600 * 24), 0)
        // if (this.state.startDate == null || this.state.endDate == null) {
        //     howManyWeeks = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every 2 weeks")
        //         .reduce((total, currentItem) => total = total + currentItem.price * (2), 0));
        // } else {
        //     howManyWeeks = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every 2 weeks" &&
        //         Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
        //         Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
        //         .reduce((total, currentItem) => total = total + currentItem.price * (currentItem.price), 0));
        // }
        // console.log("howManyWeeks" + howManyWeeks)
        // console.log(this.state.startDate)
        // console.log(this.state.endDate)

        // console.log(Date.parse(this.state.startDate))
        // console.log(moment(Date.parse(this.state.endDate)).format("DD-MM-YYYY"))
        let totalSingle;
        if (this.state.startDate == "" && this.state.endDate == "") {
            totalSingle = (this.state.expenses.filter(expense =>

                expense.cycle == "Nie")
                .reduce((total, currentItem) => total = total + currentItem.price, 0));

        } else if (this.state.endDate == "") {
            totalSingle = (this.state.expenses.filter(expense =>

                expense.cycle == "Nie" &&
                moment(Date.parse(expense.targetDate)).format("YYYY-MM-DD") >= moment(Date.parse(this.state.startDate)).format("YYYY-MM-DD"))

                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        } else if (this.state.startDate == "") {
            totalSingle = (this.state.expenses.filter(expense =>

                expense.cycle == "Nie" &&
                moment(Date.parse(expense.finishDate)).format("YYYY-MM-DD") <= moment(Date.parse(this.state.endDate)).format("YYYY-MM-DD"))

                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        } else {
            totalSingle = (this.state.expenses.filter(expense =>

                expense.cycle == "Nie" &&
                moment(Date.parse(expense.targetDate)).format("YYYY-MM-DD") >= moment(Date.parse(this.state.startDate)).format("YYYY-MM-DD") &&
                moment(Date.parse(expense.targetDate)).format("YYYY-MM-DD") <= moment(Date.parse(this.state.endDate)).format("YYYY-MM-DD"))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        }











        // let totalCyclicalOneWeek;
        // if (this.state.startDate == null || this.state.endDate == null) {
        //     totalCyclicalOneWeek = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every week")
        //         .reduce((total, currentItem) => total = total + currentItem.price * 4, 0));
        // } else {
        //     totalCyclicalOneWeek = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every week" &&
        //         Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
        //         Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
        //         .reduce((total, currentItem) => total = total + currentItem.price * 4, 0));
        // }

        // let totalCyclicalTwoWeeks;
        // if (this.state.startDate == null || this.state.endDate == null) {
        //     totalCyclicalTwoWeeks = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every 2 weeks")
        //         .reduce((total, currentItem) => total = total + currentItem.price * 2, 0));
        // } else {
        //     totalCyclicalTwoWeeks = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every 2 weeks" &&
        //         Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
        //         Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
        //         .reduce((total, currentItem) => total = total + currentItem.price * 2, 0));
        // }

        let totalCyclicalOneMonth;
        if (this.state.startDate == "" && this.state.endDate == "") {
            totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
                expense.cycle == "Every month")
                .reduce((total, currentItem) => total = total + currentItem.price * (moment(currentItem.finishDate).format("MM") - moment(currentItem.targetDate).format("MM") + 1), 0));
        } else if (this.state.startDate == "") {
            totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
                expense.cycle == "Every month" &&
                Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
                Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));











                
        } else if (this.state.endDate == "") {
            totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
                expense.cycle == "Every month" &&
                Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
                Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        } else {
            totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
                expense.cycle == "Every month" &&
                Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
                Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
                .reduce((total, currentItem) => total = total + currentItem.price, 0));
        }


        // let totalCyclicalOneMonth;
        // if ((this.state.startDate == null || this.state.endDate == null) || this.state.startDate == "" || this.state.endDate == "") {
        //     totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every month")
        //         .reduce((total, currentItem) => total = total + currentItem.price * (
        //             Math.floor(moment(currentItem.finishDate).format("MM") - moment(currentItem.targetDate).format("MM"))
        //         ), 0));
        // } else {
        //     totalCyclicalOneMonth = (this.state.expenses.filter(expense =>
        //         expense.cycle == "Every month" &&
        //         Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) &&
        //         Date.parse(expense.targetDate) <= Date.parse(this.state.endDate))
        //         .reduce((total, currentItem) => total = total + currentItem.price, 0));
        // }

        let totalCyclical;
        totalCyclical = totalCyclicalOneMonth //+ totalCyclicalTwoWeeks + totalCyclicalOneWeek
        // console.log("Start date :" + this.state.startDate)
        // console.log("End date :" + this.state.endDate)

        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });

        return (
            // <div className="background-color-all">
            <div>
                <div>
                    <div>
                        <h1>Expenses</h1>
                    </div>
                    <div>
                        Wybierz zakres dat:
                    </div>
                    <div>
                        {/* <DatePicker selected={this.state.startDate} onChange={this.handleChange} name="startDate" dateFormat="dd/MM/yyyy" showYearDropdown showMonthDropdown todayButton='Dzisiaj' isClearable={true} withPortal placeholderText='Wybierz date poczatkowa' />
                        <DatePicker selected={this.state.endDate} onChange={this.handleChange2} name="endDate" dateFormat="dd/MM/yyyy" showYearDropdown showMonthDropdown todayButton='Dzisiaj' isClearable withPortal placeholderText='Wybierz date koncowa' /> */}
                        <input
                            type="date"
                            id="startDateIdField"
                            onChange={this.changeStartDateCal}
                        >
                        </input>
                        <input
                            type="date"
                            id="endDateIdField"
                            onChange={this.changeEndDateCal}
                        >
                        </input>
                    </div>
                </div>
                <form onSubmit={this.onFormSubmit}>

                </form>

                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}

                {/* <div class="row"> */}
                {/* <div className="container-left-expenses"> */}
                <div>
                    <div>
                        <h3>Wydatki pojedyńcze</h3>
                    </div>
                    <div>
                        <h5>
                            Suma w wybranym okresie: {formatter.format(totalSingle)}
                        </h5>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={this.refreshExpenses}>Opis</th>
                                <th onClick={() => console.log(this.testsum)}>Data transakcji</th>
                                <th>Kategoria</th>
                                <th>Komentarz</th>
                                <th>Kwota</th>
                                {/* <th>Cykliczność</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.expenses.filter(expense =>
                                    (this.state.startDate == "" && this.state.endDate == "" && expense.cycle == "Nie") ||
                                    (this.state.startDate == "" && moment(Date.parse(expense.targetDate)).format("YYYY-MM-DD") <= moment(Date.parse(this.state.endDate)).format("YYYY-MM-DD") && expense.cycle == "Nie") ||
                                    (this.state.endDate == "" && moment(Date.parse(expense.targetDate)).format("YYYY-MM-DD") >= moment(Date.parse(this.state.startDate)).format("YYYY-MM-DD") && expense.cycle == "Nie") ||
                                    (Date.parse(expense.targetDate) >= Date.parse(this.state.startDate) && Date.parse(expense.targetDate) <= Date.parse(this.state.endDate) && expense.cycle == "Nie")
                                ).map(
                                    expense =>

                                        <tr key={expense.id}>

                                            <td>{expense.description}</td>
                                            <td>{moment(expense.targetDate).format('DD-MM-YYYY')}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.comment}</td>
                                            <td>{formatter.format(expense.price)}</td>
                                            {/* <td>{Date.parse(expense.targetDate)}</td> */}

                                            <td>

                                                <button
                                                    className="button_edit"
                                                    onClick={() => this.updateExpenseClicked(expense.id)}>
                                                    Edit
                                                </button>

                                                <button
                                                    className="button_delete"
                                                    onClick={() => this.deleteExpenseClicked(expense.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                            {/* <tr><td /><td /><td /><td />Total: {formatter.format(totalSingle)}</tr> */}
                        </tfoot>
                    </table>
                </div>
                {/* <div className="container-right-expenses"> */}
                <div>
                    <div>
                        <h3>Wydatki cykliczne</h3>
                    </div>
                    <div>
                        <h5>
                            Suma w wybranym okresie: {formatter.format(totalCyclical)}
                        </h5>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={this.refreshExpenses}>Opis</th>
                                <th>Data rozpoczecia</th>
                                <th>Data zakonczenia</th>
                                <th>Kategoria</th>
                                <th>Komentarz</th>
                                <th>Kwota</th>
                                <th>Cykliczność</th>
                                {/* <th>dni</th>
                                <th>ilosc cykli</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.expenses.filter(expense =>
                                    expense.cycle != "Nie" && (
                                        (this.state.startDate == "" && this.state.endDate == "") ||
                                        (this.state.endDate == "" && moment(Date.parse(expense.finishDate)).format("YYYY-MM-DD") >= moment(Date.parse(this.state.startDate)).format("YYYY-MM-DD")) ||
                                        (this.state.startDate == "" && moment(Date.parse(expense.startDate)).format("YYYY-MM-DD") <= moment(Date.parse(this.state.endDate)).format("YYYY-MM-DD")) ||
                                        Date.parse(expense.finishDate) >= Date.parse(this.state.startDate)
                                    )
                                ).map(
                                    expense =>

                                        <tr key={expense.id}>

                                            <td>{expense.description}</td>
                                            <td>{moment(expense.targetDate).format('DD-MM-YYYY')}</td>
                                            <td>{moment(expense.finishDate).format('DD-MM-YYYY')}</td>
                                            <td>{expense.category}</td>
                                            <td>{expense.comment}</td>
                                            <td>{formatter.format(expense.price)}</td>
                                            <td>{expense.cycle}</td>
                                            {/* <td>
                                                {
                                                    Math.round(Date.parse(expense.finishDate) / (1000 * 3600 * 24), 0) -
                                                    Math.round(Date.parse(expense.targetDate) / (1000 * 3600 * 24), 0)
                                                }
                                            </td>
                                            <td>
                                                {
                                                    Math.floor((
                                                        (Date.parse(expense.finishDate) / (1000 * 3600 * 24) -
                                                            Date.parse(expense.targetDate) / (1000 * 3600 * 24))
                                                        / 14
                                                    ), 0)
                                                }
                                            </td> */}

                                            <td>

                                                <button
                                                    className="button_edit"
                                                    onClick={() => this.updateExpenseClicked(expense.id)}>
                                                    Edit
                                                </button>

                                                <button
                                                    className="button_delete"
                                                    onClick={() => this.deleteExpenseClicked(expense.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                            {/* <tr><td /><td /><td /><td /><td />Total: {formatter.format(totalCyclical)}</tr> */}
                        </tfoot>
                    </table>

                    <div>

                    </div>
                </div>
                {/* </div> */}
                <button className="button" onClick={this.addExpenseClicked}>Add</button>
                {/* <SortTable /> */}
            </div >

        )
    }
}

export default ListExpensesComponent