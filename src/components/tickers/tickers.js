import React, { Component } from 'react';
import './Tickers.css';
import Cryptocurrency from './cryptocurrency';
import moment from 'moment';
import { connect } from 'react-redux';

class Tickers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			updateHistory: true
		};
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	render() {
		var tickerData = this.props.currentPrices == null ? this.state.data : this.props.currentPrices;
		var top10 = tickerData.filter(currency => currency.rank <= 8);
		// var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
		// var result = tickerData.filter(currency => wanted.includes(currency.id));
		var tickers = top10.map((currency) =>
			<Cryptocurrency data={currency} key={currency.id} ticker={currency.symbol} />
		);

		return (
            <div >
                <ul className="tickers">{!this.state.isLoading ? tickers : null}</ul>
            </div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		currentPrices: state.currentPrices.currentPrices,
	}
}

export default connect(mapStateToProps)(Tickers);