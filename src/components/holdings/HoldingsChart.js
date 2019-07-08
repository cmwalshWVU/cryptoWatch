import React, { Component }  from 'react';
import ReactApexChart from "react-apexcharts";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import HoldingsList from '../holdings/HoldingsList';
import '../../styles/card.css';

class HoldingsChart extends Component {
      
    constructor(props) {
      super(props);



      this.state = {
        options: {
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '20px',
                },
                y: {
                  formatter: function(val) {
                    return "$" + val
                  }
                }
            },
            legend: {
                position: 'bottom',
                    fontSize: '20px',
            }
          }
        }

      this.mapHoldings = this.mapHoldings.bind(this);
    }
  
    totalPercent = (holdings, total) => {
        return holdings.filter(mem => mem.dollarHoldings > 0).map(coin => coin.dollarHoldings);
    }

    getData = (holdings, total) => {
        let mapping = [];
        let series = holdings.filter(mem => mem.dollarHoldings > 0).map(coin => coin.dollarHoldings);
        let tickers = holdings.filter(mem => mem.dollarHoldings > 0).map(a => a.coin);
        let options = this.state.options;
        options.labels = tickers;

        mapping.options = options;
        mapping.series = series;
        return mapping;
    }

    mapHoldings = (holdings) => {
      if (holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.dollarHoldings > 0).length   === 0) {
          return noData;
      }
      else {
        var totalHoldings = holdings.reduce((a, b) => a + (b['dollarHoldings'] || 0), 0);       
        // tickers = this.getTickers(holdings);
        // var percentageHoldings = this.totalPercent(holdings, totalHoldings); 
        let mapping = this.getData(holdings, totalHoldings);   
        return <ReactApexChart className="holdings-chart" options={mapping.options} series={mapping.series} height="350" type="pie" />
      }
    }

    render() {
        const {  holdings } = this.props;

        return (
            <div className="dashboard-section section">
            <div className="rounded-card card z-depth-0">
            <div className="card-content">
                <span className="card-title">Holdings</span>
                { this.mapHoldings(holdings) }
                {/* <HoldingsList /> */}
            </div>
            </div>
        </div>
      )};
}


const noData = (<li key="someData">
    <span >No Personal Holdings </span>
    </li>);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    holdings:  state.firestore.ordered.personalHoldings,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: 'holdings',
        doc: props.auth.uid,
        subcollections: [
          { collection: 'holdings', orderBy: ['lastUpdated', 'desc'] },
        ],
        storeAs: 'personalHoldings'
      }    
  ])
)(HoldingsChart);
