import React, { Component }  from 'react';
import TransactionSummary from './TransactionSummary';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import '../../styles/card.css'

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.mapTransactions = this.mapTransactions.bind(this);
  }

  mapTransactions = (transactions) => {
    let personalTransactions = []
    if (transactions === undefined || transactions.length == 0 ) {
      personalTransactions = noData;
    }
    else {
      personalTransactions = transactions.map((transaction) => 
          <li key={transaction.id}>
            <span className={transaction.isPurchase == 'on' ? "green-text" : "red-text"}>{transaction.coin} </span>
            <span> ${transaction.dollarAmount}</span>
            <div className="grey-text note-date">
              {moment(transaction.purchaseDate.toDate()).fromNow()}
            </div>
          </li>
      );
    }
    return personalTransactions;
  }

  render() {
    const {  transactions, auth } = this.props;

    return (
      <div className="section">
        <div className="rounded-card card z-depth-0">
          <div className="card-content">
            <span className="card-title">Transactions</span>
            <ul className="Transactions">
                { this.mapTransactions(transactions) }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const noData = (<li key="someData">
<span >No Transactions </span>
</li>);


const mapStateToProps = (state) => {
  console.log(state);
  return {
    transactions:  state.firestore.ordered.personalTransactions,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: 'transactions',
        doc: props.auth.uid,
        subcollections: [
          { collection: 'transactions', limit: 3, orderBy: ['purchaseDate', 'desc'] },
        ],
        storeAs: 'personalTransactions'
      }    
  ])
)(TransactionList);