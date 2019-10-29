import React, { Component } from 'react';
import './Tickers.css';
import Cryptocurrency from './cryptocurrency';
import moment from 'moment';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import pushid from 'pushid';

class Tickers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			updateHistory: true,
			prices: [],
			modalOpen: false,
			ticker: null
		};
	}

	componentDidMount() {

		const pusher = new Pusher('5994b268d4758d733605', {
			cluster: 'us2',
			encrypted: true
		});
	// const pusher = new Pusher({
	// 	appId: '827235',
	// 	key: '5994b268d4758d733605',
	// 	secret: '2b842a1cd8a65cc317f4',
	// 	cluster: 'us2',
	// 	encrypted: true
	// });
        // const pusher = new Pusher('5994b268d4758d733605', {
        //     cluster: 'us2',
        //     encrypted: true,
        // });

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-prices', data => {
			console.log(JSON.stringify(data.prices.Data));
            this.setState({
                prices: [...data.prices.Data, ...this.state.prices],
            });
        });
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	toggleModal = () => {
		this.setState({modalOpen: !this.state.modalOpen})
	}

	setGraphTicker = (ticker) => {
		this.setState({ticker: ticker})
	}

	render() {
		var tickerData = this.props.currentPrices == null ? this.state.data : this.props.currentPrices;
		var top10 = tickerData.filter(currency => currency.rank <= 8);
		// var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
		// var result = tickerData.filter(currency => wanted.includes(currency.id));
		var tickers = top10.map((currency) =>
			<Cryptocurrency data={currency} key={currency.id} ticker={currency.symbol} toggleModal={this.toggleModal} modalOpen={this.state.modalOpen} />
		);

		return (
            <div >
                <ul className="tickers">{!this.state.isLoading ? tickers : noData}</ul>
            </div>
		);
	}
}

const noData = (
    <div className="dashboard-section section">
		<div className="rounded-card card z-depth-0">
			<div className="card-content">
				<span >Loading Ticker Data... </span>
			</div>
		</div>
	</div>
);

const mapStateToProps = (state) => {
	console.log(state);
	return {
		currentPrices: state.currentPrices.currentPrices,
	}
}

export default connect(mapStateToProps)(Tickers);