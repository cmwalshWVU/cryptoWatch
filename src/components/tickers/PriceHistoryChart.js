import React from "react";
import CandleStickChart from 'react-apexcharts';
import './PriceHistoryChart.css';
import moment from 'moment';
import {getGraphData} from '../store/actions/graphAction';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class PriceHistoryChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // chartData:null,
            graphData: [],
            options: {  
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: true,
                        formatter: function (value) {
                        return new Date(value).toLocaleString();
                        }
                    }
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                        return "$" + value.toFixed(2);
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                }
            }
        }   
    }

    componentDidMount() {
        const pusher = new Pusher('5994b268d4758d733605', {
            cluster: 'us2',
            encrypted: true
            });

        // if(this.state.firestore !== undefined && this.state.firestore.ordered !== null && this.state.fire.ordered.priceHistory !== null) {
        //     this.setState({graphData: this.state.firestore.ordered.priceHistory})
        // }
        const channel = pusher.subscribe('price-channel');
        
        channel.bind(this.props.ticker, data => {
            this.setState({
                graphData: [data.prices, ...this.state.graphData],
            });
        });
    }

    // componentDidMount() {
    //     this.props.getGraphData(this.props.ticker);
    // }

    lastUpdated() {
        return moment().format("llll");
      }
    
    render() {
        let prices = []
        const history = this.props.history;
        const prop = this.props.ticker + "History";

        if(this.props[prop] === undefined) {
            let data = [{
                x: new Date(0),
                y: [0, 0, 0, 0]
            },
            {
                x: new Date(1),
                y: [0,0,0,0]
            }
            ]
            prices.push({data});
        }
        else {
            let data = [];
            const prop = this.props.ticker + "History";
            this.props[prop].forEach(function(x){
                var obj = {};
                obj.x = new Date(x.price.time * 1000).toLocaleString();
                obj.y = [x.price.open, x.price.high, x.price.low, x.price.close];
                data.push(obj);
            });
            this.state.graphData.forEach(function(x){
                var obj = {};
                obj.x = new Date(x.time * 1000).toLocaleString();
                obj.y = [x.open, x.high, x.low, x.close];
                data.push(obj);
            });
            prices.push({data});
        }
        return (
            <div id="chart">
                <CandleStickChart className="chart" options={this.state.options} series={prices} type="candlestick" />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    const propName = ownProps.ticker + "History"
	return {
        graphData: state.graph[ownProps.ticker],
        [propName]:  state.firestore.ordered[propName],
	}
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => [
    { collection: 'priceData',
        doc: 'priceHistory',
        subcollections: [
            { collection: props.ticker, orderBy: ['timeStamp', 'desc'], limit: 100 },
        ],
        storeAs: props.ticker+'History',
        }    
    ]))(PriceHistoryChart);