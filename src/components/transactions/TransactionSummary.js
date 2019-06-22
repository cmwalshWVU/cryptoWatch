import React from 'react';
import moment from 'moment';

const TransactionSummary = ({transaction}) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title"> ${transaction.dollarAmount}</span>
        <p className="bold"> Coin: {transaction.coin}</p>
        <p> Purchase Date: {moment(transaction.purchaseDate.toDate()).calendar()} </p>
      </div>
    </div>
  )
}

export default TransactionSummary;
