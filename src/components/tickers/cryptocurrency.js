import React, { Component } from 'react';
import './Cryptocurrency.css';
import Rsi from './rsi.js';
import GraphModal from './graphModal.js';
import { connect } from 'react-redux';
import {getGraphData} from '../store/actions/graphAction';

class Cryptocurrency extends Component {
	
	constructor(props) {
        super(props);

        this.state = {
            chartData:null,
            rsi: null
        }   
	}
	
	componentDidMount() {
        this.props.getGraphData(this.props.ticker);
        this.interval = setInterval(() => this.props.getGraphData(this.props.ticker), 30 * 1000);
    }

	render() {
		var {
			name,
			quote,
		} = this.props.data;
		// let props = [symbol, 30, false];
		// var rsiTicker = <Rsi data={props}  />;
		let graph = <GraphModal modalOpen={this.props.modalOpen} toggleModal={this.props.toggleModal} name={name} ticker={this.props.ticker} chartData={null} />;
		const percent_change_1h = quote.USD.percent_change_1h;
		if (this.props.graphData !== undefined) {
			return (
				<li className={"cryptocurrency " + (percent_change_1h < 0 ? "negative" : "positive")}>
					<div className="cryptocurrency-name">{name}</div>
					<div className="price">${ (+quote.USD.price).toFixed(2) }</div>
					<div className="percent-change-1h">{quote.USD.percent_change_1h}% 1hr</div>
					<div className="percent-change-24h">{quote.USD.percent_change_24h}% 24hrs</div>
					<Rsi graphData={this.props.graphData} data={[this.props.ticker, 15, false]} />
					{graph}
				</li>
			)
		}
		else {
			return (
			<li className={"cryptocurrency " + (percent_change_1h < 0 ? "negative" : "positive")}>
				<div className="cryptocurrency-name">{name}</div>
				<div className="price">${ (+quote.USD.price).toFixed(2) }</div>
				<div className="percent-change-1h">{quote.USD.percent_change_1h}% 1hr</div>
				<div className="percent-change-24h">{quote.USD.percent_change_24h}% 24hrs</div>
				<Rsi graphData={this.props.graphData} data={[this.props.ticker, 15, false]} />
				{graph}
			</li>
		)
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		graphData: state.graph[ownProps.ticker],
	}
}

export default connect(mapStateToProps, {getGraphData})(Cryptocurrency);
// export default Cryptocurrency;
