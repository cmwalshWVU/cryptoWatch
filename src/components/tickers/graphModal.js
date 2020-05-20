import React, { Component, useEffect } from "react";
import './graph.css';
import { Dialog } from "@material-ui/core";
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

class GraphModal extends React.Component  {

  render() {
    let clazz = this.props.ticker + " modal-content";
    let modalClazz = "paperWidthLg rounded " + this.props.ticker + " modal";
    return (
      <Dialog maxWidth={"xl"} clasName={modalClazz} open={this.props.modalOpen} onClose={() => this.props.toggleModal(undefined, false)}>
        <div className={"trading-view-wrapper"}>
          <TradingViewWidget
              symbol={`KRAKEN:${this.props.ticker}USD`}
              theme={Themes.DARK}
              locale="fr"
              autosize
            />
        </div>  
      </Dialog>
    );
  }
}

export default GraphModal;