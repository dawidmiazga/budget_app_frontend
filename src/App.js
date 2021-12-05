import React, { Component } from 'react';
import './App.css';
import './bootstrap.css';
import BudgetApp from "./components/homeBudgetApp/BudgetApp";
import Navbar from '../../todo-app/src/components/Sidebar/Navbar.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Navbar/> */}
        <BudgetApp />
        {/* xasxasx */}
      </div>
    );
  }
}

export default App;
