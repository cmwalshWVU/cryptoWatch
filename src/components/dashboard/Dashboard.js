import React, { Component } from 'react';
import Notifications from './Notifications';
import ArticleList from '../newsArticles/articleList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import Tickers from '../tickers/tickers.js';
import TransactionList from '../transactions/TransactionList';
import Holdings from '../holdings/Holdings';
import { getCurrentPrices } from '../store/actions/currentPriceAction';
import { getCurrentData } from '../store/actions/cryptoActions';
import DemoDashboard from './DemoDashboard';
import { signInWithCustomToken } from '../store/actions/authActions';

class Dashboard extends Component {

  componentDidMount() {
    // this.props.getCurrentPrices();
    // this.props.getCurrentData();
    // this.interval = setInterval(() => this.props.getCurrentData(), 30 * 1000);
    // this.interval = setInterval(() => this.props.getCurrentPrices(), 30 * 1000);
  }

  render() {
    const { notifications, auth } = this.props;

    if (!auth.uid) {
      return <DemoDashboard />
    }
    
    else {
      return (
        <div>
          <div>
            <Tickers />
          </div>
          <div className="dashboard container">
            <div className="row">
              <div className="col s12 m6">
                <ArticleList  />
              </div>
              <div className="col s12 m5 offset-m1">
                <Holdings coinbaseAuthToken={this.props.coinbaseAuthToken} />
                <TransactionList />
                <Notifications notifications={notifications}/>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.firestore.ordered.projects,
    notifications: state.firestore.ordered.notifications,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps, {getCurrentPrices, getCurrentData, signInWithCustomToken}),
  firestoreConnect(props => [
    { collection: 'projects', orderBy: ['createdAt', 'desc']  },
    { collection: 'notifications', limit: 3,  orderBy: ['time', 'desc'] },
  ])
)(Dashboard);
