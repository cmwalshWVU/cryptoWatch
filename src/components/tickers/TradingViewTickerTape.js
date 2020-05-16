import React, { Component, useEffect } from "react";
import M from "materialize-css";
import './graph.css';
import PriceHistoryChart from './PriceHistoryChart';
import { Dialog } from "@material-ui/core";

class TradingViewTickerTape extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
  
    componentDidMount() {
      const symbols = this.props.topSymbols.map((ticker) => {
        return {
          "proName": `KRAKEN:${ticker}USD`,
          "title": `${ticker}/USD`
        }
      })

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.async = true;
      script.innerHTML = JSON.stringify( {
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
          },
          {
            "proName": "FOREXCOM:NSXUSD",
            "title": "Nasdaq 100"
          },
          {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR/USD"
          },
          ...symbols
        ],
        "colorTheme": "light",
        "isTransparent": false,
        "displayMode": "compact",
        "locale": "en"
      })
      this.myRef.current.appendChild(script);
    }
  
    render() {
      return(
        <div className="tradingview-widget-container" ref={this.myRef}>
            <div className="tradingview-widget-container__widget"></div>    
        </div>
      );
    }
}

export default TradingViewTickerTape