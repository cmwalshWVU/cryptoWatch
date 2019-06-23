import React, { Component } from 'react';
import Notifications from './Notifications';
import ProjectList from '../projects/ProjectList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import Tickers from '../tickers/tickers.js';
import TransactionList from '../transactions/TransactionList';

class Dashboard extends Component {

  render() {
    const { projects, notifications, transactions, auth } = this.props;

    if (!auth.uid) {
      return <Redirect to='/signin' />
    }
    
    else {
      return (
        <div>
          <div>
            <Tickers />
          </div>
          <div className="dashboard container">
            <div className="row">
              <div >  
              </div>
              <div className="col s12 m6">
                <ProjectList projects={projects} />
              </div>
              <div className="col s12 m5 offset-m1">
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
  console.log(state);

  return {
    projects: state.firestore.ordered.projects,
    notifications: state.firestore.ordered.notifications,
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    { collection: 'projects', orderBy: ['createdAt', 'desc']  },
    { collection: 'notifications', limit: 3,  orderBy: ['time', 'desc'] },
  ])
)(Dashboard);
