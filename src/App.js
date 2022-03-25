import React, { Component } from 'react';
import './App.css';
import './bootstrap.css';
import BudgetApp from "./components/homeBudgetApp/BudgetApp";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BudgetApp />
      </div>
    );
  }
}

export default App;
