import { Component } from "react";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "../../../App.css"
import 'react-calendar/dist/Calendar.css';
import CategoryDataService from '../../../api/to-do/CategoryDataService.js'
import AuthenticationService from "../AuthenticationService";
// import DatePicker from "react-datepicker";
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

    componentWillUnmount() {
        // console.log('componoentWillUnmoiunt')
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }


    componentDidMount() {
        console.log(' componentDidMount')
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
                    this.setState({ message: `Category deleted` })
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
            <div>
                <h1>Categories</h1>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                {/* <DatePicker/> */}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // this.state.categories.filter(category =>
                                //     this.state.startDate == null || this.state.endDate == null ||
                                //     (Date.parse(category.targetDate) >= Date.parse(this.state.startDate) && Date.parse(category.targetDate) <= Date.parse(this.state.endDate))
                                // ).map(
                                    this.state.categories.map(
                                    category =>

                                        <tr key={category.id}>
                                            <td>{category.categoryname}</td>
                                            <td>

                                                <button
                                                    className="button_edit"
                                                    onClick={() => this.updateCategoryClicked(category.id)}>
                                                    Edit
                                                </button>

                                                <button
                                                    className="button_delete"
                                                    onClick={() => this.deleteCategoryClicked(category.id)}>
                                                    Delete
                                                </button>
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
                    <div className="row jc-center">
                        <button className="button" onClick={this.addCategoryClicked}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListCategoriesComponent