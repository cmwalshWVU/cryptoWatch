import React, { Component, useEffect } from "react";
import M from "materialize-css";
import './graph.css';
import PriceHistoryChart from './PriceHistoryChart';
import { Dialog } from "@material-ui/core";

class TradingViewChart extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
  
    componentDidMount() {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true;
      script.innerHTML = JSON.stringify({
  "width": 980,
  "height": 610,
  "symbol": "NASDAQ:AAPL",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "light",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "container_id": "tradingview_d5cae"
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

export default TradingViewChart