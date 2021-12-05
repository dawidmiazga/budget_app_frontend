import React, { Component } from 'react'
import moment from 'moment'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import CategoryDataService from '../../../api/to-do/CategoryDataService.js'
import AuthenticationService from '../AuthenticationService.js';


class CategoryComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            id: this.props.match.params.id,
            categoryname: '',
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
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

    componentDidMount() {

        if (this.state.id === -1) {
            return
        }

        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveCategory(username, this.state.id)
            .then(response => this.setState({
                categoryname: response.data.categoryname,
            }))

        console.log(' componentDidMount2')
        this.refreshCategories()
        this.refreshCategories()
    }

    validate(values) {
        let errors = {}
        if (!values.categoryname) {
            errors.categoryname = "Enter a description"
        } else if (values.categoryname.length < 2) {
            errors.categoryname = "Za malo liter"
        }

        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()
        console.log(username);
        let category = {
            id: this.state.id,
            categoryname: values.categoryname,
            username: username,
        }
        // console.log(values.description)
        // console.log(values.category.value)

        if (this.state.id === -1) {
            console.log("-1");
            CategoryDataService.createCategory(username, category).then(() => this.props.history.push('/categories'))
        } else {
            console.log("else");
            CategoryDataService.updateCategory(username, this.state.id, category).then(() => this.props.history.push('/categories'))
        }
    }

    handleChange(event) {
        console.log(event.target.value);
        console.log(event.target.categoryname);
    }


    render() {
        // ---------------
        // const total = (this.state.categories.reduce((total, currentItem) => total = total + currentItem.price, 0));
        // ---------------
        let { categoryname } = this.state
        return (

            <div>

                {/*  */}

                {/* {
                    this.state.categories.map(
                        category =>
                            console.log(category.description)
                    )
                } */}
                {/*  */}


                <h1>Add expensive</h1>
                <div className="container">
                    <Formik
                        initialValues={{ categoryname }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>

                                    {/* <ErrorMessage name="description" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="targetDate" component="div" className="alert alert-warning" /> */}
                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="categoryname" />
                                    </fieldset>

                                    <div className="jc-center">
                                        <button className="button" type="submit">Save</button>
                                        <button className="button" onClick={() => this.updateCategoryClicked()}>Back</button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
                {/* Total: {total} */}
                {/* <button className="btn btn-success" onClick={() => this.updateCategoryClicked()}>Back</button> */}
            </div>)
    }


    updateCategoryClicked() {
        this.props.history.push(`/categories`)
    }

}

export default CategoryComponent






// class CategoryComponent extends Component {

//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return (
//             <>
//                 <div>
//                     <h2>Charsts</h2>
//                 </div>
//                 <div> 
                    
//                 </div>
//             </>
//         )
//     }
// }

// export default CategoryComponent