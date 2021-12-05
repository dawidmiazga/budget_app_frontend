import React, { Component } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import TestTable from './TestTable.js';
import Lightpick from "lightpick";

import ReactDOM from 'react-dom';



class TestComponent extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        // var picker = new Lightpick({
        //     field: document.getElementById('demo-1'),
        //     onSelect: function(date){
        //         document.getElementById('result-1').innerHTML = date.format('Do MMMM YYYY');
        //     }
        // });

        return (
            <>
                <input type="text" id="datepicker" />
                
                <div class="row">
                    <div class="container-right">1</div>
                    <div class="container-middle">2</div>
                    <div class="container-left">3</div>

                </div>

                {/* <div>
                    <h2>Test</h2>
                </div>
                <div>


                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Active</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">Disabled</a>
                        </li>
                    </ul>
                </div> */}
            </>
        )
    }
}

export default TestComponent

// import React, { Component } from "react";
// import {
//     BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
// } from 'recharts';

// const data = [{ name: 'Page A', uv: 4000, pv: 2400, amt: 2400, }, { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, }, { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, }, { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, }, { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, }, { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, }, { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, },];

// class ChartsComponent extends Component {

//     constructor(props) {
//         // console.log(' costructor')
//         super(props)
//         // this.state = {
//         //     expenses: [],
//         //     message: null
//         // }
//     }

//     render() {
//         return (
//             <>
//                 <div>
//                     <h2>Charts</h2>

//                 </div>
//                 <div> 
//                     <BarChart
//                         width={1500}
//                         height={300}
//                         data={data}

//                         // margin={{
//                         //     top: 5, right: 30, left: 20, bottom: 5,
//                         // }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="pv" fill="#8084d8" />
//                         <Bar dataKey="uv" fill="#82ca9d" />
//                     </BarChart>
//                 </div>
//             </>
//         )
//     }
// }

// export default ChartsComponent

// import moment from "moment";
// import React, { Component } from "react";
// import ExpenseDataService from '../../api/to-do/ExpenseDataService.js';
// import AuthenticationService from './AuthenticationService.js';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import styles from '../counter/Counter'
// import '../../App.css'

// const data = { labels: ['Red', 'Green', 'Yellow'], datasets: [{ data: [300, 50, 100], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }] };

// class ChartsComponent extends Component {

//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return (
//             <>
//                 <div className="container">
//                     <h2>Doughnut Example</h2>
//                     <Doughnut
//                         data={data}
//                         options={{
//                             responsive: false,
//                             maintainAspectRatio: false,
//                         }} />
//                 </div>
//             </>
//         )
//     }
// }

// export default ChartsComponent

