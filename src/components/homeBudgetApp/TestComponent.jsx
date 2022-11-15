import moment from "moment";
import React, { Component } from "react";
import ExpenseDataService from '../../api/HomeBudget/ExpenseDataService.js';
import LoginDataService from '../../api/HomeBudget/LoginDataService.js';
import AuthenticationService from './AuthenticationService.js';

class TestComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      expenses: [],
    }

    // this.refreshExpenses = this.refreshExpenses.bind(this)
  }

  componentDidMount() {
    // this.refreshExpenses()
  }

  // refreshExpenses() {
  //   let usernameid = AuthenticationService.getLoggedInUserName()
  //   let year = 2022;
  //   const queryParams = new URLSearchParams(window.location.search);
  //   const id = queryParams.get('yearnumber');
  //   const name = queryParams.get('name');
  //   const type = queryParams.get('type');
  //   console.log(id, name, type); // 55 test null
  //   LoginDataService.testretrieve(usernameid, year)

  //   ExpenseDataService.retrieveAllExpenses(usernameid)
  //     .then(
  //       response => {
  //         this.setState({ expenses: response.data })
  //       }
  //     )
  // }

  onFormSubmit(e) {
    e.preventDefault();
  }

  render() {

    return (
      <div className="background-color-all">
        <div className="container-expenses-middle">
          <table className="hb-table">
            {/* <tbody>
              {
                this.state.expenses.map(expense =>
                  <tr key={expense.expenseid}>
                    <td><div className="text-h5-white">{expense.description}</div>
                      <br />
                    </td>
                  </tr>
                )
              }
            </tbody> */}
          </table>
        </div>
      </div >
    )
  }
}

export default TestComponent