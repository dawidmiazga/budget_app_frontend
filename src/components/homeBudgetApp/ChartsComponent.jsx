// import React, { Component } from "react";
// import { Bar, Doughnut } from 'react-chartjs-2';
// import '../../App.css'
// import moment from "moment";
// import AuthenticationService from "./AuthenticationService";
// import ExpenseDataService from "../../api/to-do/ExpenseDataService";
// import CategoryDataService from "../../api/to-do/CategoryDataService";
// import { Link } from "react-router-dom";
// // // import * as React from "react";
// // import * as ReactDOM from "react-dom";
// // import {
// //   Chart,
// //   ChartLegend,
// //   ChartSeries,
// //   ChartSeriesItem,
// //   ChartSeriesLabels,
// // } from "@progress/kendo-react-charts";
// // import "hammerjs";
// // import data from "./power-distribution-data.json";
// import randomColor from "randomcolor";

// class ChartsComponent extends Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             expenses: [],
//             categories: [],
//             selectYear: "All",
//             welcomeMessage: ''
//         }

//         // this.onSubmit = this.onSubmit.bind(this)
//         // this.validate = this.validate.bind(this)
//         this.refreshExpenses = this.refreshExpenses.bind(this)
//         this.refreshCategories = this.refreshCategories.bind(this)
//     }
//     componentDidMount() {
//         console.log(' componentDidMount')
//         this.refreshExpenses()
//         this.refreshCategories()
//     }
//     refreshExpenses() {
//         let username = AuthenticationService.getLoggedInUserName()
//         ExpenseDataService.retrieveAllExpenses(username)
//             .then(
//                 response => {
//                     this.setState({ expenses: response.data })
//                 }
//             )
//     }
//     refreshCategories() {
//         let username = AuthenticationService.getLoggedInUserName()
//         CategoryDataService.retrieveAllCategories(username)
//             .then(
//                 response => {
//                     this.setState({ categories: response.data })
//                 }
//             )
//     }
//     render() {

//         const uniqueYear = ([...new Set(this.state.expenses.map(expense => moment(expense.targetDate).format('YYYY')))]).sort();

//         var formatter = new Intl.NumberFormat('pl-PL', {
//             style: 'currency',
//             currency: 'PLN',
//         });

//         var yearNames = [];
//         var totalValueByYear = [];
//         var rgbColorByYear = [];
//         var totalPrices = [];

//         for (let i = 0; i < uniqueYear.length; i++) {
//             // console.log(uniqueYear[i] + " loops")
//             // this["ttotal"+i] = uniqueYear[i] + " loops";
//             rgbColorByYear[i] = randomColor();
//             yearNames[i] = uniqueYear[i];

//             totalValueByYear[i] = (this.state.expenses.filter(expense =>
//                 moment(expense.targetDate).format('yyyy') == uniqueYear[i])
//                 .reduce((total, currentItem) => total = total + currentItem.price, 0));

//             totalPrices[i] = uniqueYear[i] + ": " + formatter.format((this.state.expenses.filter(expense =>
//                 moment(expense.targetDate).format('yyyy') == uniqueYear[i])
//                 .reduce((total, currentItem) => total = total + currentItem.price, 0)));
//             // this["yearName" + i] = uniqueYear[i]
//             // this["ttotal" + i] = (this.state.expenses.filter(expense =>
//             //     moment(expense.targetDate).format('yyyy') == uniqueYear[i])
//             //     .reduce((total1, currentItem) => total1 = total1 + currentItem.price, 0));
//             // console.log(this["ttotal" + i])
//             // console.log(this["yearName" + i])
//         }

//         const allCategories = this.state.categories.map(category => category.categoryname);

//         console.log(allCategories)

//         var categoryNames = [];
//         var rgbColorByCategory = [];
//         var totalValueByCategory = [];

//         for (let i = 0; i < allCategories.length; i++) {
//             // console.log(allCategories[i] + " lcat");
//             // this["ttotal"+i] = uniqueYear[i] + " loops";
//             rgbColorByCategory[i] = randomColor();
//             categoryNames[i] = allCategories[i];

//             totalValueByCategory[i] = this.state.expenses.filter(expense =>
//                 expense.category == allCategories[i])
//                 .reduce((total, currentItem) => total = total + currentItem.price, 0);

//                 console.log(allCategories[i] + " lcat " + totalValueByCategory[i]);
//             // totalPrices[i] = uniqueYear[i] + ": " + formatter.format((this.state.expenses.filter(expense =>
//             //     moment(expense.targetDate).format('yyyy') == uniqueYear[i])
//             //     .reduce((total1, currentItem) => total1 = total1 + currentItem.price, 0)));
//             // this["yearName" + i] = uniqueYear[i]
//             // this["ttotal" + i] = (this.state.expenses.filter(expense =>
//             //     moment(expense.targetDate).format('yyyy') == uniqueYear[i])
//             //     .reduce((total1, currentItem) => total1 = total1 + currentItem.price, 0));
//             // console.log(this["ttotal" + i])
//             // console.log(this["yearName" + i])
//         }


//         console.log(totalValueByCategory)

//         // console.log(yearNames)
//         // console.log(this.ttotal1)

//         // console.log("Random :" + RandomNumber)

//         // const total1 = (this.state.expenses.filter(expense =>
//         //     moment(expense.targetDate).format('yyyy') == '2017')
//         //     .reduce((total, currentItem) => total = total + currentItem.price, 0));
//         // const total2 = (this.state.expenses.filter(expense =>
//         //     moment(expense.targetDate).format('yyyy') == '2019')
//         //     .reduce((total, currentItem) => total = total + currentItem.price, 0));
//         // const total3 = (this.state.expenses.filter(expense =>
//         //     moment(expense.targetDate).format('yyyy') == '2020')
//         //     .reduce((total, currentItem) => total = total + currentItem.price, 0));
//         // const total4 = (this.state.expenses.filter(expense =>
//         //     moment(expense.targetDate).format('yyyy') == '2021')
//         //     .reduce((total, currentItem) => total = total + currentItem.price, 0));
//         const dataByYear = {
//             labels: yearNames,
//             datasets: [{
//                 data: totalValueByYear,
//                 // data: [ttotal[0], ttotal[1], ttotal[2], ttotal[3]],
//                 backgroundColor: rgbColorByYear,
//                 // backgroundColor: ['#fff100','#ff8c00','#e81123','#ec008c','#68217a','#00188f','#00bcf2','#00b294','#009e49','#bad80a'],
//                 hoverBackgroundColor: ['#FF6384']//, '#36A2EB', '#FFCE56', '#61dafb']
//             }]
//         };

//         const dataByCategory = {
//             labels: allCategories,
//             datasets: [{
//                 data: totalValueByCategory,
//                 // data: [ttotal[0], ttotal[1], ttotal[2], ttotal[3]],
//                 backgroundColor: rgbColorByYear,
//                 // backgroundColor: ['#fff100','#ff8c00','#e81123','#ec008c','#68217a','#00188f','#00bcf2','#00b294','#009e49','#bad80a'],
//                 hoverBackgroundColor: ['#FF6384']//, '#36A2EB', '#FFCE56', '#61dafb']
//             }]
//         };
//         // this.state.expenses.map(
//         //     expense =>
//         //         console.log(".")
//         //     // console.log(moment(expense.targetDate).format('YYYY'))

//         // )


//         const listAmounts = totalPrices.map((link) =>
//             <li key={link}>{link}</li>
//         );

//         return (
//             <>
//                 <h1>Podsumowanie</h1>

//                 {
//                     this.state.expenses.map(
//                         expense =>
//                             // console.log(expense.description)
//                             // {options.map((option) => (
//                             <>
//                                 {/* <div>{expense.description}</div>
//                                 <div>{uniqueYear.id + "X"}</div>

//                                 <li>{uniqueYear + "x"}</li> */}


//                             </>
//                         // ))}

//                     )


//                 }

//                 <div className="container">
//                     <div id="header">
//                         <h3>

//                         </h3>
//                     </div>
//                     <div id="left">
//                         <Doughnut
//                             data={dataByYear}
//                             height={300}
//                             options={{
//                                 responsive: false,
//                                 maintainAspectRatio: false,

//                             }} />
//                         <Doughnut
//                             data={dataByCategory}
//                             height={300}
//                             options={{
//                                 responsive: false,
//                                 maintainAspectRatio: false,

//                             }} />
//                     </div>
//                     <div id="content">
//                         {listAmounts}
//                     </div>
//                     <div id="right">




//                         {/* 

//                         <div>2017: {formatter.format(this.ttotal0)}</div>
//                         <div>2019: {formatter.format(this.ttotal1)}</div>
//                         <div>2020: {formatter.format(this.ttotal2)}</div>
//                         <div>2021: {formatter.format(this.ttotal3)}</div> */}

//                     </div>
//                     <div id="footer">
//                         footer
//                     </div>
//                 </div>
//                 <div className="container">

//                 </div>
//             </>
//         )
//     }
// }

// export default ChartsComponent

// // import React, { Component } from "react";
// // import {
// //     BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// // } from 'recharts';

// // const data = [{ name: 'Page A', uv: 4000, pv: 2400, amt: 2400, }, { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, }, { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, }, { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, }, { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, }, { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, }, { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, },];

// // class ChartsComponent extends Component {

// //     constructor(props) {
// //         // console.log(' costructor')
// //         super(props)
// //         // this.state = {
// //         //     expenses: [],
// //         //     message: null
// //         // }
// //     }

// //     render() {
// //         return (
// //             <>
// //                 <div>
// //                     <h2>Charts</h2>

// //                 </div>
// //                 <div> 
// //                     <BarChart
// //                         width={1500}
// //                         height={300}
// //                         data={data}

// //                         // margin={{
// //                         //     top: 5, right: 30, left: 20, bottom: 5,
// //                         // }}
// //                     >
// //                         <CartesianGrid strokeDasharray="3 3" />
// //                         <XAxis dataKey="name" />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Legend />
// //                         <Bar dataKey="pv" fill="#8084d8" />
// //                         <Bar dataKey="uv" fill="#82ca9d" />
// //                     </BarChart>
// //                 </div>
// //             </>
// //         )
// //     }
// // }

// // export default ChartsComponent

// // import moment from "moment";
// // import React, { Component } from "react";
// // import ExpenseDataService from '../../api/to-do/ExpenseDataService.js';
// // import AuthenticationService from './AuthenticationService.js';
// // import { Bar, Doughnut } from 'react-chartjs-2';
// // import styles from '../counter/Counter'
// // import '../../App.css'

// // const data = { labels: ['Red', 'Green', 'Yellow'], datasets: [{ data: [300, 50, 100], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }] };

// // class ChartsComponent extends Component {

// //     constructor(props) {
// //         super(props)
// //     }

// //     render() {
// //         return (
// //             <>
// //                 <div className="container">
// //                     <h2>Doughnut Example</h2>
// //                     <Doughnut
// //                         data={data}
// //                         options={{
// //                             responsive: false,
// //                             maintainAspectRatio: false,
// //                         }} />
// //                 </div>
// //             </>
// //         )
// //     }
// // }

// // export default ChartsComponent

