import React, { Component }  from 'react';
import ReactApexChart from "react-apexcharts";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import '../../styles/card.css';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TransactionDialog from '../transactions/TransactionDialog'
import { updateCoinbaseHolding } from "../store/actions/coinbaseAction"
import Chart from 'react-apexcharts';

class HoldingsChart extends Component {
      
  constructor(props) {
    super(props);

    this.state = {
      wallets: null,
      modalOpen: false,
      loadingWallets: false,
      data: [],
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
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '20px',
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
    this.mapTickerHoldings = this.mapTickerHoldings.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  mapTickerHoldings() {
    let mapping = [];
    let options = this.state.options;
    mapping.options = options;
    mapping.series = [];
    options.labels = [];
    
    if (this.props.currentPrices === undefined || this.props.currentPrices.length === 0) {
      return <div className="noData">
              <div className="defaultMessage"> No Current Price Data...</div>
              <div className="addHoldings">Please Try Again Shortly</div>
            </div>
    } else if ((this.props.holdings === undefined || this.props.holdings.length === 0 || this.props.holdings.filter(coin => coin.numberOfCoins > 0).length === 0) && !this.props.cbHoldings) {
      return <div className="noData">
              <div className="defaultMessage"> No Current Holdings...</div>
              <div className="addHoldings">Add your holdings!
              <i className="material-icons addHoldingsButton Small" onClick={() => this.toggleModal()}>library_add</i></div>
            </div>
    } else if ((this.props.holdings === undefined || this.props.holdings.length === 0 || this.props.holdings.filter(coin => coin.numberOfCoins > 0).length === 0) && this.props.cbHoldings) {
      // let mapping = [];
      // let options = this.state.options;
      // mapping.options = options;
      // mapping.series = [];
      // options.labels = [];

      if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
        this.props.cbHoldings[0].cbHoldings.map(coin => {
          if (Number(coin.holding.amount) > 0) {
            let coins = Number(coin.holding.amount)
            var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.holding.currency);
            if (currentPrice != null) {
                var total = Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.holding.currency).quote.USD.price);
                mapping.options.labels.push(coin.holding.currency);
                mapping.series.push(Number(total.toFixed(2)));
            }
          }
        });
      }
      return mapping
      // return <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" />
    } else {
      // let mapping = [];
      // let options = this.state.options;
      // mapping.options = options;
      // mapping.series = [];
      // options.labels = [];

      const cbHoldings = []
      if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
        this.props.cbHoldings[0].cbHoldings.forEach(coin => {
          cbHoldings[coin.holding.currency] = Number(coin.holding.amount)
        });
      }

      if (this.props.holdings !== undefined || this.props.cbHoldings !== undefined) {
        this.props.holdings.forEach(coin => {
          let coins = coin.numberOfCoins;
          if (cbHoldings[coin.coin]) {
            coins += cbHoldings[coin.coin]
          }
          var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.coin);
          if (currentPrice != null) {
              var total = Number(coins) * Number(this.props.currentPrices.find(x => x.symbol === coin.coin).quote.USD.price);
              mapping.options.labels.push(coin.coin);
              mapping.series.push(Number(total.toFixed(2)));
          }
        });

        if (this.props.cbHoldings && this.props.cbHoldings[0].cbHoldings) {
          this.props.cbHoldings[0].cbHoldings.forEach(coin => {
            if (Number(coin.holding.amount) > 0 && mapping.options.labels.find(x => x === coin.holding.currency) === undefined) {
              var currentPrice = this.props.currentPrices.find(x => x.symbol === coin.id);
              if (currentPrice != null) {
                mapping.options.labels.push(coin.holding.currency);
                var total = Number(coin.holding.amount) * currentPrice.quote.USD.price;
                mapping.series.push(Number(total.toFixed(2)));
              }
            }
          });
        }
        // return <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" />
      }
      return mapping
    }
    // return <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" />
  }

  lastUpdated() {
    return moment().format("lll");
  }
    
  toggleModal() {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  getWallets = () => {
    const headers = {'Authorization': 'Bearer ' + this.props.coinbaseAuthToken }
    this.setState({loadingWallets: true})
    axios.get('https://us-central1-crypto-watch-dbf71.cloudfunctions.net/wallet', {headers})
      .then(response => {
        // console.log(response.data);
        this.setState({wallets: response.data, loadingWallets: false});
        for (let i = 0; i < response.data.length; i++) {
          this.props.updateCoinbaseHolding(response.data[i].balance)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const coinbaseHoldings = this.state.wallets !== null ? this.state.wallets.map(coin => {
      return <li key={coin.balance.currency}>
              <span className="green-text">{coin.balance.currency}: </span>
              <span>${coin.native_balance.amount}</span>
            </li>
    }) : <li>No Holdings</li>

    if (this.props.currentPrices === undefined || this.props.currentPrices.length === 0) {
      return <div className="noData">
              <div className="defaultMessage"> No Current Price Data...</div>
              <div className="addHoldings">Please Try Again Shortly</div>
            </div>
    } else if ((this.props.holdings === undefined || this.props.holdings.length === 0 || this.props.holdings.filter(coin => coin.numberOfCoins > 0).length === 0) && !this.props.cbHoldings) {
      return <div className="noData">
              <div className="defaultMessage"> No Current Holdings...</div>
              <div className="addHoldings">Add your holdings!
              <i className="material-icons addHoldingsButton Small" onClick={() => this.toggleModal()}>library_add</i></div>
            </div>
            
    } else {
      const mapping = this.mapTickerHoldings()

      const options = {
        chart: {
          width: 380,
          type: 'pie',
        },
        fill: {
          type: 'gradient',
        },
        dataLabels: {
          enabled: true,
          style: {
              fontSize: '16px',
          }
        },
        legend: {
          position: 'bottom',
          fontSize: '17px',
        },
        tooltip: {
          enabled: true,
          style: {
            fontSize: '16px',
          },
          y: {
            formatter: function(val) {
              return "$" + val
            }
          }
        },
        labels: mapping.options.labels,
        responsive: [{
          breakpoint: 480,
          options: {
            // chart: {
            //   width: 200
            // },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };

      return (
        <div className="dashboard-section section rounded-card card z-depth-0 card-content">
          <TransactionDialog modalOpen={this.state.modalOpen} toggleModal={this.toggleModal}/>
          <div className="holdingsFlex">
            <div className="lastUpdated">Last updated:{this.lastUpdated()}</div>
            <i className="material-icons addHoldingsButton Small" onClick={() => this.toggleModal()}>library_add</i>
          </div>
          {/* <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" /> */}

          <Chart options={options} series={mapping.series} type="pie" height={350} />
          {/* { this.mapTickerHoldings() } */}
          
          { this.props.coinbaseAuthToken === null ? 
            <center>
              <Button
                className="coinbase-button"
                onClick={() => window.location.href ='http://us-central1-crypto-watch-dbf71.cloudfunctions.net/redirect'}
                >
                  Sign in with Coinbase
              </Button>
            </center>
            : (this.state.wallets === null ? 
              <center>
                <Button
                  className="coinbase-button"
                  onClick={() => this.getWallets()}
                  >
                    Sync Coinbase Holdings
                </Button>
              </center> 
            : this.state.loadingWallets === true ? 
              <center><u>Loading Wallets</u></center>
            : null
            // <center><u>Coinbase Holdings</u>{coinbaseHoldings}</center>
            )
          }
        </div>
      )
    }
  };
}

const mapStateToProps = (state) => {
	// console.log(state);
	return {
		currentPrices: state.currentPrices.currentPrices,
    holdings:  state.firestore.ordered.personalHoldings,
    cbHoldings:  state.firestore.ordered.cbHoldings,
    auth: state.firebase.auth
  }
}
    
const mapDispatchToProps = (dispatch) => {
  return {
    updateCoinbaseHolding: (holding) => dispatch(updateCoinbaseHolding(holding))
  }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
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
    ]))(HoldingsChart);
