import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
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

  componentDidMount() {
    this.props.getCurrentPrices();
    this.interval = setInterval(() => this.props.getCurrentPrices(), 30 * 1000);
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
    return <HoldingsChart className="chart" coinbaseAuthToken={this.props.coinbaseAuthToken}  holdings={holdings} height="350" type="pie" />
  }

  totalHoldings = (holdings) => {
    if (holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.numberOfCoins > 0).length   === 0) {
        return "N/A";
    }
    else {
      const cbHoldings = []
      if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
        this.props.cbHoldings[0].cbHoldings.forEach(coin => {
          cbHoldings[coin.holding.currency] = Number(coin.holding.amount)
        });
        // console.log(cbHoldings)
      }
      var totalHoldings = 0;

      holdings.map(coin => {
        let coins = coin.numberOfCoins;
        if (cbHoldings[coin.coin]) {
          coins += cbHoldings[coin.coin]
        }
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
        { this.displayChart(holdings) }
        {/* <HoldingsList /> */}
      </div>
  )};
}

const mapStateToProps = (state) => {
  return {
    holdings:  state.firestore.ordered.personalHoldings,
    currentPrices: state.currentPrices.currentPrices,
    cbHoldings:  state.firestore.ordered.cbHoldings,
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
    },
    { collection: 'cbHoldings',
      doc: props.auth.uid,
      subcollections: [
          { collection: 'cbHoldings' },
      ]
    }
  ])
)(Holdings);
