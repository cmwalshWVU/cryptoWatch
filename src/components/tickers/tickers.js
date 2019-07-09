import React, { Component } from 'react';
import './Tickers.css';
import Cryptocurrency from './cryptocurrency';
import axios from 'axios';
import moment from 'moment';
import * as cryptoActions from '../store/actions/cryptoActions';
import { connect } from 'react-redux';

class Tickers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentBtcPrice: "N/A",
			prices: [
				{
					close: 0,
					high: 0,
					low: 0,
					open: 0,
					time: 0,
					volumefrom: 0,
					volumeto: 0
				}
			],
			data: [
				{
					id: "bitcoin",
					name: "Bitcoin",
					symbol: "BTC",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "ethereum",
					name: "Ethereum",
					symbol: "ETH",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "litecoin",
					name: "Litecoin",
					symbol: "LTC",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "ripple",
					name: "Ripple",
					symbol: "XRP",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "neo",
					name: "NEO",
					symbol: "NEO",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_2hh: "0",
					percent_change_7d: "0",
				},
				{
					id: "bitcoin-cash",
					name: "Bitcoin Cash",
					symbol: "BCH",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "eos",
					name: "EOS",
					symbol: "EOS",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "stellar",
					name: "Stellar",
					symbol: "XLM",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "tether",
					name: "Tether",
					symbol: "USDT",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "cardano",
					name: "Cardano",
					symbol: "ADA",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				}
			],
			updateHistory: true
		};
	}

	componentDidMount() {
		this.fetchCryptocurrenncyData();
		this.getPricesByTicker("BTC");
		this.interval = setInterval(() => this.fetchCryptocurrenncyData(), 30 * 1000);
	}

	fetchCryptocurrenncyData() {
		axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=20")
			.then(response => {
				var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
	      var result = response.data.filter(currency => wanted.includes(currency.id));
	      this.setState({ data: result});
	      var btc = ["bitcoin"];
	      let currentPrice = response.data.filter(currency => btc.includes(currency.id));
	      this.setState({ currentBtcPrice: currentPrice.price_usd});
			})
			.catch(err => console.log(err));
	}

	getPricesByTicker(ticker) {
        try {
			this.setState({ isLoading: true });
            const prices = axios.get('https://min-api.cryptocompare.com/data/histominute?fsym=' + ticker + '&tsym=USD&limit=1&aggregate=30&e=CCCAGG')
                .then(response => {
            		var prices = response.data;
            		this.setState({ prices: prices.Data });
                	this.setState({ isLoading: false });
                })
                .catch(err => console.log(err));
        } catch (error) {
        this.setState({ isLoading: false });
        this.setState({ error: error.message });
        }
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	render() {
		var tickerData = this.props.tickerData == null ? this.state.data : this.props.tickerData;
		var tickers = tickerData.map((currency) =>
			<Cryptocurrency data={currency} key={currency.id} ticker={currency.symbol} />
		);

		var currentPrice = parseFloat( this.state.data[0].price_usd).toFixed(2);
		return (
            <div >
                <ul className="tickers">{!this.state.isLoading ? tickers : null}</ul>
            </div>
            
		);
	}
}

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 	  getCurrentData: () => dispatch(cryptoActions.getCurrentData())
// 	}
//   }

const mapStateToProps = (state) => {
	console.log(state);
	return {
		tickerData: state.tickerData,
	}
}

export default connect(mapStateToProps, cryptoActions)(Tickers);