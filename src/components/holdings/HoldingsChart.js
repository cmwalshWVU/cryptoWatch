import React, { Component }  from 'react';
import ReactApexChart from "react-apexcharts";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import '../../styles/card.css';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class HoldingsChart extends Component {
      
    constructor(props) {
      super(props);

      this.state = {
        wallets: null,
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
    }

    mapTickerHoldings() {
        if (this.props.currentPrices === undefined || this.props.currentPrices.length === 0 || this.props.holdings === undefined) {
            return noData;
        }
        else {
            let mapping = [];
            let options = this.state.options;
            mapping.options = options;
            mapping.series = [];
            options.labels = [];

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
        }
    }

    login() {
        const popup = window.open('http://us-central1-crypto-watch-dbf71.cloudfunctions.net/redirect', '_blank', 'height=700,width=800')
      }

    lastUpdated() {
	    return moment().format("lll");
	  }
    
    getWallets = () => {
      const headers = {'Authorization': 'Bearer ' + this.props.coinbaseAuthToken }

      axios.get('https://us-central1-crypto-watch-dbf71.cloudfunctions.net/wallet', {headers})
        .then(response => {
          console.log(response.data);
          this.setState({wallets: response.data});
        })
        .catch(error => {
          console.log(error);
        });
      // var wallets = this.auth.getIdToken().then(authToken => {
      //   const endpoint = 'http://us-central1-crypto-watch-dbf71.cloudfunctions.net/wallet';
      //   const headers = {'Authorization': 'Bearer ' + authToken }
        
      //   return this.http.get(endpoint, { headers }).toPromise()
      // })

      // var wallets = this.http.get(endpoint, { headers }).toPromise()
      // this.setState({wallets: wallets});
    }

    render() {

        return (
            <div className="dashboard-section section rounded-card card z-depth-0 card-content">
                <span><center>Last updated:{this.lastUpdated()}</center></span>
                { this.mapTickerHoldings() }
                
                { this.props.coinbaseAuthToken === null ? 
                <center><Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                className="button"
                onClick={() => window.location.href ='http://us-central1-crypto-watch-dbf71.cloudfunctions.net/redirect'}
                >
                  Sign in with Coinbase
                </Button></center>
                : <center><Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                className="button"
                onClick={() => this.getWallets()}
                >
                  Get Wallet
                </Button></center>
              }
                {/* <HoldingsList /> */}
            </div>
      )};
}

const noData = (<li key="someData">
    <span >No Personal Holdings </span>
    </li>);


const mapStateToProps = (state) => {
	console.log(state);
	return {
		currentPrices: state.currentPrices.currentPrices,
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
    ]))(HoldingsChart);
