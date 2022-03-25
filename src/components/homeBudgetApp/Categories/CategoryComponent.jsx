import React, { Component } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import CategoryDataService from '../../../api/HomeBudget/CategoryDataService.js'
import AuthenticationService from '../AuthenticationService.js';
import reactCSS from 'reactcss'
import { SketchPicker, PhotoshopPicker, SwatchesPicker } from 'react-color'

class CategoryComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            id: this.props.match.params.id,
            categoryname: '',
            displayColorPicker: false,
            hexcolor: '',
            categoryNameMain: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.refreshCategories = this.refreshCategories.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
        if (this.state.id == -1) {
            this.refreshCategories()
            return
        }
        let username = AuthenticationService.getLoggedInUserName()
        CategoryDataService.retrieveCategory(username, this.state.id)
            .then(response => this.setState({
                categoryname: response.data.categoryname,
                hexcolor: response.data.hexcolor
            }))
        this.refreshCategories()
    }

    validate(values) {
        const allCategories = this.state.categories.map(category => category.categoryname);
        let errors = {}
        if (!values.categoryname) {
            errors.categoryname = "Wpisz nazwe"
        }
        if (this.state.id == -1 && allCategories.includes(values.categoryname) == true) {
            errors.categoryname = "Taka kategoria juz istnieje"
        } else if (values.categoryname != this.state.categoryname && allCategories.includes(values.categoryname) == true) {
            errors.categoryname = "Taka kategoria juz istnieje"
        }
        if (values.hexcolor == '') {
            errors.hexcolor = "Wybierz kolor"
        }
        return errors
    }

    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()
        let category = {
            id: this.state.id,
            categoryname: values.categoryname,
            username: username,
            hexcolor: (values.hexcolor),
        }
        if (this.state.id == -1) {
            CategoryDataService.createCategory(username, category).then(() => this.props.history.push('/categories'))
        } else {
            CategoryDataService.updateCategory(username, this.state.id, category).then(() => this.props.history.push('/categories'))
        }
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        if (this.state.hexcolor == '' || this.state.hexcolor == null) {
            this.setState({
                hexcolor: '',
                displayColorPicker: !this.state.displayColorPicker
            })
        } else {
            this.setState({ displayColorPicker: false })
            this.setState({ hexcolor: this.state.hexcolor.hex })
        }
    };

    handleChange(hexcolor) {
        let categoryNameTyped = document.getElementById("categorynameid").value
        this.setState({ hexcolor: hexcolor, categoryname: categoryNameTyped })
    };

    cancelButton() {
        this.props.history.push(`/categories`)
    }

    render() {
        const styles = reactCSS({
            'default': {
                hexcolor: {
                    width: '136px',
                    height: '44px',
                    borderRadius: '22px',
                    background: this.state.hexcolor,
                },
                swatch: {
                    borderRadius: '22px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'fixed',
                    right: '50%',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        let { categoryname, hexcolor } = this.state
        return (
            <div className="background-color-all">
                <div className="container">
                    <Formik
                        initialValues={{ categoryname, hexcolor }}
                        onSubmit={this.onSubmit}
                        validateOnChange={false}  //to i to ponizej zostawia nam wyswietlanie bledu "na zywo"
                        validateOnBlur={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="categoryname" component="div" className="alert alert-warning" />
                                    <ErrorMessage name="hexcolor" component="div" className="alert alert-warning" />
                                    <div className="text-40px-white" style={{ display: (this.state.id == -1 ? 'block' : 'none') }}>Dodaj kategorie</div>
                                    <div className="text-40px-white" style={{ display: (this.state.id != -1 ? 'block' : 'none') }}>Edytuj kategorie</div>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Wybierz kolor</div>
                                        <div name="categoryname2">
                                            <div style={styles.swatch} onClick={this.handleClick}>
                                                <div style={styles.hexcolor} />
                                            </div>
                                            {this.state.displayColorPicker ?
                                                <div style={styles.popover}>
                                                    <div style={styles.cover} onClick={this.handleClose} />
                                                    <SketchPicker color={this.state.hexcolor} onChange={this.handleChange} />
                                                </div> : null}
                                        </div>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <div className="text-20px-white">Nazwa</div>
                                        <Field className="hb-form-control" type="text" name="categoryname" id="categorynameid" />
                                    </fieldset>
                                    <div className="jc-center">
                                        <button className="button-save" type="submit">Zapisz</button>
                                        <button className="button-back" onClick={() => this.cancelButton()}>Cofnij</button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>)
    }
}

export default CategoryComponent