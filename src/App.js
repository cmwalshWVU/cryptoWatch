import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/layouts/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import ProjectDetails from './components/projects/ProjectDetails';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import CreateProject from './components/projects/CreateProject';
import CreateTransaction from './components/transactions/CreateTransaction';
import CreateCoinTransaction from './components/transactions/CreateCoinTransaction';

const handleAuthentication = (props) => {
  console.log("Attempting redirect")
  axios.post(`https://us-central1-crypto-watch-dbf71.cloudfunctions.net/token`, { props })
      .then(res => {
          console.log(res);
          console.log(res.data);
      })

}

function App()  {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/create" component={CreateProject} />
          <Route path="/record" component={CreateTransaction} />
          <Route path="/coinRecord" component={CreateCoinTransaction} />
          <Route path="/redireect" render={(props) => {
            handleAuthentication(props);
            <Redirect to='/' />}
            }
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
