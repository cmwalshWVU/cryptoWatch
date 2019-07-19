import React, { Component }  from 'react';
import ReactApexChart from "react-apexcharts";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import HoldingsList from './HoldingsList';
import '../../styles/card.css';
import HoldingsChart from './HoldingsChart';
import { getCurrentPrices } from '../store/actions/currentPriceAction';

class Holdings extends Component {
      
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
      this.displayChart = this.displayChart.bind(this);
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

    // mapTickerHoldings = (holdings) => {
    //   if (this.props.currentPrices === undefined || this.props.currentPrices.length === 0 || this.props.holdings === undefined) {
    //       return noData;
    //   }
    //   else {
    //       let mapping = [];
    //       let options = this.state.options;
    //       mapping.options = options;
    //       mapping.series = [];
    //       options.labels = [];

    //       this.props.holdings.map(coin => {
    //           let coins = coin.numberOfCoins;
    //           var total = Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.coin).price_usd).toFixed(2);
    //           mapping.options.labels.push(coin.coin);
    //           mapping.series.push(total);
    //       });
          
    //       return <HoldingsChart className="chart" mapping={mapping} height="350" type="pie" />
    //     }
    // }

    displayChart = (holdings) => {
        if (holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.numberOfCoins > 0).length   === 0) {
            return noData;
        }
        else {
            
            let series = holdings.filter(mem => mem.numberOfCoins > 0).map(coin => coin.numberOfCoins);
            let tickers = holdings.filter(mem => mem.numberOfCoins > 0).map(a => a.coin);
            
            
            // var totalHoldings = holdings.reduce((a, b) => a + (b['dollarHoldings'] || 0), 0);       
          
            // let mapping = this.getData(holdings, totalHoldings);   
            return <HoldingsChart className="chart" tickers={tickers} holdings={holdings.filter(mem => mem.numberOfCoins > 0)} series={series} height="350" type="pie" />
        }
    }

    render() {
        const {  holdings } = this.props;

        return (
            <div className="dashboard-section section">
            <div className="rounded-card card z-depth-0">
                { this.displayChart(holdings) }
                {/* <HoldingsList /> */}
            </div>
        </div>
      )};
}


const noData = (<li key="someData">
   <div className="card-content">
                <span className="card-title">Holdings</span>
                <span >No Personal Holdings </span>
                {/* <HoldingsList /> */}
            </div>
    </li>);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    holdings:  state.firestore.ordered.personalHoldings,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps, {getCurrentPrices}),
  firestoreConnect(props => [
    { collection: 'holdings',
        doc: props.auth.uid,
        subcollections: [
          { collection: 'holdings', orderBy: ['lastUpdated', 'desc'] },
        ],
        storeAs: 'personalHoldings'
      }    
  ])
)(Holdings);
