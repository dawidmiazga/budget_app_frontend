import { Component } from "react";
import "../../../App.css"
import CategoryDataService from '../../../api/HomeBudget/CategoryDataService.js'
import AuthenticationService from "../AuthenticationService";
import btnEdit from '../../images/edit_button.png';
import btnDel from '../../images/delete_button.png';
import reactCSS from 'reactcss'

class ListCategoriesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            message: null,
        }

        this.deleteCategoryClicked = this.deleteCategoryClicked.bind(this)
        this.updateCategoryClicked = this.updateCategoryClicked.bind(this)
        this.addCategoryClicked = this.addCategoryClicked.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
    }

    componentDidMount() {
        this.refreshCategories()
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

    deleteCategoryClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.deleteCategory(username, id)
            .then(
                response => {
                    this.setState({ message: `Kategoria usunieta` })
                    this.refreshCategories()
                }
            )
    }

    updateCategoryClicked(id) {
        this.props.history.push(`/categories/${id}`)
    }

    addCategoryClicked() {
        this.props.history.push(`/categories/-1`)
    }

    render() {
        return (
            <div className="background-color-all">
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="text-40px-white">
                    Kategorie
                </div>
                <div className="container-categories">
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
                                                <div className="text-20px-white">{category.categoryname}</div>
                                                <tr></tr>
                                                {category.comment}
                                            </td>
                                            <td>
                                                <img src={btnEdit} width="40" height="40" onClick={() => this.updateCategoryClicked(category.id)} />
                                                <img src={btnDel} width="40" height="40" onClick={() => this.deleteCategoryClicked(category.id)} />
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