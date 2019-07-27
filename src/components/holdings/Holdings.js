import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import HoldingsList from './HoldingsList';
import '../../styles/card.css';
import HoldingsChart from './HoldingsChart';
import ReactApexChart from "react-apexcharts";

class Holdings extends Component {
      
    constructor(props) {
      super(props);

      this.state = {
        options: {
          chart: {
              height: 'auto',
            },
            responsive: [{
              breakpoint: 1000,
              options: {
                chart: {
                  width: '100%'
                }
              }
            }],
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
          },
          fill: {
              type: 'gradient',
          },
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

    displayChart = (holdings) => {
        if (holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.numberOfCoins > 0).length   === 0) {
            return noData;
        }
        else {
            let mapping = [];
            let options = this.state.options;
            mapping.options = options;
            mapping.series = [];
            options.labels = [];
            let series = holdings.filter(mem => mem.numberOfCoins > 0).map(coin => coin.numberOfCoins);
            let tickers = holdings.filter(mem => mem.numberOfCoins > 0).map(a => a.coin);
            
            this.props.holdings.map(coin => {
              let coins = coin.numberOfCoins;
              var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
              if (currentPrice != null) {
                  var total = Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.coin).price_usd);
                  mapping.options.labels.push(coin.coin);
                  mapping.series.push(Number(total.toFixed(2)));
              }
          });
          
          return <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" />

          // return <HoldingsChart className="chart" tickers={tickers} holdings={holdings.filter(mem => mem.numberOfCoins > 0)} series={series} height="350" type="pie" />
        }
    }

    totalHoldings = (holdings) => {
      if (holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.numberOfCoins > 0).length   === 0) {
          return "N/A";
      }
      else {
        var totalHoldings = 0;

        holdings.map(coin => {
          let coins = coin.numberOfCoins;
          var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
          if (currentPrice != null) {
              totalHoldings += Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.coin).price_usd);
          }
        });

        return totalHoldings.toFixed(2);
      }
  }

    render() {
      const {  holdings } = this.props;

      return (
        <div className="App">
          <center><h5 className="App-title">Current Holdings: ${this.totalHoldings(holdings)}</h5></center>

          <div className="padding-top card-content grey-text text-darken-3 rounded-card card z-depth-0">
        
              { this.displayChart(holdings) }
          </div>
        </div>
      )};
}


const noData = (
   <div className="card-content">
      <span className="card-title">Holdings</span>
      <span >No Personal Holdings </span>
    </div>);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    holdings:  state.firestore.ordered.personalHoldings,
    currentPrices: state.currentPrices.currentPrices,
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
)(Holdings);
