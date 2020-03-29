import React, { Component } from 'react';
import './Cryptocurrency.css';
import Rsi from './rsi.js';
import GraphModal from './graphModal.js';
import { connect } from 'react-redux';
import {getGraphData} from '../store/actions/graphAction';
import Pusher from 'pusher-js';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

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

    render() {
        var { name, quote } = this.props.data;
        // let props = [symbol, 30, false];
        // var rsiTicker = <Rsi data={props}  />;
        let graph = <GraphModal modalOpen={this.props.modalOpen} toggleModal={this.props.toggleModal} name={name} ticker={this.props.ticker} chartData={null} />;
        const percent_change_1h = quote.USD.percent_change_1h;

        const prop = this.props.ticker + "History";

        if (this.props.graphData !== undefined || this.props[prop] !== undefined) {
            const data = []
            if (this.props[prop] !== undefined) {
                data.push(...this.props[prop])
            }
            if (this.props.graphData !== undefined) {
                data.push(...this.props.graphData)
            }
            return (
                <li className={"cryptocurrency " + (percent_change_1h < 0 ? "negative" : "positive")}>
                    <div className="cryptocurrency-name">{name}</div>
                    <div className="price">${ (+quote.USD.price).toFixed(2) }</div>
                    <div className="percent-change-1h">{(quote.USD.percent_change_1h).toFixed(3)}% 1hr</div>
                    <div className="percent-change-24h">{(quote.USD.percent_change_24h).toFixed(3)}% 24hrs</div>
                    <Rsi graphData={data} data={[this.props.ticker, 15, false]} />
                    {graph}
                </li>
            )
        }
        else {
            return (
            <li className={"cryptocurrency " + (percent_change_1h < 0 ? "negative" : "positive")}>
                <div className="cryptocurrency-name">{name}</div>
                <div className="price">${ (+quote.USD.price).toFixed(2) }</div>
                <div className="percent-change-1h">{(quote.USD.percent_change_1h).toFixed(2)}% 1hr</div>
                <div className="percent-change-24h">{(quote.USD.percent_change_24h).toFixed(2)}% 24hrs</div>
                <Rsi graphData={[]} data={[this.props.ticker, 15, false]} />
                {graph}
            </li>
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