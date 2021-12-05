import React from "react";
import ReactDOM from "react-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./styles.css";
const getTotals = (data, key) => {
  let total = 0;
  data.forEach(item => {
    total += item[key];
  });
  return total;
};
function App() {
  const data = [
    {
      one: "first row",
      two: 10.4,
      three: 10.1,
      four: 54,
      five: 5,
      six: 5,
      seven: 10,
      eight: 10,
      nine: 10
    },
    {
      one: "second row",
      two: 10.4,
      three: 10.1,
      four: 54,
      five: 5,
      six: 5,
      seven: 10,
      eight: 10,
      nine: 10
    }
  ];
  data.unshift({
    one: "totals",
    two: getTotals(data, "two"),
    three: getTotals(data, "three"),
    four: getTotals(data, "four"),
    five: getTotals(data, "five"),
    six: getTotals(data, "six"),
    seven: getTotals(data, "seven"),
    eight: getTotals(data, "eight"),
    nine: getTotals(data, "nine")
  });
  return (
    <div className="App">
      <ReactTable
        data={data}
        showPagination={false}
        columns={[
          {
            Header: "Sales Overview",
            columns: [
              {
                Header: "one",
                id: "one",
                accessor: "one",
                show: true
              },
              {
                Header: "two",
                accessor: "two",
                show: true
              },
              {
                Header: "three",
                id: "three",
                accessor: "three",
                show: true
              },
              {
                Header: "four",
                id: "four",
                accessor: "four",
                show: true
              },
              {
                Header: "five",
                id: "five",
                accessor: "five",
                show: true
              },
              {
                Header: "six",
                id: "six",
                accessor: "six",
                show: true
              },
              {
                Header: "seven",
                id: "seven",
                show: true,
                accessor: "seven"
              },
              {
                Header: "eight",
                id: "eight",
                show: true,
                accessor: "eight"
              },
              {
                Header: "nine",
                id: "nine",
                accessor: "nine",
                show: true
              }
            ]
          }
        ]}
        loading={false}
        minRows={1}
        className="-striped -highlight"
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
