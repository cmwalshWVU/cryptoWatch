import React, { Component } from 'react';
import './Cryptocurrency.css';
import Rsi from './rsi.js';
import GraphModal from './graphModal.js';
import { connect } from 'react-redux';
import {getGraphData} from '../store/actions/graphAction';
import Pusher from 'pusher-js';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Card, CardContent, CardHeader, Avatar, IconButton, Grid, Paper } from '@material-ui/core';
import numbro from 'numbro'
import Chart from 'react-apexcharts';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";

class Cryptocurrency extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            graphData: [],
            chartData:null,
            rsi: null
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
        // this.props.getGraphData(this.props.ticker);
        // this.interval = setInterval(() => this.props.getGraphData(this.props.ticker), 30 * 1000);
    }

    series = (seriesData) => {
        let priceData = []
        // console.log(seriesData)
        if(seriesData === undefined || seriesData.length === 0) {
            let data = [{
                x: new Date(0),
                y: [0, 0, 0, 0]
            },
            {
                x: new Date(1),
                y: [0,0,0,0]
            }
            ]
            priceData.push({data});
        }
        else {
            let data = [];
            // console.log(`foreach ${prices.Data}`)
            try {
                seriesData.forEach((record) => {
                    var obj = {};
                    obj.x = new Date(record.price.time * 1000).toLocaleString();
                    obj.y = [record.price.close];
                    data.push(obj);               
                });
                priceData.push({data});
            } catch {
                let data = [{
                    x: new Date(0),
                    y: [0, 0, 0, 0]
                },
                {
                    x: new Date(1),
                    y: [0,0,0,0]
                }
                ]
                priceData.push({data});
            }
        }
        // console.log(priceData)
        return priceData
    }   

    options = () => { 
        return {
            chart: {
                type: 'line',
                toolbar: { tools: { download: false } },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false,
                },
                menu: {
                    show: false
                }
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom:0
                }
            },
            legend: {
                show: false
            },
            tooltip: {
                enabled: false
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth',
              width: 3
            },
            xaxis: {
                labels: {
                    show: false,
                    maxHeight: 120,
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    maxWidth: 120,
                }
            }
          }
    }

    subheader = (price, percent) => {
        return (
            <div className={"ticker-sub-header"}>
                <div className={"ticker-price"} >
                    ${numbro(price).format({
                        mantissa: 2,
                        thousandSeparated: true
                    })} 
                </div>
                <div className={percent < 0 ? "negative-change" : "positive-change"} >
                    {numbro(percent).format({
                        average: true,
                        mantissa: 2,
                    })}%
                </div> 
            </div>
        )
    }
    
    render() {
        let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
        try {
            icon = require(`cryptocurrency-icons/32/icon/${this.props.ticker.toLowerCase()}.png`); 
            // do stuff
        } catch (ex) {
            console.log(`Using generic icon for ${this.props.ticker}`)
        }
        var { name, quote } = this.props.data;
        // let props = [symbol, 30, false];
        // var rsiTicker = <Rsi data={props}  />;
        let graph = <GraphModal modalOpen={this.props.modalOpen} toggleModal={this.props.toggleModal} name={name} ticker={this.props.ticker} chartData={null} />;
        const percent_change_1h = quote.USD.percent_change_1h;

        const prop = this.props.ticker + "History";

        const override = css`
            display: block;
            margin: 25px auto;
            size: 5px;
            width: 60px;
            height: 60px;
            border-color: red;
        `;

        if (this.props.graphData !== undefined || this.props[prop] !== undefined) {
            const data = []
            if (this.props[prop] !== undefined) {
                data.push(...this.props[prop])
            }
            if (this.props.graphData !== undefined) {
                data.push(...this.props.graphData)
            }
            return (
                <Card className="ticker-card">
                    <CardHeader
                        className={"ticker-header"}
                        avatar={<img className={"icon"} src={icon}/>}
                        title={name}
                        subheader={this.subheader(quote.USD.price, quote.USD.percent_change_24h)}
                        
                    />
                    <CardContent >
                        <Chart height={100} options={this.options()} type="line" 
                            series={[{
                                data: this.series(data)[0].data,
                                name: this.props.ticker
                            }]} />
                        <Grid className={"ticker-items"} container spacing={1}>
                            <Grid item  xs={12}>
                                <Grid className={"ticker-card-items"} container alignContent="center" justify="center" spacing={1}>
                                    
                                    <Grid key={2} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                                Vol
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                ${ numbro(quote.USD["volume_24h"]).format({
                                                    average: true,
                                                    mantissa: 2,
                                                })}
                                            </div>                                        
                                        </div>
                                    </Grid>
                                    <Grid key={3} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                                % 1h
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                {numbro(quote.USD.percent_change_1h).format({
                                                    average: true,
                                                    mantissa: 2,
                                                })}%
                                            </div>                                        
                                        </div>
                                    </Grid>
                                    <Grid key={4} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                                RSI
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                <Rsi graphData={data} data={[this.props.ticker, 15, false]} />
                                            </div>                                        
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                // {/* </Grid> */}
        )
        } else {
            return (
                    <Card className="ticker-card">
                    <CardHeader
                        className={"ticker-header"}
                        avatar={<img className={"icon"} src={icon}/>}
                        title={name}
                        subheader={this.subheader(quote.USD.price, quote.USD.percent_change_24h)}
                    />
                    <CardContent >
                        <ClipLoader
                            css={override}
                            size={100}
                            //size={"150px"} this also works
                            color={"#339989"}
                            loading={true}
                        />
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justify="center" spacing={1}>
                                    
                                    <Grid key={2} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                            Vol
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                ${ numbro(quote.USD["volume_24h"]).format({
                                                    average: true,
                                                    mantissa: 2,
                                                })}
                                            </div>                                        
                                        </div>
                                    </Grid> 
                                    <Grid key={3} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                                % 1h
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                {numbro(quote.USD.percent_change_1h).format({
                                                    average: true,
                                                    mantissa: 2,
                                                })}%
                                            </div>                                        
                                        </div>
                                    </Grid>
                                    <Grid key={4} item>
                                        <div className={""} >
                                            <div className={"ticker-row"}>
                                                RSI
                                            </div>
                                            <div text-center className={"ticker-row-value"} >
                                                <Rsi graphData={[]} data={[this.props.ticker, 15, false]} />
                                            </div>                                        
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                // </Grid>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const propName = ownProps.ticker + "History"
    return {
        graphData: state.graph[ownProps.ticker],
        [propName]:  state.firestore.ordered[propName]
    }
}
// export default connect(mapStateToProps, {getGraphData})(Cryptocurrency);

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
    ]))(Cryptocurrency);
