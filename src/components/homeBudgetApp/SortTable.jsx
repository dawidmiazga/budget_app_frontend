import React, { Component, useState, setState } from "react";
import moment from "moment";
import AuthenticationService from "./AuthenticationService";
import ExpenseDataService from "../../api/to-do/ExpenseDataService";
import MockData from '../../MOCK_DATA.json'
// import expenses from '../homeBudgetApp/Expenses/ListExpensesComponent'

export default function SortTable() {
    // this.state = {
    //     expenses: [],
    // }
    // let expenses=[]
    let expenses=[]

    let username = AuthenticationService.getLoggedInUserName()
    ExpenseDataService.retrieveAllExpenses(username)
        .then(
            response => {
                // ({expenses: response.data})
                // console.log(response.data)
                // console.log("x")
                // this.setState({ expenses: response.data })
                expenses = response.data
                // console.log(expenses)
            }
        )

    console.log(MockData)



    console.log(expenses)


    // this.state.expenses.map(
    //     expense =>
    //         <tr key={expense.id}>

    //             <td>{expense.description}</td>
    //         </tr>
    // )

    const [data, setdata] = useState(MockData);
    const [order, setorder] = useState("ASC")
    var formatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    });
    return (

        <div className='container'>
            <table className="table table-bordered">
                <thead>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                </thead>
                <tbody>

                    {data.map((d) => (
                        <tr key={d.id}>
                            <td>{d.first_name}</td>
                            <td>{moment(d.targetDate).format('DD-MM-YYYY')}</td>
                            <td>{d.category}</td>
                            <td>{d.comment}</td>
                            <td>{formatter.format(d.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>



        </div>
    )
}