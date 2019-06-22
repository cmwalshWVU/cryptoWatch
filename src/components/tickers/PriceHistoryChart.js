import React, {Component} from "react";
import CandleStickChart from 'react-apexcharts';
import './PriceHistoryChart.css';
import BitcoinService from './bitcoinService';
import axios from 'axios';
import moment from 'moment';

class PriceHistoryChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chartData:null,
            options: {
                title: {
                text: 'Price History',
                align: 'center'
                },
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
                        return "$" + value.toFixed(4);
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
        this.getPricesByTicker(this.props.ticker);
        this.interval = setInterval(() => this.getPricesByTicker(this.props.ticker), 30 * 1000);
    }

    getPricesByTicker = (ticker) => {
        axios.get('https://min-api.cryptocompare.com/data/histominute?fsym=' + ticker + '&tsym=USD&limit=100&aggregate=15&e=CCCAGG')
            .then(response => {
                var prices = response.data;
                this.setState({ chartData: prices.Data });
            })
            .catch(err => console.log(err));
    }
    
    lastUpdated() {
        return moment().format("llll");
      }
    
    render() {
        let prices = []
        if(this.state.chartData ==  null) {
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
                    this.state.chartData.forEach(function(x){
                        var obj = {};
                        obj.x = new Date(x.time * 1000).toLocaleString();
                        obj.y = [x.open, x.high, x.low, x.close];
                        data.push(obj);
            });
            prices.push({data});
        }
        return (
        <div id="chart">
            <CandleStickChart className="chart" options={this.state.options} series={prices} type="candlestick" height="350" />
            <small className="last-updated">Last Updated: {this.lastUpdated()}</small>
        </div>
        );
    }
}
export default PriceHistoryChart;
