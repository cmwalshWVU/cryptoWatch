import axios from 'axios';

const API = 'https://api.coindesk.com/v1/bpi/';

class BitcoinService {
  static getCurrentPrice = () =>
    axios
      .get(`${API}currentPrice.json`, {})
      .then((response) => response.data, (error) => error.response.status);

  static getPrices = (startDate, endDate) =>
    axios
      .get(`${API}historical/close.json?start=${startDate}&end=${endDate}`, {})
      .then((response) => response.data, (error) => error.response.status);


  static getRsiData = ( ticker, interval ) =>
  	axios
  		.get('https://min-api.cryptocompare.com/data/histominute?fsym=${ticker}&tsym=USD&limit=14&aggregate=${interval}&e=CCCAGG', {})
  		.then((response) => response.data, (error) => error.response.status);

  static getCryptoComparePrices = (ticker, interval, type) =>
    axios.get('https://min-api.cryptocompare.com/data/' + type + '?fsym=' + ticker + '&tsym=USD&limit=500&aggregate='+ interval + '&e=CCCAGG')
    .then((response) => response.data, (error) => error.response.status);

  static calculateRsi = ( prices ) => {
    let gains = 0;
    let loses = 0;
    let RSI = 0;
    prices = prices.reverse();
    if (prices != null && prices.length > 1) {
      for(let i = 0; i < 15; i++) {
        let change = prices[i].close - prices[i].open;
        if (change > 0) {
          gains += change;
        }
        else if (change < 0) {
          loses += Math.abs(change);
        }
      }
      let rs = (gains/15)/(loses/15);
      RSI = 100 - (100/( 1 + rs));
    }
    return RSI;
  }

  getPricesByTicker = (ticker) => {
    try {
        let i = this.state.interval;
        let type = "histominute";
        if( this.state.isHourly ===  true) {
            type = "histohour";
        }
        const prices = BitcoinService.getCryptoComparePrices(ticker, i, type);
        this.setState({ prices: prices.Data });
        this.setState({ isLoading: false });
    } catch (error) {
        this.setState({ isLoading: false });
        this.setState({ error: error.message });
    }
}

}

export default BitcoinService;
