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
			symbol,
			price_usd,
			percent_change_1h,
			percent_change_24h,
			percent_change_7d,
			rank,
		} = this.props.data;
		// let props = [symbol, 30, false];
		// var rsiTicker = <Rsi data={props}  />;
		let graph = <GraphModal modalOpen={this.props.modalOpen} toggleModal={this.props.toggleModal} name={name} ticker={this.props.ticker} chartData={null} />;
		if (this.props.graphData !== undefined) {
			return (
				<li className={"cryptocurrency " + (percent_change_1h.indexOf("-") === -1? "positive" : "negative")}>
						<span className="cryptocurrency-name">{name}</span> <br />
						<span className="price">${ (+price_usd).toFixed(2) }</span><br />
						<span className="percent-change-1h">{percent_change_1h}% 1hr</span><br />
						<span className="percent-change-24h">{percent_change_24h}% 24hrs</span>
						<Rsi graphData={this.props.graphData} data={[this.props.ticker, 15, false]} />
						{graph}
				</li>
			)
		}
		else {
			return (
			<li className={"cryptocurrency " + (percent_change_1h.indexOf("-") === -1? "positive" : "negative")}>
					<span className="cryptocurrency-name">{name}</span> <br />
					<span className="price">${ (+price_usd).toFixed(2) }</span><br />
					<span className="percent-change-1h">{percent_change_1h}% 1hr</span><br />
					<span className="percent-change-24h">{percent_change_24h}% 24hrs</span>
					<Rsi graphData={this.props.graphData} data={[this.props.ticker, 15, false]} />
					{graph}
			</li>
		)
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	console.log(state);
	return {
		graphData: state.graph[ownProps.ticker],
	}
}

export default connect(mapStateToProps, {getGraphData})(Cryptocurrency);
// export default Cryptocurrency;
