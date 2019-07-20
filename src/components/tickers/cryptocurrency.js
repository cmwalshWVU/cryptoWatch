import React, { Component } from 'react';
import './Cryptocurrency.css';
import Rsi from './rsi.js';
import GraphModal from './graphModal.js';

class Cryptocurrency extends Component {
	
	render() {
		var {
			name,
			symbol,
			price_usd,
			percent_change_1h,
			percent_change_24h,
			percent_change_7d,
			rank,
		} = this.props.data;
		// let props = [symbol, 30, false];
		// var rsiTicker = <Rsi data={props}  />;
		let graph = <GraphModal name={name} ticker={this.props.ticker} chartData={null} />;
		return (
			<li className={"cryptocurrency " + (percent_change_1h.indexOf("-") === -1? "positive" : "negative")}>
					<span className="cryptocurrency-name">{name}</span> <br />
					<span className="price">${ (+price_usd).toFixed(2) }</span><br />
					<span className="percent-change-1h">{percent_change_1h}% 1hr</span><br />
					<span className="percent-change-24h">{percent_change_24h}% 24hrs</span>
					{graph}
			</li>
		)
	}
}

export default Cryptocurrency;
