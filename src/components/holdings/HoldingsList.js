import React, { Component }  from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class HoldingsList extends Component {
  constructor(props) {
    super(props);

    this.mapHoldings = this.mapHoldings.bind(this);
  }

  mapHoldings = (holdings) => {
    let personalHoldings = []
    if (holdings === undefined || holdings.length == 0 ) {
        personalHoldings = noData;
    }
    else {
        var totalHoldings = holdings.reduce((a, b) => a + (b['dollarHoldings'] || 0), 0);
        personalHoldings = holdings.filter(mem => mem.dollarHoldings > 0).map((holding) => 
          <li key={holding.id}>
            <span className="green-text">{holding.coin} </span>
            <span> ${holding.dollarHoldings}</span>
            <div className="grey-text note-date">
                {(holding.dollarHoldings/totalHoldings).toFixed(2) * 100}% Total Holding
            </div>

          </li>
      );
    }
    return personalHoldings;
  }

  render() {
    const {  holdings, auth } = this.props;

    return (
     
            <ul className="Holdings">
                { this.mapHoldings(holdings) }
            </ul>        
    )
  }
}

const noData = (<li key="someData">
    <span >No Personal Holdings </span>
    </li>);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    holdings:  state.firestore.ordered.personalHoldings,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: 'holdings',
        doc: props.auth.uid,
        subcollections: [
          { collection: 'holdings', limit: 3, orderBy: ['lastUpdated', 'desc'] },
        ],
        storeAs: 'personalHoldings'
      }    
  ])
)(HoldingsList);