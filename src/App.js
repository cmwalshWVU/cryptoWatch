import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/layouts/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import ProjectDetails from './components/projects/ProjectDetails';
import AuthScreen from './components/auth/AuthScreen';

import CreateProject from './components/projects/CreateProject';
import CreateTransaction from './components/transactions/CreateTransaction';
import CreateCoinTransaction from './components/transactions/CreateCoinTransaction';
import CoinbaseSignin from './components/auth/CoinbaseSignin';

// const handleAuthentication = (props) => {
//   console.log("Attempting redirect")
//   axios.post(`https://us-central1-crypto-watch-dbf71.cloudfunctions.net/token`, { props })
//       .then(res => {
//           console.log(res);
//           console.log(res.data);
//       })

// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      coinbaseAuthToken: null
    }
  }

  setCoinbaseAuth = (token) => {
    this.setState({coinbaseAuthToken: token});
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route exact path="/" component={(props) => <Dashboard {...props} coinbaseAuthToken={this.state.coinbaseAuthToken} />} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/signin" component={() => <AuthScreen tab={0} />} />
            <Route path="/signup" component={() => <AuthScreen tab={1} />} />
            <Route path="/create" component={CreateProject} />
            <Route path="/record" component={CreateTransaction} />
            <Route path="/coinRecord" component={CreateCoinTransaction} />
            <Route path="/redirect" component={(props) => <CoinbaseSignin {...props} setCoinbaseAuth={this.setCoinbaseAuth} />} />
            <Route component={(props) => <Redirect to={"/"} />} />
            />
            {/* <Route path="/redireect" render={(props) => {
              handleAuthentication(props);
              return <Redirect to='/' />}
              }
            /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
