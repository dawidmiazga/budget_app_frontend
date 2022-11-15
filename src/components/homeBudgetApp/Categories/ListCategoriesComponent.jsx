import { Component } from "react";
import "../../../App.css"
import CategoryDataService from "../../../api/HomeBudget/CategoryDataService.js"
import AuthenticationService from "../AuthenticationService";
import btnEdit from "../../images/edit_button.png";
import btnDel from "../../images/delete_button.png";
import ExpenseDataService from "../../../api/HomeBudget/ExpenseDataService.js";

class ListCategoriesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            expenses: [],
            message: null,
            errormessage: null,
        }

        this.deleteCategoryClicked = this.deleteCategoryClicked.bind(this)
        this.updateCategoryClicked = this.updateCategoryClicked.bind(this)
        this.addCategoryClicked = this.addCategoryClicked.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.refreshExpenses = this.refreshExpenses.bind(this)
    }

    componentDidMount() {
        this.refreshExpenses()
        this.refreshCategories()
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

    deleteCategoryClicked(categoryid) {
        const allExpenses = ([this.state.expenses.map(expense => expense.categoryid)]);
        const arrCat = ([(this.state.categories.map(category => category.categoryname)), (this.state.categories.map(category => category.categoryid))]);
        if (allExpenses[0].includes(Number(categoryid))) {
            let categoryClicked = arrCat[0][arrCat[1].indexOf(categoryid)]
            this.setState({
                errormessage: `Nie mozna usunac kategorii "` + categoryClicked + `". Kategoria jest przypisana do ktoregos wydatku. 
                                        Aby usunac te kategorie, zmien ja na inna przy wszystkich tych wydatkach`
            })
            this.setState({ message: null })
        } else {
            let usernameid = AuthenticationService.getLoggedInUserName()
            CategoryDataService.deleteCategory(usernameid, categoryid)
                .then(
                    response => {
                        this.setState({ errormessage: null })
                        this.setState({ message: `Kategoria usunieta` })
                        this.refreshCategories()
                    }
                )
        }


    }

    updateCategoryClicked(categoryid) {
        this.props.history.push(`/categories/${categoryid}`)
    }

    addCategoryClicked() {
        this.props.history.push(`/categories/-1`)
    }

    render() {
        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                {this.state.errormessage && <div className="alert alert-warning">{this.state.errormessage}</div>}
                <div className="text-h1-white">
                    Kategorie
                </div>
                <div className="container-bud-cat">
                    <table className="hb-table">
                        <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.categories.map(
                                    category =>
                                        <tr key={category.id}>
                                            <td>
                                                {/* <div className="text-h5-white"> */}
                                                {category.categoryname}
                                                {/* </div> */}
                                                {/* <tr></tr> */}
                                                {category.comment}
                                            </td>
                                            <td>
                                                <img src={btnEdit} width="32" height="32" onClick={() => this.updateCategoryClicked(category.id)} />
                                                <img src={btnDel} width="32" height="32" onClick={() => this.deleteCategoryClicked(category.id)} />
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
                    <button className="button-66" onClick={this.addCategoryClicked}>Dodaj nowa kategorie</button>
                </div>
            </div>
        )
    }
}

export default ListCategoriesComponent