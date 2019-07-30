import React, { Component } from 'react';
import ArticleList from '../newsArticles/articleList';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Tickers from '../tickers/tickers.js';
import { getCurrentPrices } from '../store/actions/currentPriceAction';
import { getCurrentData } from '../store/actions/cryptoActions';
import ReactApexChart from "react-apexcharts";
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import '../holdings/chart.css';

class DemoDashboard extends Component {

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
    }

    componentDidMount() {
        this.props.getCurrentPrices();
        this.interval = setInterval(() => this.props.getCurrentPrices(), 30 * 1000);
    }

    lastUpdated() {
	    return moment().format("lll");
    }
    
    render() {
        let { options } = this.state;
        let mapping = [];
        mapping.options = options;
        mapping.series = [100, 1000, 100, 400];
        options.labels = ['ETH', 'BTC', 'LTC', 'NEO'];

    
        return (
            <div>
                <div>
                    <Tickers />
                </div>
                <div className="dashboard container">
                    <div className="row">
                    <div className="col s12 m6">
                        <ArticleList  />
                    </div>
                        <div className="col s12 m5 offset-m1">
                            <div className="App">
                                <center><h5 className="App-title">Current Holdings: <NavLink to="/signin">Log In</NavLink>/<NavLink to="/signup">Sign Up</NavLink> </h5></center>
                                <div className="dashboard-section section rounded-card card z-depth-0 card-content">
                                    <span><center>Last updated: {this.lastUpdated()}</center></span>
                                    <ReactApexChart className="holdings-chart padding" options={mapping.options} series={mapping.series} type="pie" />
                                    <h6 ><center><NavLink to="/signin">Log In</NavLink> / <NavLink to="/signup">Sign Up</NavLink> to track actual holdings in real time</center></h6>
                                </div>
                                
                            </div>
                
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
  connect(null, {getCurrentPrices, getCurrentData})
)(DemoDashboard);
