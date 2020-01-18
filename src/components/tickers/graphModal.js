import React, { Component } from "react";
import M from "materialize-css";
import './graph.css';
import PriceHistoryChart from './PriceHistoryChart';

class GraphModal extends Component {

  componentDidMount() {
    const options = {
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
  }

  render() {
    let clazz = this.props.ticker + " modal-content";
    let modalClazz = "rounded " + this.props.ticker + " modal";
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
            <PriceHistoryChart className={clazz} ticker={this.props.ticker} />
            <div className="modal-footer">
              <a href="#" className="greyButton modal-close waves-effect btn">
                Close
              </a>
            </div>
          </div>
          
        </div>
      </>
    );
  }
}


// const mapStateToProps = (state, ownProps) => {
//   console.log(state);
//   return {
//     history:  state.firestore.ordered.priceHistory,
//   }
// }

export default GraphModal;