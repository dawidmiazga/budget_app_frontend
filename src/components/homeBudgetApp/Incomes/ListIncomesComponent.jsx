import moment from "moment";
import React, { Component } from "react";
import IncomeDataService from '../../../api/to-do/IncomeDataService.js';
import AuthenticationService from '../AuthenticationService.js';


class ListIncomesComponent extends Component {
    constructor(props) {
        console.log(' costructor')
        super(props)
        this.state = {
            incomes: [],
            message: null
        }
        this.deleteIncomeClicked = this.deleteIncomeClicked.bind(this)
        this.updateIncomeClicked = this.updateIncomeClicked.bind(this)
        this.addIncomeClicked = this.addIncomeClicked.bind(this)
        this.refreshIncomes = this.refreshIncomes.bind(this)

    }

    componentWillUnmount() {
        console.log('componoentWillUnmoiunt')
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        console.log(nextProps)
        console.log(nextState)
        return true;
    }


    componentDidMount() {
        console.log(' componentDidMount')
        this.refreshIncomes()
    }

    refreshIncomes() {
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.retrieveAllIncomes(username)
            .then(
                response => {
                    this.setState({ incomes: response.data })
                }
            )
    }

    deleteIncomeClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        IncomeDataService.deleteIncome(username, id)
            .then(
                response => {
                    this.setState({ message: `Expense deleted` })
                    this.refreshIncomes()
                }
            )
    }


    updateIncomeClicked(id) {
        this.props.history.push(`/incomes/${id}`)
    }

    addIncomeClicked() {
        this.props.history.push(`/incomes/-1`)
    }
    render() {
        console.log('render')
        var formatter = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
        });
        return (
            <div>
                <h1>Incomes</h1>

                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => console.log("x")}>Description</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.incomes.map(
                                    income =>
                                        <tr key={income.id}>
                                            <td>{income.description}</td>
                                            <td>{moment(income.targetDate).format('DD-MM-YYYY')}</td>
                                            {/* <td>{income.year + ' ' + income.month}</td> */}
                                            <td>{formatter.format(income.amount)}</td>
                                            <td>{income.comment}</td>
                                            <td>

                                                <button
                                                    className="button_edit"
                                                    onClick={() => this.updateIncomeClicked(income.id)}>
                                                    Edit
                                                </button>

                                                <button
                                                    className="button_delete"
                                                    onClick={() => this.deleteIncomeClicked(income.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    
                    <div>
                        <button className="button" onClick={this.addIncomeClicked}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListIncomesComponent
        