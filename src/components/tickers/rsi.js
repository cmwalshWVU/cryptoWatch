import React, { Component } from 'react';
import axios from 'axios';
import BitcoinService from './bitcoinService.js';

class Rsi extends Component {

	constructor(props) {
		super(props);
		this.state = {
			interval: 30,
			prices: null,
			rsi: null,
			numberOfObjects: 14,
			previousData: null,
			currentPrices: null
		};
		// this.db.settings({
		// 	timestampsInSnapshots: true
		// });
	    this._isMounted = false;
	    this.previousData = null;
	}
    
	componentDidMount() {
		this._isMounted = true;
	    // this.getPrices();
		// this.interval = setInterval(() => this.getPrices(),  6 * 1000);
		
		// this.calculateRsi()
	}

	componentWillUnmount() {
	   this._isMounted = false;
	}

	isWithinInterval( timeStamp ) {
  		let currentTime = new Date();
  		let previousTime = new Date(timeStamp);
  		if (this.state.isHourly) {
  			let currentHours = (new Date()).getHours();
  			let previousHours = new Date(timeStamp).getHourss();
			if ((currentHours - previousHours) >= (this.state.interval * 60) && (currentHours - previousHours) >= (this.state.interval * 60 * 2)) {
				return true;
			}
			else return false;
  		}
  		else {
  			if ((currentTime.getTime() - previousTime.getTime()) >= (60000 * 60)){
  				let currentMinutes = (new Date()).getMinutes();
  				let previousMinutes = new Date(timeStamp).getMinutes();
  				if ((currentMinutes - previousMinutes) >= this.state.interval && (currentMinutes - previousMinutes) <= (this.state.interval * 2)) {
  					return true;
  				}
  				return false;
  			}
  		}
  	}

  	getPreviousData() {
  		this.db.collection('RSI').doc(this.props.data[0]).get().then(function(doc) {
		    if (doc.exists) {
		    	this.setState({ previousData:  doc.data().rsi });
		    } else {
		    	this.setState({ previousData:  null });
		    }
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		});
  	}

	getPrices() {
    try {
    	var token = this.props.data[0];
    	var interval = this.props.data[1];
    	var hourly = this.props.data[2];

	    let type = "histominute";
	    if( {hourly} ===  true) {
	    	type = "histohour";
    	}
	    let isHourly = hourly
	    const prices = axios.get('https://min-api.cryptocompare.com/data/' + type + '?fsym=' + token + '&tsym=USD&limit=' + this.state.numberOfObjects + '&aggregate='+ interval + '&e=CCCAGG')
    		.then(response => {
                var prices = response.data;
                this.setState({ currentPrices: prices.Data });
              	this.setState({ isLoading: false });
            		this.calculateRsi();
			})
			.catch(err => console.log(err));
  	} catch (error) {
	      this.setState({ isLoading: false });
	      this.setState({ error: error.message });
  	}
	}

	calculateRsi = async () => {
		if(this.props.graphData !== undefined) {
			let RSI = await BitcoinService.calculateRsi(this.props.graphData);
			this.setState({ rsi: RSI.toFixed(2) });
		}
	}

	render() {
		var rsi = 0
		if(this.props.graphData !== undefined) {
			rsi = BitcoinService.calculateRsi(this.props.graphData).toFixed(2);
		}
	  	return (
			  <div>
			<span className="current-rsi"> RSI: {rsi}</span>
			</div>
		);
	}
}
export default Rsi;
