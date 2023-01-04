import { Component } from "react";
import "../../../App.css"
import ExpenseDataService from "../../../api/HomeBudget/ExpenseDataService.js"
import AuthenticationService from "../AuthenticationService";
import btnEdit from "../../images/edit_button.png";
import btnDel from "../../images/delete_button.png";
import BankAccountDataService from "../../../api/HomeBudget/BankAccountDataService.js";
import {
  cycleCount, newDateYYYYMMDD, newDateDDMMYYYY, formatter, categoryMap
} from '../../homeBudgetApp/CommonFunctions.js'

class BankAccountsComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bankaccounts: [],
      message: null,
      errormessage: null,
    }

    this.deleteBankaccountClicked = this.deleteBankaccountClicked.bind(this)
    this.updateBankaccountClicked = this.updateBankaccountClicked.bind(this)
    this.addBankaccountClicked = this.addBankaccountClicked.bind(this)
    this.refreshBankaccounts = this.refreshBankaccounts.bind(this)
    this.refreshExpenses = this.refreshExpenses.bind(this)
  }

  componentDidMount() {
    this.refreshExpenses()
    this.refreshBankaccounts()
  }

  refreshBankaccounts() {
    let usernameid = AuthenticationService.getLoggedInUserName()
    BankAccountDataService.retrieveAllBankAccounts(usernameid)
      .then(
        response => {
          this.setState({ bankaccounts: response.data })
        }
      )
  }

  refreshExpenses() {
    let usernameid = AuthenticationService.getLoggedInUserName()
    ExpenseDataService.retrieveAllExpenses(usernameid)
      .then(
        response => {
          response.data.sort((a, b) => (a.target_date < b.target_date) ? 1 : -1)
          this.setState({ expenses: response.data })
        }
      )
  }

  deleteBankaccountClicked(bankaccountid) {
    const allExpenses = ([this.state.expenses.map(expense => expense.bankaccountid)]);
    const arrCat = ([(this.state.bankaccounts.map(bankaccount => bankaccount.bankaccountname)), (this.state.bankaccounts.map(bankaccount => bankaccount.bankaccountid))]);
    if (allExpenses[0].includes(Number(bankaccountid))) {
      let bankaccountClicked = arrCat[0][arrCat[1].indexOf(bankaccountid)]
      this.setState({
        errormessage: `Nie mozna usunac konta bankowego "` + bankaccountClicked + `". 
                        Konto to jest przypisane do ktoregos wydatku. 
                        Aby usunac to konto, zmien go na inne przy wszystkich tych wydatkach`
      })
      this.setState({ message: null })
    } else {
      let usernameid = AuthenticationService.getLoggedInUserName()
      BankAccountDataService.deleteBankAccount(usernameid, bankaccountid)
        .then(
          response => {
            this.setState({ errormessage: null })
            this.setState({ message: `Konto usunieta` })
            this.refreshBankaccounts()
          }
        )
    }


  }

  updateBankaccountClicked(bankaccountid) {
    this.props.history.push(`/bankaccounts/${bankaccountid}`)
  }

  addBankaccountClicked() {
    this.props.history.push(`/bankaccounts/-1`)
  }

  render() {
    console.log(this.state.bankaccounts)
    return (

      <div className="background-color-all">
        {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
        {this.state.errormessage && <div className="alert alert-warning">{this.state.errormessage}</div>}
        <div className="text-h1-white">
          Konta bankowe
        </div>
        <div className="container-bud-cat">
          <table className="hb-table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>Podzielone na osób </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.bankaccounts.map(
                  bankaccount =>
                    <tr key={bankaccount.id}>
                      <td>
                        {bankaccount.bankaccountname}
                        {bankaccount.comment}
                      </td>
                      <td>
                        {(bankaccount.divide)}
                      </td>
                      <td>
                        <img src={btnEdit} width="32" height="32" onClick={() => this.updateBankaccountClicked(bankaccount.id)} />
                        <img src={btnDel} width="32" height="32" onClick={() => this.deleteBankaccountClicked(bankaccount.id)} />
                      </td>
                    </tr>
                )
              }
            </tbody>
            <tfoot>
              <tr>
              </tr>
            </tfoot>
          </table>
          <button className="button-66" onClick={this.addBankaccountClicked}>Dodaj nowe konto</button>
        </div>
      </div>
    )
  }
}

export default BankAccountsComponent