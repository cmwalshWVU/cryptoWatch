import React, { Component } from 'react';
import './Tickers.css';
import Cryptocurrency from './NewCryptocurrency';
import moment from 'moment';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { Grid, Dialog } from '@material-ui/core';
import {setGraphModal} from '../store/actions/graphAction';
import  GraphModal from './graphModal.js'
import TradingViewTickerTape from './TradingViewTickerTape';

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
        var tickerData = !this.props.currentPrices ? this.state.data : this.props.currentPrices;
        var top10 = tickerData.filter(currency => currency.cmc_rank <= 17 && currency.symbol != "TRX");
        // var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "eos", "stellar"];
        // var result = tickerData.filter(currency => wanted.includes(currency.id));
        var tickers = top10.map((currency) => {
			let ticker
			try {
				return <Cryptocurrency data={currency} ticker={currency.symbol} />
			} catch (err) {
				console.log(err)
			};
		})
            // <Cryptocurrency data={currency} key={currency.id} ticker={currency.symbol} toggleModal={this.toggleModal} modalOpen={this.state.modalOpen} />


		if (this.state.isLoading) {
			return (
	                <div className={"flex"}>{noData}</div>
	        ); 
		} else {
	        return (
				<> 
					{ tickerData.length > 10 ?  
						<TradingViewTickerTape topSymbols={top10.map((it) => it.symbol)} />
						: null 
					}
                	<div className={"flex"}>{tickers}</div>
					<GraphModal modalOpen={this.props.graphOpen} toggleModal={() => this.props.setGraphModal(undefined, false)} name={this.props.graphTicker} ticker={this.props.graphTicker} chartData={null} />
				</>
	        );
		}
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
    return {
        currentPrices: state.currentPrices.currentPrices,
		graphOpen: state.graph.open,
		graphTicker: state.graph.ticker
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setGraphModal: (ticker, open) => dispatch(setGraphModal(ticker, open))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Tickers);