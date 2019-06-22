import React, { Component } from "react";
import M from "materialize-css";
import './graph.css';
import PriceHistoryChart from './PriceHistoryChart';
import BitcoinService from './bitcoinService';
import axios from 'axios';

class GraphModal extends Component {

  componentDidMount() {
    const options = {
      onOpenStart: () => {
        console.log("Open Start");
      },
      onOpenEnd: () => {
        console.log("Open End");
      },
      onCloseStart: () => {
        console.log("Close Start");
      },
      onCloseEnd: () => {
        console.log("Close End");
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%"
    };
    M.Modal.init(this.Modal, options);
    // If you want to work on instance of the Modal then you can use the below code snippet 
    // let instance = M.Modal.getInstance(this.Modal);
    // instance.open();
    // instance.close();
    // instance.destroy();
    // this.getPricesByTicker(this.props.ticker);
  }

  render() {
    let clazz = this.props.ticker + " modal-content";
    let modalClazz = this.props.ticker + " modal";
    return (
      <>
        <div className="right-align">
          <a
            className="graph modal-trigger"
            data-target={modalClazz}
          >
            <i className="material-icons Small">insert_chart</i>

          </a>
        </div>
        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id={modalClazz}
          className={modalClazz}
        >
          {/* If you want Bottom Sheet Modal then add 
        bottom-sheet class */}
          <div className={clazz}>
            <h4>{this.props.name} Data</h4>
            <PriceHistoryChart className={clazz} ticker={this.props.ticker}/>
          </div>
          <div className="modal-footer">
            <a href="#" className="modal-close waves-effect waves-grey btn-flat">
              Close
            </a>
          </div>
        </div>
      </>
    );
  }
}

export default GraphModal;
