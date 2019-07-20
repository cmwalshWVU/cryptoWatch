import React from "react";
import CandleStickChart from 'react-apexcharts';
import './PriceHistoryChart.css';
import moment from 'moment';
import { connect } from 'react-redux';
import {getGraphData} from '../store/actions/graphAction';

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
        this.props.getGraphData(this.props.ticker);
        // this.interval = setInterval(() => this.props.getGraphData(this.props.ticker), 30 * 1000);
    }

    lastUpdated() {
        return moment().format("llll");
      }
    
    render() {
        let prices = []
        if(this.props.graphData === undefined) {
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
                this.props.graphData.Data.forEach(function(x){
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

const mapStateToProps = (state, ownProps) => {
	console.log(state);
	return {
		graphData: state.graph[ownProps.ticker],
	}
}

export default connect(mapStateToProps, {getGraphData})(PriceHistoryChart);