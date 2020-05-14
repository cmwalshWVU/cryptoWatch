import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import '../../styles/card.css';
import HoldingsChart from './HoldingsChart';
import { getCurrentPrices } from '../store/actions/currentPriceAction';
import Holding from './entities/Holding'

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

  componentDidMount = async () => {
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
    return <HoldingsChart className="chart" 
      coinbaseAuthToken={this.props.coinbaseAuthToken}  
      cbHoldings={this.props.cbHoldings} 
      holdings={holdings} height="350" 
      type="pie" />
  }

  totalHoldings = (holdings) => {
    if (this.props.currentPrices === undefined || holdings === undefined || holdings.length === 0 || holdings.filter(mem => mem.numberOfCoins > 0).length   === 0) {
        return [];
    }
    else {
      const holdingsList = []
      var totalHoldings = 0;

      const cbHoldings = []
      if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
        this.props.cbHoldings[0].cbHoldings.forEach(coin => {
          if (coin.holding.amount > 0) {
            var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.holding.currency);
            holdingsList[coin.holding.currency] = new Holding(coin.holding.currency, coin.holding.amount, currentPrice)
            cbHoldings[coin.holding.currency] = Number(coin.holding.amount)
          }
        });
        // console.log(cbHoldings)
      }

      holdings.map(coin => {
        if (holdingsList[coin.coin]) {
          holdingsList[coin.coin].amount += coin.numberOfCoins
        } else {
          var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
          holdingsList[coin.coin] = new Holding(coin.coin, coin.numberOfCoins, currentPrice)
        }
        // var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
        // if (currentPrice != null) {
        //     totalHoldings += Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.coin).price_usd);
        // }
      });

      // for (let i = 0; i < holdingsList.length; i ++) {
      //   let asset = holdingsList[i]
      //   if (asset.currentPrice !== null) {
      //     totalHoldings += Number(asset.amount) * Number(asset.currentPrice.price_usd);
      //   }
      // }
      
     return holdingsList
    }
  }

  render = () => {
    const {  holdings } = this.props;
    const holdingsList = []

    if (this.props.currentPrices !== undefined && ((holdings !== undefined && holdings.length === 0) || (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings))) {
        const cbHoldings = []
        if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
          this.props.cbHoldings[0].cbHoldings.forEach(coin => {
            if (coin.holding.amount > 0) {
              var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.holding.currency);
            holdingsList.push(new Holding(coin.holding.currency, Number(coin.holding.amount), currentPrice))
            cbHoldings[coin.holding.currency] = Number(coin.holding.amount)
          }
        });
      }
      holdings.forEach(coin => {
        const existingHolding = holdingsList.find(x => x.ticker === coin.coin)
        if (existingHolding !== undefined) {
          existingHolding.amount +=  Number(coin.numberOfCoins)
        } else {
          var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
          holdingsList.push(new Holding(coin.coin, Number(coin.numberOfCoins), currentPrice))
        }
      });
    }

    var total = 0 
    for (let i = 0; i < holdingsList.length; i ++) {
      // console.log(total)
      // console.log(holdingsList[i].currentPrice)
      let asset = holdingsList[i]
      if (asset.currentPrice !== undefined) {
        // console.log("adding " + asset.amount + " * " + asset.currentPrice.quote.USD.price + " : " +  Number(asset.amount) * Number(asset.currentPrice.quote.USD.price))
        total += Number(parseFloat(asset.amount)) * Number(asset.currentPrice.quote.USD.price);
      }
    }
    // this.totalHoldings(holdings)
    return (
      <div className="App">
        <center><h5 className="App-title">Current Holdings: ${total.toFixed(2)}</h5></center>
        { this.displayChart(holdings) }
        {/* <HoldingsList /> */}
      </div>
    )
  };
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
