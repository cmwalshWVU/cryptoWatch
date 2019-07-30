import React, { Component }  from 'react';
import ReactApexChart from "react-apexcharts";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import '../../styles/card.css';
import moment from 'moment';

class HoldingsChart extends Component {
      
    constructor(props) {
      super(props);

      this.state = {
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

    lastUpdated() {
	    return moment().format("lll");
	}
    
    render() {

        return (
            <div className="dashboard-section section rounded-card card z-depth-0 card-content">
                <span><center>{this.lastUpdated()}</center></span>
                { this.mapTickerHoldings() }
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
