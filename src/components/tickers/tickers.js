import React, { Component } from 'react';
import './Tickers.css';
import Cryptocurrency from './cryptocurrency';
import axios from 'axios';
import moment from 'moment';
import { getCurrentData } from '../store/actions/cryptoActions';
import { connect } from 'react-redux';

class Tickers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: [
			],
			updateHistory: true
		};
	}

	componentDidMount() {
		this.props.getCurrentData();
		// this.interval = setInterval(() => this.fetchCryptocurrenncyData(), 30 * 1000);
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	render() {
		var tickerData = this.props.tickerData == null ? this.state.data : this.props.tickerData;
		var tickers = tickerData.map((currency) =>
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
		tickerData: state.crypto.tickerData,
	}
}

export default connect(mapStateToProps, {getCurrentData})(Tickers);